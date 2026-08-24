import { resolve } from 'node:path';

import type { ChecksumAlgorithm, ChecksumSpec } from '../types.js';
import { isChecksumAlgorithm, parseChecksumArg } from '../verify-checksum.js';

export type CliOptions = {
  url: string;
  outputPath: string;
  threads: number;
  retries: number;
  resume: boolean;
  checksums: ChecksumSpec[];
};

const parseChecksumFlag = (algorithm: ChecksumAlgorithm, value: string | undefined): ChecksumSpec | null => {
  if (!value) {
    return null;
  }

  return {
    algorithm,
    expected: value
  };
};

const parseCliArgs = (argv: string[]): CliOptions | null => {
  const positional: string[] = [];
  const checksums: ChecksumSpec[] = [];
  let threads = 4;
  let retries = 3;
  let resume = true;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--threads') {
      const next = argv[index + 1];
      const parsed = next ? Number.parseInt(next, 10) : NaN;

      if (!Number.isFinite(parsed) || parsed <= 0) {
        return null;
      }

      threads = parsed;
      index += 1;
      continue;
    }

    if (arg === '--retries') {
      const next = argv[index + 1];
      const parsed = next ? Number.parseInt(next, 10) : NaN;

      if (!Number.isFinite(parsed) || parsed < 0) {
        return null;
      }

      retries = parsed;
      index += 1;
      continue;
    }

    if (arg === '--checksum') {
      const next = argv[index + 1];
      const parsed = next ? parseChecksumArg(next) : null;

      if (!parsed) {
        return null;
      }

      checksums.push(parsed);
      index += 1;
      continue;
    }

    if (arg === '--md5' || arg === '--sha1' || arg === '--sha256' || arg === '--sha512') {
      const algorithm = arg.slice(2);

      if (!isChecksumAlgorithm(algorithm)) {
        return null;
      }

      const next = argv[index + 1];
      const parsed = parseChecksumFlag(algorithm, next);

      if (!parsed) {
        return null;
      }

      checksums.push(parsed);
      index += 1;
      continue;
    }

    if (arg === '--no-resume') {
      resume = false;
      continue;
    }

    if (!arg) {
      continue;
    }

    positional.push(arg);
  }

  const url = positional[0];
  const output = positional[1];

  if (!url || !output) {
    return null;
  }

  return {
    url,
    outputPath: resolve(output),
    threads,
    retries,
    resume,
    checksums
  };
};

const printCliUsage = (): void => {
  console.log(
    'Usage: multi-download <url> <output-path> [--threads 4] [--retries 3] [--no-resume] [--checksum md5:...] [--md5 ...] [--sha1 ...] [--sha256 ...] [--sha512 ...]'
  );
};

export { parseCliArgs, printCliUsage };
