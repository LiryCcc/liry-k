import type { TranslationTree } from '@/i18n/translation-tree.js';

/** 中文文案表，结构受 TranslationTree 约束。 */
export const zhResources: TranslationTree = {
  about: {
    desc: '这里是 luna 的关于页面。',
    title: '关于'
  },
  app: { title: 'Luna' },
  home: {
    desc: '欢迎来到 luna 首页。',
    title: '首页'
  },
  nav: {
    about: '关于',
    home: '首页',
    pathParam: '路径参数',
    queryJson: 'Query JSON'
  },
  notFound: {
    backHome: '返回首页',
    desc: '页面不存在。',
    title: '404'
  },
  pathParam: {
    desc: '当前路由参数 postId（自动强类型）:',
    title: '路径参数示例'
  },
  queryJson: {
    desc: '当前 URL 的 query 参数会转换为 JSON 字符串。',
    title: 'Query JSON'
  },
  ui: {
    switchToEn: 'English',
    switchToZh: '中文'
  }
};
