import type { ChunkRange } from './types.js';

const planChunks = (totalBytes: number, threads: number): ChunkRange[] => {
  const normalizedThreads = Math.max(1, Math.min(threads, totalBytes));
  const chunkSize = Math.ceil(totalBytes / normalizedThreads);
  const chunks: ChunkRange[] = [];

  for (let index = 0; index < normalizedThreads; index += 1) {
    const start = index * chunkSize;

    if (start >= totalBytes) {
      break;
    }

    const end = Math.min(start + chunkSize - 1, totalBytes - 1);
    chunks.push({ index, start, end });
  }

  return chunks;
};

export { planChunks };
