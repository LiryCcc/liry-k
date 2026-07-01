import type { TranslationTree } from '@/i18n/translation-tree.js';

/** 中文文案表，结构受 TranslationTree 约束。 */
export const zhResources: TranslationTree = {
  app: { title: 'ADB Web' },
  home: {
    desc: '欢迎使用 ADB Web。',
    title: '首页'
  },
  nav: { collapse: '收起侧栏', expand: '展开侧栏', home: '首页' },
  notFound: {
    backHome: '返回首页',
    desc: '页面不存在。',
    title: '404'
  },
  ui: {
    adbDocLabel: 'ADB 文档',
    switchToEn: 'English',
    switchToZh: '中文',
    themeDark: '暗色',
    themeLabel: '主题',
    themeLight: '亮色',
    themeTeamsDark: 'Teams 暗色',
    themeTeamsLight: 'Teams 亮色'
  }
};
