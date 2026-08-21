import type { TranslationTree } from '@/i18n/translation-tree-shape.js';

/** 中文文案表：`as const` 保留字面量供与英文并集推断插值，`satisfies` 与 TranslationTree 对齐。 */
export const zhResources = {
  app: {
    demoInterpolationTitle: '插值示例',
    demoNameHint: '修改名称（下方问候语会随之变化）：',
    greeting: '你好，世界',
    welcome: '你好，{{userName}}！'
  },
  devTools: {
    label: '开发者工具',
    openTitle: '打开开发者工具'
  },
  titleBar: {
    languageSelectLabel: '语言',
    switchToEn: 'English',
    switchToZh: '中文'
  }
} as const satisfies TranslationTree;
