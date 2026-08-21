import { i18nBridgeStore } from '@/i18n/bridge-store.js';
import { i18n } from '@/i18n/setup-i18n.js';
import type { TranslationKey, TranslationTArgs } from '@/i18n/translation-tree.js';
import { useStore } from '@tanstack/solid-store';

type TRest = Parameters<typeof i18n.t> extends [unknown, ...infer R] ? R : never;

/**
 * 首参为 TranslationKey；第二参由同一 key 在**中英文**文案中的 `{{…}}` 并集推导（见 `translation-tree.ts`）。
 */
export type TypedT = {
  <K extends TranslationKey>(key: K, ...args: TranslationTArgs<K>): ReturnType<typeof i18n.t>;
};

/**
 * 通过桥接 Store 订阅语言变更，在 Solid 中触发重渲染后再调用 i18next.t。
 */
export const useTranslation = () => {
  const bridge = useStore(i18nBridgeStore);

  const t = ((key: TranslationKey, ...rest: TRest) => {
    bridge();
    return i18n.t(key, ...rest);
  }) as TypedT;

  const changeLanguage = (nextLanguage: string) => {
    i18n.changeLanguage(nextLanguage);
  };

  /** 当前解析后的语言码，随桥接 Store 更新。 */
  const language = useStore(i18nBridgeStore, (s) => s.language);

  return { changeLanguage, language, t };
};
