import type { TranslationTree } from '@/i18n/translation-tree.js';

/** 英文文案表，结构受 TranslationTree 约束。 */
export const enResources: TranslationTree = {
  about: {
    desc: 'This is the about page for luna.',
    title: 'About'
  },
  app: { title: 'Luna' },
  home: {
    desc: 'Welcome to the luna home page.',
    title: 'Home'
  },
  nav: {
    about: 'About',
    home: 'Home',
    pathParam: 'Path param',
    queryJson: 'Query JSON'
  },
  notFound: {
    backHome: 'Back to home',
    desc: 'This page does not exist.',
    title: '404'
  },
  pathParam: {
    desc: 'Current route param postId (typed):',
    title: 'Path param demo'
  },
  queryJson: {
    desc: 'Current URL search params as validated JSON.',
    title: 'Query JSON'
  },
  ui: {
    switchToEn: 'English',
    switchToZh: '中文'
  }
};
