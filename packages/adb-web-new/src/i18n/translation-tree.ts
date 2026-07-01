/**
 * 全站文案结构的单一来源：各语言 resources 对象用该类型约束，不通过 .d.ts 改写 i18next 全局类型。
 */
export type LocaleCode = 'en' | 'zh';

export type TranslationTree = {
  app: { title: string };
  home: { desc: string; title: string };
  nav: { collapse: string; expand: string; home: string };
  notFound: { backHome: string; desc: string; title: string };
  ui: {
    adbDocLabel: string;
    switchToEn: string;
    switchToZh: string;
    themeDark: string;
    themeLabel: string;
    themeLight: string;
    themeTeamsDark: string;
    themeTeamsLight: string;
  };
};

/**
 * 从文案树推导所有合法点号路径（如 app.title、nav.home），供 t() 首参强类型使用。
 */
export type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends string ? `${K}` : T[K] extends object ? `${K}.${NestedKeyOf<T[K]>}` : never;
    }[keyof T & string]
  : never;

export type TranslationKey = NestedKeyOf<TranslationTree>;
