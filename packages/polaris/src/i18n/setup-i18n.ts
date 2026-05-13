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

/** 并发与重复调用共享同一次初始化，避免重复注册插件与监听器。 */
const setupRef = { promise: null as Promise<void> | null };

const performSetup = async (): Promise<void> => {
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

/** 初始化 i18n（幂等，避免热更新重复注册）。 */
export const setupI18n = (): Promise<void> => {
  if (i18n.isInitialized) {
    syncBridge();
    return Promise.resolve();
  }

  setupRef.promise ??= performSetup();
  return setupRef.promise;
};
