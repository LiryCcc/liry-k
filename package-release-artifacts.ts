#!/usr/bin/env node
import { once } from 'node:events';
import { createReadStream, createWriteStream, existsSync } from 'node:fs';
import { appendFile, cp, lstat, mkdir, readdir, readlink, rm, stat } from 'node:fs/promises';
import { dirname, join, relative, sep } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { createGzip, type Gzip } from 'node:zlib';

const workspaceRoot = import.meta.dirname;
const stagingDir = join(workspaceRoot, 'release-artifacts');
const skipDirectoryNames = new Set(['node_modules', '.git']);
const distSearchRoots = ['apps', 'packages', 'infra', 'demos'] as const;
const tarBlockSize = 512;

const copyPreservingParents = async (absolutePath: string): Promise<void> => {
  const destination = join(stagingDir, relative(workspaceRoot, absolutePath));
  await mkdir(dirname(destination), { recursive: true });
  await cp(absolutePath, destination, { recursive: true, force: true });
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

const collectDistDirectories = async (): Promise<void> => {
  for (const rootName of distSearchRoots) {
    await walk(join(workspaceRoot, rootName), async (entryPath, name, isDirectory) => {
      if (isDirectory && name === 'dist') {
        await copyPreservingParents(entryPath);
        return false;
      }
      return true;
    });
  }
};

const collectPluginJars = async (): Promise<void> => {
  const jarParentMarker = `${sep}build${sep}libs${sep}`;
  await walk(join(workspaceRoot, 'mc-plugins'), async (entryPath, name, isDirectory) => {
    if (!isDirectory && name.endsWith('.jar') && entryPath.includes(jarParentMarker)) {
      await copyPreservingParents(entryPath);
    }
    return true;
  });
};

const collectRustReleaseBinaries = async (): Promise<void> => {
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
    await copyPreservingParents(entryPath);
  }
};

const writeGithubOutput = async (archiveName: string): Promise<void> => {
  const githubOutput = process.env['GITHUB_OUTPUT'];
  if (githubOutput === undefined) {
    return;
  }
  await appendFile(githubOutput, `archive_name=${archiveName}\n`);
};

const toPosixPath = (absolutePath: string): string => relative(stagingDir, absolutePath).split(sep).join('/');

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

const appendTarEntry = async (gzip: Gzip, absolutePath: string): Promise<void> => {
  const entryStat = await lstat(absolutePath);
  const mtime = Math.floor(entryStat.mtimeMs / 1000);
  const posixPath = toPosixPath(absolutePath);

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

const walkStagingForArchive = async (directory: string, gzip: Gzip): Promise<void> => {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = join(directory, entry.name);
    await appendTarEntry(gzip, entryPath);
    if (entry.isDirectory()) {
      await walkStagingForArchive(entryPath, gzip);
    }
  }
};

const writeTarGzipArchive = async (archivePath: string): Promise<void> => {
  const gzip = createGzip();
  const output = createWriteStream(archivePath);
  const done = pipeline(gzip, output);
  await walkStagingForArchive(stagingDir, gzip);
  await writeToGzip(gzip, Buffer.alloc(tarBlockSize * 2));
  gzip.end();
  await done;
};

const packageReleaseArtifacts = async (): Promise<void> => {
  const sha = process.env['GITHUB_SHA'] ?? 'local';
  const archiveName = `liry-k-${sha}.tar.gz`;
  const archivePath = join(workspaceRoot, archiveName);

  await rm(stagingDir, { recursive: true, force: true });
  await mkdir(stagingDir, { recursive: true });
  await collectDistDirectories();
  await collectPluginJars();
  await collectRustReleaseBinaries();
  await writeTarGzipArchive(archivePath);
  await writeGithubOutput(archiveName);
};

if (import.meta.main) {
  await packageReleaseArtifacts();
}
