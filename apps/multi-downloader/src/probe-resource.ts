import { fetchWithRetry } from './fetch-with-retry.js';
import type { ResourceInfo } from './types.js';

const DEFAULT_HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

const parseContentLength = (response: Response): number => {
  const raw = response.headers.get('content-length');
  const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN;
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
};

const parseTotalFromContentRange = (response: Response): number => {
  const contentRange = response.headers.get('content-range');
  const match = contentRange?.match(/\/(\d+)\s*$/);
  return match?.[1] ? Number.parseInt(match[1], 10) : 0;
};

const readResourceInfo = (response: Response, contentLength: number): ResourceInfo => {
  const acceptRanges = response.headers.get('accept-ranges');
  const contentRange = response.headers.get('content-range');
  const supportsRanges = acceptRanges === 'bytes' || contentRange !== null;

  return {
    totalBytes: contentLength,
    supportsRanges,
    etag: response.headers.get('etag')
  };
};

const probeWithRange = async (
  url: string,
  headers: Record<string, string>,
  retries: number,
  retryDelayMs: number
): Promise<ResourceInfo> => {
  const rangeResponse = await fetchWithRetry(url, {
    retries,
    retryDelayMs,
    init: {
      method: 'GET',
      headers: {
        ...headers,
        Range: 'bytes=0-0'
      }
    }
  });

  let totalBytes = parseContentLength(rangeResponse);

  if (totalBytes === 0) {
    totalBytes = parseTotalFromContentRange(rangeResponse);
  }

  if (totalBytes <= 0) {
    throw new Error('Unable to determine file size from server response');
  }

  return readResourceInfo(rangeResponse, totalBytes);
};

const probeResource = async (
  url: string,
  headers: Record<string, string>,
  retries: number,
  retryDelayMs: number
): Promise<ResourceInfo> => {
  const mergedHeaders = { ...DEFAULT_HEADERS, ...headers };

  try {
    const headResponse = await fetchWithRetry(url, {
      retries,
      retryDelayMs,
      init: {
        method: 'HEAD',
        headers: mergedHeaders
      }
    });

    const totalBytes = parseContentLength(headResponse);

    if (totalBytes > 0) {
      return readResourceInfo(headResponse, totalBytes);
    }
  } catch {
    // Some CDNs reject HEAD; fall back to a ranged GET probe.
  }

  return probeWithRange(url, mergedHeaders, retries, retryDelayMs);
};

export { probeResource };
