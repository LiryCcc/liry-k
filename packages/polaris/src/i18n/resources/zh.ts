import type { TranslationTree } from '@/i18n/translation-tree.js';

/** 中文文案表，结构受 TranslationTree 约束。 */
export const zhResources: TranslationTree = {
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
};
