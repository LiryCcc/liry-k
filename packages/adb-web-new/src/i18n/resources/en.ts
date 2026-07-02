import type { TranslationTree } from '@/i18n/translation-tree.js';

/** 英文文案表，结构受 TranslationTree 约束。 */
export const enResources: TranslationTree = {
  app: { title: 'ADB Web' },
  home: {
    desc: 'Welcome to ADB Web.',
    title: 'Home'
  },
  nav: { collapse: 'Collapse sidebar', expand: 'Expand sidebar', home: 'Home' },
  notFound: {
    backHome: 'Back to home',
    desc: 'This page does not exist.',
    title: '404'
  },
  ui: {
    adbDocLabel: 'ADB Documentation',
    switchToEn: 'English',
    switchToZh: '中文',
    themeDark: 'Dark',
    themeLabel: 'Theme',
    themeLight: 'Light',
    themeTeamsDark: 'Teams Dark',
    themeTeamsLight: 'Teams Light'
  },
  connect: {
    buttonLabel: 'Connect Device'
  }
};
