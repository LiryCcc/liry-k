#!/usr/bin/env node
import { once } from 'node:events';
import { createReadStream, createWriteStream, existsSync } from 'node:fs';
import { cp, lstat, mkdir, readdir, readlink, rm, stat } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { createGzip, type Gzip } from 'node:zlib';

const workspaceRoot = import.meta.dirname;
const outputDir = join(workspaceRoot, 'release-archives');
const skipDirectoryNames = new Set(['node_modules', '.git']);
const distSearchRoots = ['apps', 'packages', 'infra', 'demos'] as const;
const tarBlockSize = 512;

const allocateOutputName = (used: Set<string>, desired: string): string => {
  if (!used.has(desired)) {
    used.add(desired);
    return desired;
  }
  const tarGzSuffix = '.tar.gz';
  const isTarGz = desired.endsWith(tarGzSuffix);
  const stem = isTarGz ? desired.slice(0, -tarGzSuffix.length) : desired.replace(/(\.[^./]+)$/, '');
  const extension = isTarGz ? tarGzSuffix : desired.slice(stem.length);
  for (let index = 2; ; index += 1) {
    const candidate = `${stem}-${index}${extension}`;
    if (!used.has(candidate)) {
      used.add(candidate);
      return candidate;
    }
  }
};

const walk = async (
  directory: string,
  visit: (entryPath: string, name: string, isDirectory: boolean) => Promise<boolean>
): Promise<void> => {
  if (!existsSync(directory)) {
    return;
  }
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (skipDirectoryNames.has(entry.name)) {
      continue;
    }
    const entryPath = join(directory, entry.name);
    const isDirectory = entry.isDirectory();
    const shouldDescend = await visit(entryPath, entry.name, isDirectory);
    if (isDirectory && shouldDescend) {
      await walk(entryPath, visit);
    }
  }
};

const writeOctal = (header: Buffer, offset: number, length: number, value: number): void => {
  const encoded = value.toString(8).padStart(length - 1, '0');
  header.write(encoded, offset, length - 1, 'latin1');
  header[offset + length - 1] = 0;
};

const splitUstarPath = (posixPath: string): { name: string; prefix: string } | undefined => {
  if (posixPath.length <= 100) {
    return { name: posixPath, prefix: '' };
  }
  for (let index = posixPath.length - 1; index >= 1; index -= 1) {
    if (posixPath[index] !== '/') {
      continue;
    }
    const prefix = posixPath.slice(0, index);
    const name = posixPath.slice(index + 1);
    if (prefix.length <= 155 && name.length <= 100 && name.length > 0) {
      return { name, prefix };
    }
  }
  return undefined;
};

const writeToGzip = async (gzip: Gzip, chunk: Uint8Array): Promise<void> => {
  if (chunk.byteLength === 0) {
    return;
  }
  if (!gzip.write(chunk)) {
    await once(gzip, 'drain');
  }
};

const padToTarBlock = async (gzip: Gzip, size: number): Promise<void> => {
  const remainder = size % tarBlockSize;
  if (remainder === 0) {
    return;
  }
  await writeToGzip(gzip, Buffer.alloc(tarBlockSize - remainder));
};

const writeTarHeader = async (
  gzip: Gzip,
  options: {
    name: string;
    prefix: string;
    mode: number;
    size: number;
    mtime: number;
    typeflag: string;
    linkname?: string;
  }
): Promise<void> => {
  const header = Buffer.alloc(tarBlockSize);
  header.write(options.name, 0, Math.min(options.name.length, 100), 'latin1');
  writeOctal(header, 100, 8, options.mode & 0o7777);
  writeOctal(header, 108, 8, 0);
  writeOctal(header, 116, 8, 0);
  writeOctal(header, 124, 12, options.size);
  writeOctal(header, 136, 12, options.mtime);
  header.fill(0x20, 148, 156);
  header.write(options.typeflag, 156, 1, 'latin1');
  if (options.linkname !== undefined) {
    header.write(options.linkname, 157, Math.min(options.linkname.length, 100), 'latin1');
  }
  header.write('ustar\0', 257, 6, 'latin1');
  header.write('00', 263, 2, 'latin1');
  header.write(options.prefix, 321, Math.min(options.prefix.length, 155), 'latin1');
  let checksum = 0;
  for (const byte of header) {
    checksum += byte;
  }
  const checksumText = checksum.toString(8).padStart(6, '0');
  header.write(checksumText, 148, 6, 'latin1');
  header[154] = 0;
  header[155] = 0x20;
  await writeToGzip(gzip, header);
};

const writeGnuLongName = async (gzip: Gzip, posixPath: string, mtime: number): Promise<void> => {
  const payload = Buffer.from(`${posixPath}\0`, 'utf8');
  await writeTarHeader(gzip, {
    name: '././@LongLink',
    prefix: '',
    mode: 0o644,
    size: payload.byteLength,
    mtime,
    typeflag: 'L'
  });
  await writeToGzip(gzip, payload);
  await padToTarBlock(gzip, payload.byteLength);
};

const writeTarEntryHeader = async (
  gzip: Gzip,
  posixPath: string,
  mode: number,
  size: number,
  mtime: number,
  typeflag: string,
  linkname?: string
): Promise<void> => {
  const ustarPath = splitUstarPath(posixPath);
  if (ustarPath === undefined) {
    await writeGnuLongName(gzip, posixPath, mtime);
  }
  await writeTarHeader(gzip, {
    name: ustarPath?.name ?? posixPath.slice(0, 100),
    prefix: ustarPath?.prefix ?? '',
    mode,
    size,
    mtime,
    typeflag,
    ...(linkname === undefined ? {} : { linkname })
  });
};

const writeTarFileBody = async (gzip: Gzip, absolutePath: string, size: number): Promise<void> => {
  const file = createReadStream(absolutePath);
  for await (const chunk of file) {
    await writeToGzip(gzip, chunk);
  }
  await padToTarBlock(gzip, size);
};

const toArchivePath = (absolutePath: string, rootDir: string, pathPrefix: string): string => {
  const relativePath = relative(rootDir, absolutePath).split(sep).join('/');
  if (relativePath === '') {
    return pathPrefix;
  }
  if (pathPrefix === '') {
    return relativePath;
  }
  return `${pathPrefix}/${relativePath}`;
};

const appendTarEntry = async (gzip: Gzip, absolutePath: string, rootDir: string, pathPrefix: string): Promise<void> => {
  const entryStat = await lstat(absolutePath);
  const mtime = Math.floor(entryStat.mtimeMs / 1000);
  const posixPath = toArchivePath(absolutePath, rootDir, pathPrefix);

  if (entryStat.isSymbolicLink()) {
    const linkname = await readlink(absolutePath);
    await writeTarEntryHeader(gzip, posixPath, 0o777, 0, mtime, '2', linkname.slice(0, 100));
    return;
  }
  if (entryStat.isDirectory()) {
    const directoryName = posixPath.endsWith('/') ? posixPath : `${posixPath}/`;
    await writeTarEntryHeader(gzip, directoryName, entryStat.mode, 0, mtime, '5');
    return;
  }
  if (!entryStat.isFile()) {
    return;
  }
  await writeTarEntryHeader(gzip, posixPath, entryStat.mode, entryStat.size, mtime, '0');
  await writeTarFileBody(gzip, absolutePath, entryStat.size);
};

const walkForArchive = async (directory: string, gzip: Gzip, rootDir: string, pathPrefix: string): Promise<void> => {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = join(directory, entry.name);
    await appendTarEntry(gzip, entryPath, rootDir, pathPrefix);
    if (entry.isDirectory()) {
      await walkForArchive(entryPath, gzip, rootDir, pathPrefix);
    }
  }
};

const writeTarGzipFromDirectory = async (rootDir: string, archivePath: string, pathPrefix: string): Promise<void> => {
  const gzip = createGzip();
  const output = createWriteStream(archivePath);
  const done = pipeline(gzip, output);
  await appendTarEntry(gzip, rootDir, rootDir, pathPrefix);
  await walkForArchive(rootDir, gzip, rootDir, pathPrefix);
  await writeToGzip(gzip, Buffer.alloc(tarBlockSize * 2));
  gzip.end();
  await done;
};

const packageDistDirectories = async (usedOutputNames: Set<string>): Promise<void> => {
  for (const rootName of distSearchRoots) {
    await walk(join(workspaceRoot, rootName), async (entryPath, name, isDirectory) => {
      if (!(isDirectory && name === 'dist')) {
        return true;
      }
      const packageDir = relative(workspaceRoot, join(entryPath, '..'));
      const archiveFileName = allocateOutputName(usedOutputNames, `${packageDir.split(sep).join('-')}.tar.gz`);
      await writeTarGzipFromDirectory(entryPath, join(outputDir, archiveFileName), 'dist');
      return false;
    });
  }
};

const packagePluginJars = async (usedOutputNames: Set<string>): Promise<void> => {
  const jarParentMarker = `${sep}build${sep}libs${sep}`;
  await walk(join(workspaceRoot, 'mc-plugins'), async (entryPath, name, isDirectory) => {
    if (!isDirectory && name.endsWith('.jar') && entryPath.includes(jarParentMarker)) {
      const outputName = allocateOutputName(usedOutputNames, name);
      await cp(entryPath, join(outputDir, outputName), { force: true });
    }
    return true;
  });
};

const packageRustReleaseBinaries = async (usedOutputNames: Set<string>): Promise<void> => {
  const releaseDir = join(workspaceRoot, 'target', 'release');
  if (!existsSync(releaseDir)) {
    return;
  }
  const entries = await readdir(releaseDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile()) {
      continue;
    }
    const entryPath = join(releaseDir, entry.name);
    const fileStat = await stat(entryPath);
    if ((fileStat.mode & 0o111) === 0) {
      continue;
    }
    const outputName = allocateOutputName(usedOutputNames, entry.name);
    await cp(entryPath, join(outputDir, outputName), { force: true });
  }
};

const packageReleaseArtifacts = async (): Promise<void> => {
  const usedOutputNames = new Set<string>();
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });
  await packageDistDirectories(usedOutputNames);
  await packagePluginJars(usedOutputNames);
  await packageRustReleaseBinaries(usedOutputNames);
};

if (import.meta.main) {
  await packageReleaseArtifacts();
}
