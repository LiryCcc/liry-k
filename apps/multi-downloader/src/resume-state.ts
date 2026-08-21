import { z } from 'zod/v4';

import type { ChunkRange } from './types.js';

const chunkStateSchema = z.object({
  index: z.number().int().nonnegative(),
  start: z.number().int().nonnegative(),
  end: z.number().int().nonnegative(),
  downloaded: z.number().int().nonnegative()
});

const resumeStateSchema = z.object({
  url: z.string(),
  outputPath: z.string(),
  totalBytes: z.number().int().positive(),
  etag: z.string().nullable(),
  chunks: z.array(chunkStateSchema)
});

export type ResumeState = z.infer<typeof resumeStateSchema>;
export type ChunkState = z.infer<typeof chunkStateSchema>;

const getStatePath = (outputPath: string): string => `${outputPath}.download-state.json`;

const parseResumeState = (raw: unknown): ResumeState => resumeStateSchema.parse(raw);

const createInitialState = (
  url: string,
  outputPath: string,
  totalBytes: number,
  etag: string | null,
  chunks: ChunkRange[]
): ResumeState => ({
  url,
  outputPath,
  totalBytes,
  etag,
  chunks: chunks.map((chunk) => ({
    index: chunk.index,
    start: chunk.start,
    end: chunk.end,
    downloaded: 0
  }))
});

const isResumableState = (state: ResumeState, url: string, outputPath: string, totalBytes: number): boolean =>
  state.url === url && state.outputPath === outputPath && state.totalBytes === totalBytes;

const sumDownloadedBytes = (state: ResumeState): number =>
  state.chunks.reduce((sum, chunk) => sum + chunk.downloaded, 0);

const isDownloadComplete = (state: ResumeState): boolean =>
  state.chunks.every((chunk) => chunk.downloaded >= chunk.end - chunk.start + 1);

export { createInitialState, getStatePath, isDownloadComplete, isResumableState, parseResumeState, sumDownloadedBytes };
