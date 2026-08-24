import { readFile } from 'node:fs/promises';

import { findInFiles, findInSource, parseSource, resolveKind, resolveLang, rewriteInFiles } from '../js-api.js';
import type { ParsedCli } from './parse-args.js';

const DEFAULT_PATHS = ['.'];

const formatMatchLine = (file: string, line: number, text: string): string => {
  const compact = text.replaceAll(/\s+/g, ' ').trim();
  return `${file}:${line + 1}: ${compact}`;
};

const runFindCommand = async (parsed: Extract<ParsedCli, { command: 'find' }>): Promise<number> => {
  const lang = resolveLang(parsed.lang);
  const paths = parsed.paths.length > 0 ? parsed.paths : DEFAULT_PATHS;

  if (paths.length === 1) {
    const filePath = paths[0];
    if (filePath) {
      try {
        const source = await readFile(filePath, 'utf8');
        const result = findInSource({ lang, source, pattern: parsed.pattern });

        if (parsed.json) {
          console.log(JSON.stringify(result.matches, null, 2));
          return 0;
        }

        for (const match of result.matches) {
          console.log(formatMatchLine(filePath, match.range.start.line, match.text));
        }

        return 0;
      } catch {
        /** 单文件读取失败时回退到目录搜索。 */
      }
    }
  }

  const result = await findInFiles({ lang, paths, pattern: parsed.pattern });

  if (parsed.json) {
    console.log(JSON.stringify({ fileCount: result.fileCount, matches: result.matches }, null, 2));
    return 0;
  }

  for (const match of result.matches) {
    console.log(formatMatchLine(match.file, match.range.start.line, match.text));
  }

  return 0;
};

const runRewriteCommand = async (parsed: Extract<ParsedCli, { command: 'rewrite' }>): Promise<number> => {
  const lang = resolveLang(parsed.lang);
  const paths = parsed.paths.length > 0 ? parsed.paths : DEFAULT_PATHS;

  const result = await rewriteInFiles({
    lang,
    paths,
    pattern: parsed.pattern,
    rewrite: parsed.rewrite,
    updateAll: parsed.updateAll
  });

  if (parsed.json) {
    console.log(JSON.stringify(result, null, 2));
    return 0;
  }

  if (result.matchCount === 0) {
    console.log('no matches');
    return 0;
  }

  for (const item of result.changedFiles) {
    const suffix = parsed.updateAll ? ' (written)' : ' (preview only, pass --update-all to write)';
    console.log(`${item.file}: ${item.matchCount} change(s)${suffix}`);
  }

  return 0;
};

const runParseCommand = async (parsed: Extract<ParsedCli, { command: 'parse' }>): Promise<number> => {
  const lang = resolveLang(parsed.lang);
  const target = parsed.paths[0];

  if (!target) {
    throw new Error('parse requires a file path');
  }

  const source = await readFile(target, 'utf8');
  const result = parseSource(parsed.pattern ? { lang, source, pattern: parsed.pattern } : { lang, source });

  if (parsed.json) {
    console.log(JSON.stringify({ file: target, ...result }, null, 2));
    return 0;
  }

  console.log(`file: ${target}`);
  console.log(`rootKind: ${result.rootKind}`);
  console.log(`matchCount: ${result.matchCount}`);

  for (const match of result.matches) {
    console.log(formatMatchLine(target, match.range.start.line, match.text));
  }

  return 0;
};

const runKindCommand = (parsed: Extract<ParsedCli, { command: 'kind' }>): number => {
  const lang = resolveLang(parsed.lang);
  const result = resolveKind({ lang, kindName: parsed.kindName });

  if (parsed.json) {
    console.log(JSON.stringify(result, null, 2));
    return 0;
  }

  console.log(`${result.kindName}: ${result.kindId}`);
  return 0;
};

export { runFindCommand, runKindCommand, runParseCommand, runRewriteCommand };
