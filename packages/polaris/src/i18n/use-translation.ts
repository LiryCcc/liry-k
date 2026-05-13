import { i18nBridgeStore } from '@/i18n/bridge-store.js';
import { i18n } from '@/i18n/setup-i18n.js';
import type { TranslationInterpolationMap, TranslationKey } from '@/i18n/translation-tree.js';
import { useStore } from '@tanstack/solid-store';
import type { TOptions } from 'i18next';

type TRest = Parameters<typeof i18n.t> extends [unknown, ...infer R] ? R : never;

type TArgs<K extends TranslationKey> = K extends keyof TranslationInterpolationMap
  ? [options: TranslationInterpolationMap[K] & TOptions]
  : [options?: TOptions];

/**
 * 首参为 TranslationKey；若 key 在 TranslationInterpolationMap 中，第二参须包含对应插值字段并与 TOptions 相交。
 */
export type TypedT = {
  <K extends TranslationKey>(key: K, ...args: TArgs<K>): ReturnType<typeof i18n.t>;
};

/**
 * 通过桥接 Store 订阅语言变更，在 Solid 中触发重渲染后再调用 i18next.t。
 */
export const useTranslation = () => {
  const bridge = useStore(i18nBridgeStore);

  const t = ((key: TranslationKey, ...rest: TRest) => {
    void bridge();
    return i18n.t(key, ...rest);
  }) as TypedT;

  const changeLanguage = (nextLanguage: string) => {
    void i18n.changeLanguage(nextLanguage);
  };

  /** 当前解析后的语言码，随桥接 Store 更新。 */
  const language = useStore(i18nBridgeStore, (s) => s.language);

  return { changeLanguage, language, t };
};
