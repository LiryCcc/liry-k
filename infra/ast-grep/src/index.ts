export {
  SUPPORTED_LANG_LABELS,
  findInFiles,
  findInSource,
  inferLangFromPath,
  parseSource,
  resolveKind,
  resolveLang,
  rewriteInFiles,
  rewriteInSource
} from './js-api.js';

export type {
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
  RewriteInSourceResult,
  SerializedMatch,
  SerializedRange
} from './js-api.js';
export type { AstGrepLang } from './lang/resolve-lang.js';
