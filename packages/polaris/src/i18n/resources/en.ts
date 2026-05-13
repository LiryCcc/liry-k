import type { TranslationTree } from '@/i18n/translation-tree.js';

/** 英文文案表，结构受 TranslationTree 约束。 */
export const enResources: TranslationTree = {
  app: {
    demoInterpolationTitle: 'Interpolation demo',
    demoNameHint: 'Adjust the name (the greeting below updates):',
    greeting: 'Hello World',
    welcome: 'Hello, {{userName}}!'
  },
  devTools: {
    label: 'DevTools',
    openTitle: 'Open developer tools'
  }
};
