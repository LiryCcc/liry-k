import type { MayBePromise } from '@liry-k/stellar';

export type TranslationTree = {
  basic: {
    name: string;
    sex: string;
    age: string;
  };
};
export type Language = 'zh' | 'en';
export type TranslationContext = Record<Language, TranslationTree> & {
  currentLanguage: Language;
} & {
  setLanguage: (lang: Language) => MayBePromise<void>;
};
