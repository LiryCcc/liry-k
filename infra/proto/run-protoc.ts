import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = import.meta.dirname;
const generatedDir = resolve(root, 'src/generated');

if (!existsSync(generatedDir)) {
  await mkdir(generatedDir, { recursive: true });
}

/**
 * Windows 的 node_modules/.bin/ 下只有 .cmd 包装脚本，
 * Unix 下没有扩展名；动态选择正确路径以避免 "not a valid Win32 application" 错误。
 */
const pluginExt = process.platform === 'win32' ? '.cmd' : '';
const pluginBin = resolve(root, `node_modules/.bin/protoc-gen-ts_proto${pluginExt}`);

const result = spawnSync(
  'protoc',
  [
    `--proto_path=./protos`,
    `--plugin=protoc-gen-ts_proto=${pluginBin}`,
    `--ts_proto_out=./src/generated`,
    `--ts_proto_opt=esModuleInterop=true,outputClientImpl=false,outputServices=none,useExactTypes=false,nestJs=false,importSuffix=.js,useExplicitNext=true`,
    `./protos/*.proto`
  ],
  { stdio: 'inherit', shell: true, cwd: root }
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
