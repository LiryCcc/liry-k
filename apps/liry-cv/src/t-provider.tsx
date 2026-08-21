import { useDeferredValue, useState, type ReactNode } from 'react';
import { TContext, tContextDefaultValue } from './context.js';
import { getCurrentLanguage } from './translation/index.js';
import type { Language, TranslationContext } from './translation/type.js';

const TProvider = ({ children }: { children: ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(getCurrentLanguage);
  const setLanguage: TranslationContext['setLanguage'] = (language) => {
    setCurrentLanguage(language);
  };
  const value = useDeferredValue<TranslationContext>({
    ...tContextDefaultValue,
    currentLanguage,
    setLanguage
  });

  return <TContext value={value} children={children} />;
};

export default TProvider;
