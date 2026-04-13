import { i18nBridgeStore } from '@/i18n/bridge-store.js';
import { enResources } from '@/i18n/resources/en.js';
import { zhResources } from '@/i18n/resources/zh.js';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export const i18n = i18next.createInstance();

const syncBridge = () => {
  const language = i18n.resolvedLanguage ?? i18n.language ?? '';
  i18nBridgeStore.setState((prev) => ({
    language,
    revision: prev.revision + 1
  }));
};

let setupDone = false;

/** 初始化 i18n（幂等，避免热更新重复注册）。 */
export const setupI18n = async (): Promise<void> => {
  if (setupDone) {
    return;
  }

  setupDone = true;
  i18n.use(LanguageDetector);
  i18n.on('languageChanged', syncBridge);

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

  syncBridge();
};
