import { readFile, writeFile } from 'node:fs/promises';

import type { RewriteInFilesOptions, RewriteInFilesResult } from '../types.js';
import { findInFiles } from './find-in-files.js';
import { rewriteInSource } from './rewrite-in-source.js';

/** 在多个文件或目录中按 AST 模式改写；可选写回磁盘。 */
const rewriteInFiles = async (options: RewriteInFilesOptions): Promise<RewriteInFilesResult> => {
  const found = await findInFiles({
    lang: options.lang,
    paths: options.paths,
    pattern: options.pattern,
    ...(options.languageGlobs ? { languageGlobs: options.languageGlobs } : {})
  });

  const files = [...new Set(found.matches.map((item) => item.file))];
  const changedFiles = [] as RewriteInFilesResult['changedFiles'];
  let matchCount = 0;

  for (const file of files) {
    const original = await readFile(file, 'utf8');
    const rewritten = rewriteInSource({
      lang: options.lang,
      source: original,
      pattern: options.pattern,
      rewrite: options.rewrite
    });

    matchCount += rewritten.matchCount;

    if (!rewritten.changed) {
      continue;
    }

    changedFiles.push({
      file,
      matchCount: rewritten.matchCount
    });

    if (options.updateAll) {
      await writeFile(file, rewritten.source, 'utf8');
    }
  }

  return {
    changedFiles,
    matchCount
  };
};

export { rewriteInFiles };
