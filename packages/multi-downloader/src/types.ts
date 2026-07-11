export type ChecksumAlgorithm = 'md5' | 'sha1' | 'sha256' | 'sha512';

export type ChecksumSpec = {
  algorithm: ChecksumAlgorithm;
  /** Hex digest, case-insensitive. */
  expected: string;
};

export type ChecksumVerificationResult = {
  algorithm: ChecksumAlgorithm;
  expected: string;
  actual: string;
  matched: boolean;
};

export type MultiDownloadResult = {
  outputPath: string;
  totalBytes: number;
  checksumResults: ChecksumVerificationResult[];
};

export type ChunkRange = {
  index: number;
  start: number;
  end: number;
};

export type DownloadProgress = {
  totalBytes: number;
  downloadedBytes: number;
  percent: number;
  activeChunks: number;
};

export type DownloadOptions = {
  url: string;
  outputPath: string;
  threads?: number;
  retries?: number;
  retryDelayMs?: number;
  resume?: boolean;
  headers?: Record<string, string>;
  /** Optional post-download checksum verification. */
  checksums?: ChecksumSpec[];
  onProgress?: (progress: DownloadProgress) => void;
};

export type ResourceInfo = {
  totalBytes: number;
  supportsRanges: boolean;
  etag: string | null;
};

export type ChunkProgressUpdate = {
  index: number;
  downloaded: number;
};
