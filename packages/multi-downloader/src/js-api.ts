import { downloadFile } from './multi-downloader.js';
import type { DownloadOptions, MultiDownloadResult } from './types.js';

/**
 * Download a remote file with multi-threaded fetch, retry, resume, and optional checksum verification.
 */
const multiDownload = async (options: DownloadOptions): Promise<MultiDownloadResult> => {
  const { totalBytes, checksumResults } = await downloadFile(options);

  return {
    outputPath: options.outputPath,
    totalBytes,
    checksumResults
  };
};

export { multiDownload };
