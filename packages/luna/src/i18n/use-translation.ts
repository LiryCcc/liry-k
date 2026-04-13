import { i18nBridgeStore } from '@/i18n/bridge-store.js';
import { i18n } from '@/i18n/setup-i18n.js';
import type { TranslationKey } from '@/i18n/translation-tree.js';
import { useStore } from '@tanstack/solid-store';

type TRest = Parameters<typeof i18n.t> extends [unknown, ...infer R] ? R : never;

/** 首参限定为 TranslationKey，其余与 i18next.t 常用重载对齐。 */
export type TypedT = (key: TranslationKey, ...rest: TRest) => ReturnType<typeof i18n.t>;

/**
 * 通过桥接 Store 订阅语言变更，在 Solid 中触发重渲染后再调用 i18next.t。
 */
export const useTranslation = () => {
  const bridge = useStore(i18nBridgeStore);

  const t = ((key: TranslationKey, ...rest: TRest) => {
    void bridge();
    return (i18n.t as (k: TranslationKey, ...r: TRest) => ReturnType<typeof i18n.t>)(key, ...rest);
  }) as TypedT;

  const changeLanguage = (nextLanguage: string) => {
    void i18n.changeLanguage(nextLanguage);
  };

  /** 当前解析后的语言码，随桥接 Store 更新。 */
  const language = useStore(i18nBridgeStore, (s) => s.language);

  return { changeLanguage, language, t };
};
