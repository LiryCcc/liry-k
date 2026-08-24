import { open } from 'node:fs/promises';

import { downloadChunk } from './download-chunk.js';
import { fetchWithRetry } from './fetch-with-retry.js';
import { planChunks } from './plan-chunks.js';
import { probeResource } from './probe-resource.js';
import {
  buildFreshState,
  ensureOutputFile,
  getInitialDownloadedBytes,
  loadResumeState,
  markDownloadFinished,
  removeResumeState
} from './state-file.js';
import type { ChecksumSpec, ChecksumVerificationResult, DownloadOptions, DownloadProgress } from './types.js';
import { verifyChecksums } from './verify-checksum.js';

const DEFAULT_THREADS = 4;
const DEFAULT_RETRIES = 3;
const DEFAULT_RETRY_DELAY_MS = 1000;

const DEFAULT_HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

const emitProgress = (
  onProgress: DownloadOptions['onProgress'],
  totalBytes: number,
  downloadedBytes: number,
  activeChunks: number
): void => {
  if (!onProgress) {
    return;
  }

  const progress: DownloadProgress = {
    totalBytes,
    downloadedBytes,
    percent: totalBytes > 0 ? (downloadedBytes / totalBytes) * 100 : 0,
    activeChunks
  };

  onProgress(progress);
};

const downloadSingleThread = async (
  options: Required<Pick<DownloadOptions, 'url' | 'outputPath'>> & DownloadOptions
): Promise<number> => {
  const retries = options.retries ?? DEFAULT_RETRIES;
  const retryDelayMs = options.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS;
  const headers = { ...DEFAULT_HEADERS, ...options.headers };
  const resumeEnabled = options.resume ?? true;

  const response = await fetchWithRetry(options.url, {
    retries,
    retryDelayMs,
    init: {
      method: 'GET',
      headers
    }
  });

  if (!response.body) {
    throw new Error('Response body is empty');
  }

  const contentLengthHeader = response.headers.get('content-length');
  const totalBytes = contentLengthHeader ? Number.parseInt(contentLengthHeader, 10) : 0;
  const handle = await open(options.outputPath, 'w');
  const reader = response.body.getReader();
  let downloadedBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      if (!value) {
        continue;
      }

      await handle.write(value, 0, value.byteLength, downloadedBytes);
      downloadedBytes += value.byteLength;
      emitProgress(options.onProgress, totalBytes > 0 ? totalBytes : downloadedBytes, downloadedBytes, 1);
    }
  } finally {
    await handle.close();
  }

  if (resumeEnabled) {
    await removeResumeState(options.outputPath);
  }

  return totalBytes > 0 ? totalBytes : downloadedBytes;
};

const verifyDownloadChecksums = async (
  outputPath: string,
  checksums: ChecksumSpec[] | undefined
): Promise<ChecksumVerificationResult[]> => {
  if (!checksums || checksums.length === 0) {
    return [];
  }

  return verifyChecksums(outputPath, checksums);
};

const downloadFile = async (
  options: DownloadOptions
): Promise<{
  totalBytes: number;
  checksumResults: ChecksumVerificationResult[];
}> => {
  const threads = options.threads ?? DEFAULT_THREADS;
  const retries = options.retries ?? DEFAULT_RETRIES;
  const retryDelayMs = options.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS;
  const resumeEnabled = options.resume ?? true;
  const headers = options.headers ?? {};

  const resource = await probeResource(options.url, headers, retries, retryDelayMs);

  if (!resource.supportsRanges || resource.totalBytes <= 0) {
    const totalBytes = await downloadSingleThread(options);
    const checksumResults = await verifyDownloadChecksums(options.outputPath, options.checksums);
    return { totalBytes, checksumResults };
  }

  const plannedChunks = planChunks(resource.totalBytes, threads);
  let state =
    resumeEnabled === true ? await loadResumeState(options.outputPath, options.url, resource.totalBytes) : null;

  if (!state) {
    state = buildFreshState(options.url, options.outputPath, resource.totalBytes, resource.etag, plannedChunks);
  }

  await ensureOutputFile(options.outputPath, resource.totalBytes);

  let downloadedBytes = getInitialDownloadedBytes(state);
  emitProgress(options.onProgress, resource.totalBytes, downloadedBytes, 0);

  const pendingChunks = state.chunks.filter((chunk) => chunk.downloaded < chunk.end - chunk.start + 1);

  await Promise.all(
    pendingChunks.map(async (chunk) => {
      emitProgress(options.onProgress, resource.totalBytes, downloadedBytes, pendingChunks.length);

      await downloadChunk({
        url: options.url,
        outputPath: options.outputPath,
        headers,
        retries,
        retryDelayMs,
        resumeEnabled,
        state,
        chunk,
        onChunkProgress: () => {
          downloadedBytes = state.chunks.reduce((sum, item) => sum + item.downloaded, 0);
          emitProgress(options.onProgress, resource.totalBytes, downloadedBytes, pendingChunks.length);
        }
      });
    })
  );

  emitProgress(options.onProgress, resource.totalBytes, resource.totalBytes, 0);

  if (resumeEnabled) {
    await markDownloadFinished(state);
  }

  const checksumResults = await verifyDownloadChecksums(options.outputPath, options.checksums);
  return { totalBytes: resource.totalBytes, checksumResults };
};

export { downloadFile };
