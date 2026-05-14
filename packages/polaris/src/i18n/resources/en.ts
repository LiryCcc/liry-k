import type { TranslationTree } from '@/i18n/translation-tree-shape.js';

/** 英文文案表：`as const` 保留字面量供插值类型推断，`satisfies` 与 TranslationTree 对齐。 */
export const enResources = {
  app: {
    demoInterpolationTitle: 'Interpolation demo',
    demoNameHint: 'Adjust the name (the greeting below updates):',
    greeting: 'Hello World',
    welcome: 'Hello, {{userName}}!'
  },
  devTools: {
    label: 'DevTools',
    openTitle: 'Open developer tools'
  },
  titleBar: {
    languageSelectLabel: 'Language',
    switchToEn: 'English',
    switchToZh: '中文'
  }
} as const satisfies TranslationTree;
