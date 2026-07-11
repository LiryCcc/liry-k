import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

import type { ChecksumAlgorithm, ChecksumSpec, ChecksumVerificationResult } from './types.js';

const CHECKSUM_ALGORITHMS = new Set<ChecksumAlgorithm>(['md5', 'sha1', 'sha256', 'sha512']);

const isChecksumAlgorithm = (value: string): value is ChecksumAlgorithm =>
  CHECKSUM_ALGORITHMS.has(value as ChecksumAlgorithm);

const normalizeChecksumDigest = (digest: string): string => digest.trim().toLowerCase();

const parseChecksumArg = (value: string): ChecksumSpec | null => {
  const separatorIndex = value.indexOf(':');

  if (separatorIndex <= 0) {
    return null;
  }

  const algorithm = value.slice(0, separatorIndex);
  const expected = value.slice(separatorIndex + 1);

  if (!isChecksumAlgorithm(algorithm) || expected.length === 0) {
    return null;
  }

  return {
    algorithm,
    expected
  };
};

const computeFileChecksum = async (filePath: string, algorithm: ChecksumAlgorithm): Promise<string> => {
  const hash = createHash(algorithm);
  await pipeline(createReadStream(filePath), hash);
  return hash.digest('hex');
};

const verifyChecksums = async (filePath: string, checksums: ChecksumSpec[]): Promise<ChecksumVerificationResult[]> => {
  const results: ChecksumVerificationResult[] = [];

  for (const checksum of checksums) {
    const actual = await computeFileChecksum(filePath, checksum.algorithm);
    const expected = normalizeChecksumDigest(checksum.expected);
    const normalizedActual = normalizeChecksumDigest(actual);
    const matched = normalizedActual === expected;

    if (!matched) {
      throw new Error(`Checksum mismatch (${checksum.algorithm}): expected ${expected}, got ${normalizedActual}`);
    }

    results.push({
      algorithm: checksum.algorithm,
      expected,
      actual: normalizedActual,
      matched
    });
  }

  return results;
};

export { computeFileChecksum, isChecksumAlgorithm, normalizeChecksumDigest, parseChecksumArg, verifyChecksums };
