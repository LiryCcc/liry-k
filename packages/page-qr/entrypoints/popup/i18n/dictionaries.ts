import { en } from './dictionaries/en.js';
import { zh } from './dictionaries/zh.js';
import type { Dictionary } from './dictionary.js';
import type { Locale } from './locale.js';

export const dictionaries: Record<Locale, Dictionary> = {
  en,
  zh
};
