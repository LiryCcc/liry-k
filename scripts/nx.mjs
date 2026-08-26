import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

for (const envFile of ['nx.env', '.env']) {
  const envPath = resolve(root, envFile);
  if (existsSync(envPath)) {
    loadEnvFile(envPath);
  }
}

const nxBin = resolve(root, 'node_modules/nx/dist/bin/nx.js');
const result = spawnSync(process.execPath, [nxBin, ...process.argv.slice(2)], {
  cwd: root,
  env: process.env,
  stdio: 'inherit'
});

process.exit(result.status ?? 1);
