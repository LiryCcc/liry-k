import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { exit } from 'node:process';

const d = resolve(import.meta.dirname, 'src/generated');

if (existsSync(d)) {
  exit(0);
} else {
  await mkdir(d);
}
