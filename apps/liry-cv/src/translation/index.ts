import { EN_TRANSLATIONS } from './en.js';
import type { Language, TranslationTree } from './type.js';
import { ZH_TRANSLATIONS } from './zh.js';

export const translations: Record<Language, TranslationTree> = {
  zh: ZH_TRANSLATIONS,
  en: EN_TRANSLATIONS
};

export const getCurrentLanguage = (): Language => {
  const htmlElement = document.getElementsByTagName('html');
  const language = htmlElement?.[0]?.lang ?? navigator.language ?? 'zh';
  if (language.toLowerCase().includes('zh')) {
    return 'zh';
  } else {
    return 'en';
  }
};
