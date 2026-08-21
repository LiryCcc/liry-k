import { isLocale, LOCALE_STORAGE_KEY, type Locale } from './locale.js';

const normalizeTag = (tag: string): Locale | undefined => {
  const base = tag.trim().toLowerCase().split('-')[0];
  if (base === 'zh') {
    return 'zh';
  }
  if (base === 'en') {
    return 'en';
  }
  return undefined;
};

const readStoredLocale = (): Locale | undefined => {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    return isLocale(stored) ? stored : undefined;
  } catch {
    return undefined;
  }
};

const readNavigatorLocale = (): Locale | undefined => {
  const candidates = [...(navigator.languages ?? []), navigator.language];
  for (const tag of candidates) {
    if (typeof tag !== 'string') {
      continue;
    }
    const locale = normalizeTag(tag);
    if (locale !== undefined) {
      return locale;
    }
  }
  return undefined;
};

const readBrowserUiLocale = (): Locale | undefined => {
  try {
    return normalizeTag(browser['i18n']['getUILanguage']());
  } catch {
    return undefined;
  }
};

/**
 * Resolve initial UI locale: stored preference, then navigator, then browser UI, else en.
 */
export const detectLocale = (): Locale => readStoredLocale() ?? readNavigatorLocale() ?? readBrowserUiLocale() ?? 'en';
