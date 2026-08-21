import { open } from 'node:fs/promises';

import { fetchWithRetry } from './fetch-with-retry.js';
import type { ChunkState, ResumeState } from './resume-state.js';
import { saveResumeState } from './state-file.js';

const DEFAULT_HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

export type DownloadChunkOptions = {
  url: string;
  outputPath: string;
  headers: Record<string, string>;
  retries: number;
  retryDelayMs: number;
  resumeEnabled: boolean;
  state: ResumeState;
  chunk: ChunkState;
  onChunkProgress: (index: number, downloaded: number) => void;
};

const getChunkByteLength = (chunk: ChunkState): number => chunk.end - chunk.start + 1;

const downloadChunk = async (options: DownloadChunkOptions): Promise<void> => {
  const { url, outputPath, headers, retries, retryDelayMs, resumeEnabled, state, chunk, onChunkProgress } = options;
  const chunkLength = getChunkByteLength(chunk);

  if (chunk.downloaded >= chunkLength) {
    return;
  }

  const rangeStart = chunk.start + chunk.downloaded;
  const rangeEnd = chunk.end;
  const mergedHeaders = {
    ...DEFAULT_HEADERS,
    ...headers,
    Range: `bytes=${rangeStart}-${rangeEnd}`
  };

  const response = await fetchWithRetry(url, {
    retries,
    retryDelayMs,
    init: {
      method: 'GET',
      headers: mergedHeaders
    }
  });

  if (!response.body) {
    throw new Error(`Chunk ${chunk.index}: response body is empty`);
  }

  const handle = await open(outputPath, 'r+');
  const reader = response.body.getReader();
  let writeOffset = rangeStart;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      if (!value) {
        continue;
      }

      await handle.write(value, 0, value.byteLength, writeOffset);
      writeOffset += value.byteLength;
      chunk.downloaded += value.byteLength;
      onChunkProgress(chunk.index, chunk.downloaded);

      if (resumeEnabled) {
        await saveResumeState(state);
      }
    }
  } finally {
    await handle.close();
  }

  if (chunk.downloaded < chunkLength) {
    throw new Error(`Chunk ${chunk.index}: incomplete download (${chunk.downloaded}/${chunkLength} bytes)`);
  }
};

export { downloadChunk };
