import { createContext } from 'react';
import { getCurrentLanguage, translations } from './translation/index.js';
import type { TranslationContext } from './translation/type.js';

export const tContextDefaultValue: TranslationContext = {
  ...translations,
  currentLanguage: getCurrentLanguage(),
  setLanguage: () => {}
};

export const TContext = createContext<TranslationContext>(tContextDefaultValue);
