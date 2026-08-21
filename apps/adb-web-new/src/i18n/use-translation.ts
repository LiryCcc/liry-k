import { i18n } from '@/i18n/setup-i18n.js';
import type { TranslationKey } from '@/i18n/translation-tree.js';
import { info } from '@/utils/observability.js';
import { useTranslation as useReactI18NextTranslation } from 'react-i18next';

type TRest = Parameters<typeof i18n.t> extends [unknown, ...infer R] ? R : never;

/** 首参限定为 TranslationKey，其余与 i18next.t 常用重载对齐。 */
export type TypedT = (key: TranslationKey, ...rest: TRest) => ReturnType<typeof i18n.t>;

/**
 * 基于 react-i18next 的 useTranslation 封装，提供类型化的 t 函数。
 */
export const useTranslation = () => {
  const { t, i18n: i18nInstance } = useReactI18NextTranslation();

  const changeLanguage = (nextLanguage: string) => {
    info('i18n.changeLanguage', nextLanguage);
    i18nInstance.changeLanguage(nextLanguage);
  };

  const language = i18nInstance.language;

  return { changeLanguage, language, t: t as TypedT };
};
