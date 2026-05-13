/**
 * 全站文案结构的单一来源：各语言 resources 对象用该类型约束，不通过 .d.ts 改写 i18next 全局类型。
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
};

/**
 * 含 `{{…}}` 的文案键及其运行时插值字段（未列出的 key 无强类型插值表，第二参沿用 i18next TOptions）。
 */
export type TranslationInterpolationMap = {
  'app.welcome': { userName: string };
};

/**
 * 从文案树推导所有合法点号路径（如 app.greeting），供 t() 首参强类型使用。
 */
export type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends string ? `${K}` : T[K] extends object ? `${K}.${NestedKeyOf<T[K]>}` : never;
    }[keyof T & string]
  : never;

export type TranslationKey = NestedKeyOf<TranslationTree>;
