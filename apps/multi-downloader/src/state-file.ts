import { open, readFile, unlink, writeFile } from 'node:fs/promises';

import {
  createInitialState,
  getStatePath,
  isDownloadComplete,
  isResumableState,
  parseResumeState,
  sumDownloadedBytes,
  type ResumeState
} from './resume-state.js';
import type { ChunkRange } from './types.js';

const loadResumeState = async (outputPath: string, url: string, totalBytes: number): Promise<ResumeState | null> => {
  const statePath = getStatePath(outputPath);

  try {
    const rawText = await readFile(statePath, 'utf8');
    const parsed = parseResumeState(JSON.parse(rawText) as unknown);

    if (!isResumableState(parsed, url, outputPath, totalBytes)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

const saveResumeState = async (state: ResumeState): Promise<void> => {
  const statePath = getStatePath(state.outputPath);
  await writeFile(statePath, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
};

const removeResumeState = async (outputPath: string): Promise<void> => {
  const statePath = getStatePath(outputPath);

  try {
    await unlink(statePath);
  } catch {
    // ignore missing state file
  }
};

const ensureOutputFile = async (outputPath: string, totalBytes: number): Promise<void> => {
  const handle = await open(outputPath, 'a+');
  await handle.truncate(totalBytes);
  await handle.close();
};

const markDownloadFinished = async (state: ResumeState): Promise<void> => {
  if (isDownloadComplete(state)) {
    await removeResumeState(state.outputPath);
  }
};

const getInitialDownloadedBytes = (state: ResumeState | null): number => (state ? sumDownloadedBytes(state) : 0);

const buildFreshState = (
  url: string,
  outputPath: string,
  totalBytes: number,
  etag: string | null,
  chunks: ChunkRange[]
): ResumeState => createInitialState(url, outputPath, totalBytes, etag, chunks);

export {
  buildFreshState,
  ensureOutputFile,
  getInitialDownloadedBytes,
  loadResumeState,
  markDownloadFinished,
  removeResumeState,
  saveResumeState
};
