import { inferLangFromPath, resolveLang, SUPPORTED_LANG_LABELS } from './lang/resolve-lang.js';
import { findInFiles } from './tools/find-in-files.js';
import { findInSource } from './tools/find-in-source.js';
import { parseSource, resolveKind } from './tools/parse-source.js';
import { rewriteInFiles } from './tools/rewrite-in-files.js';
import { rewriteInSource } from './tools/rewrite-in-source.js';

export {
  findInFiles,
  findInSource,
  inferLangFromPath,
  parseSource,
  resolveKind,
  resolveLang,
  rewriteInFiles,
  rewriteInSource,
  SUPPORTED_LANG_LABELS
};

export type {
  AstGrepLang,
  FindInFilesOptions,
  FindInFilesResult,
  FindInSourceOptions,
  FindInSourceResult,
  ParseSourceOptions,
  ParseSourceResult,
  ResolveKindOptions,
  ResolveKindResult,
  RewriteFileChange,
  RewriteInFilesOptions,
  RewriteInFilesResult,
  RewriteInSourceOptions,
  RewriteInSourceResult
} from './types.js';

export type { SerializedMatch, SerializedRange } from './match/serialize-node.js';
