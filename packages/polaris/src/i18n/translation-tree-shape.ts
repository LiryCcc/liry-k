/**
 * 全站文案结构的单一来源（仅类型）：各语言 resources 用 `satisfies TranslationTree` 对齐，避免与 `en` 字面量推断循环依赖。
 */
export type LocaleCode = 'en' | 'zh';

export type TranslationTree = {
  app: {
    demoInterpolationTitle: string;
    demoNameHint: string;
    greeting: string;
    welcome: string;
  };
  devTools: { label: string; openTitle: string };
  titleBar: { languageSelectLabel: string; switchToEn: string; switchToZh: string };
};
