import * as i18n from '@solid-primitives/i18n';
import { createMemo, createSignal } from 'solid-js';

import { detectLocale } from './detect-locale.js';
import { dictionaries } from './dictionaries.js';
import { en } from './dictionaries/en.js';
import { LOCALE_STORAGE_KEY, type Locale } from './locale.js';

const [locale, setLocaleSignal] = createSignal<Locale>('en');

const flatDictionary = createMemo(() => i18n.flatten(dictionaries[locale()]));

const translate = i18n.translator(flatDictionary);

export const t = i18n.chainedTranslator(en, translate);

export const getLocale = (): Locale => locale();

const applyDocumentLang = (next: Locale): void => {
  document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en';
};

export const setLocale = (next: Locale): void => {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, next);
  } catch {
    // Ignore quota / private-mode failures; in-memory locale still updates.
  }
  setLocaleSignal(next);
  applyDocumentLang(next);
};

export const toggleLocale = (): void => {
  setLocale(locale() === 'zh' ? 'en' : 'zh');
};

/**
 * Initialize locale from storage / environment. Safe to call once before render.
 */
export const initI18n = (): void => {
  const initial = detectLocale();
  setLocaleSignal(initial);
  applyDocumentLang(initial);
};
