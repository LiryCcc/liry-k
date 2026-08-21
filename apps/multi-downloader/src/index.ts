export { multiDownload } from './js-api.js';
export { planChunks } from './plan-chunks.js';
export { probeResource } from './probe-resource.js';
export type {
  ChecksumAlgorithm,
  ChecksumSpec,
  ChecksumVerificationResult,
  ChunkRange,
  DownloadOptions,
  DownloadProgress,
  MultiDownloadResult,
  ResourceInfo
} from './types.js';
export {
  computeFileChecksum,
  isChecksumAlgorithm,
  normalizeChecksumDigest,
  parseChecksumArg,
  verifyChecksums
} from './verify-checksum.js';
