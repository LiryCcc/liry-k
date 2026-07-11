import type { AstGrepLang } from './lang/resolve-lang.js';
import type { SerializedMatch } from './match/serialize-node.js';

type FindInSourceOptions = {
  lang: AstGrepLang;
  source: string;
  pattern: string;
};

type FindInSourceResult = {
  matches: SerializedMatch[];
};

type FindInFilesOptions = {
  lang: AstGrepLang;
  paths: string[];
  pattern: string;
  languageGlobs?: string[];
};

type FindInFilesResult = {
  fileCount: number;
  matches: SerializedMatch[];
};

type RewriteInSourceOptions = {
  lang: AstGrepLang;
  source: string;
  pattern: string;
  rewrite: string;
};

type RewriteInSourceResult = {
  source: string;
  changed: boolean;
  matchCount: number;
};

type RewriteInFilesOptions = {
  lang: AstGrepLang;
  paths: string[];
  pattern: string;
  rewrite: string;
  updateAll?: boolean;
  languageGlobs?: string[];
};

type RewriteFileChange = {
  file: string;
  matchCount: number;
};

type RewriteInFilesResult = {
  changedFiles: RewriteFileChange[];
  matchCount: number;
};

type ParseSourceOptions = {
  lang: AstGrepLang;
  source: string;
  pattern?: string;
};

type ParseSourceResult = {
  rootKind: string;
  matchCount: number;
  matches: SerializedMatch[];
};

type ResolveKindOptions = {
  lang: AstGrepLang;
  kindName: string;
};

type ResolveKindResult = {
  kindName: string;
  kindId: number;
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
};
