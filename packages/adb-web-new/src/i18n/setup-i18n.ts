import { enResources } from '@/i18n/resources/en.js';
import { zhResources } from '@/i18n/resources/zh.js';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export const i18n = i18next.createInstance();

/** 初始化 i18n（幂等：以实例自身 `isInitialized` 为 gate）。 */
export const setupI18n = async (): Promise<void> => {
  if (i18n.isInitialized) {
    return;
  }

  i18n.use(LanguageDetector);

  await i18n.init({
    detection: {
      caches: ['localStorage'],
      order: ['localStorage', 'navigator', 'htmlTag']
    },
    fallbackLng: 'en',
    interpolation: { escapeValue: true },
    resources: {
      en: { translation: enResources },
      zh: { translation: zhResources }
    },
    supportedLngs: ['en', 'zh']
  });
};
