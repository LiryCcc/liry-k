import { Lang } from '@ast-grep/napi';

type AstGrepLang = Lang | (string & {});

const LANG_ALIASES: Record<string, AstGrepLang> = {
  css: Lang.Css,
  html: Lang.Html,
  js: Lang.JavaScript,
  javascript: Lang.JavaScript,
  jsx: Lang.JavaScript,
  ts: Lang.TypeScript,
  tsx: Lang.Tsx,
  typescript: Lang.TypeScript
};

const EXTENSION_LANG: Record<string, AstGrepLang> = {
  '.css': Lang.Css,
  '.html': Lang.Html,
  '.htm': Lang.Html,
  '.js': Lang.JavaScript,
  '.jsx': Lang.JavaScript,
  '.mjs': Lang.JavaScript,
  '.cjs': Lang.JavaScript,
  '.ts': Lang.TypeScript,
  '.mts': Lang.TypeScript,
  '.cts': Lang.TypeScript,
  '.tsx': Lang.Tsx
};

/** 将用户输入的语言名规范为 ast-grep 的 NapiLang。 */
const resolveLang = (input: string): AstGrepLang => {
  const trimmed = input.trim();
  const normalized = trimmed.toLowerCase();
  const alias = LANG_ALIASES[normalized];
  if (alias) {
    return alias;
  }

  const enumValues = Object.values(Lang) as string[];
  if (enumValues.includes(trimmed)) {
    return trimmed as AstGrepLang;
  }

  throw new Error(`unsupported language: ${input}`);
};

/** 根据文件扩展名推断语言；无法推断时返回 null。 */
const inferLangFromPath = (filePath: string): AstGrepLang | null => {
  const dot = filePath.lastIndexOf('.');
  if (dot < 0) {
    return null;
  }

  const ext = filePath.slice(dot).toLowerCase();
  return EXTENSION_LANG[ext] ?? null;
};

const SUPPORTED_LANG_LABELS = ['typescript (ts)', 'tsx', 'javascript (js)', 'html', 'css'] as const;

export { EXTENSION_LANG, inferLangFromPath, LANG_ALIASES, resolveLang, SUPPORTED_LANG_LABELS };
export type { AstGrepLang };
