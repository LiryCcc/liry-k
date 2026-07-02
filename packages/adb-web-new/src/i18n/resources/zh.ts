import type { TranslationTree } from '@/i18n/translation-tree.js';

/** 中文文案表，结构受 TranslationTree 约束。 */
export const zhResources: TranslationTree = {
  app: { title: 'ADB Web' },
  home: {
    desc: '欢迎使用 ADB Web。',
    title: '首页'
  },
  nav: { basicOperations: '基础操作', collapse: '收起侧栏', devices: '设备管理', expand: '展开侧栏', home: '首页' },
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
  },
  connect: {
    buttonLabel: '连接设备',
    connectingMessage: '请在手机上确认连接。',
    connectingTitle: '连接中',
    current: '当前',
    disconnected: '未连接'
  },
  basicOperations: {
    brightness: '亮度',
    noDevice: '未连接设备。',
    title: '基础操作',
    volume: '音量'
  },
  devices: {
    androidVersion: 'Android 版本',
    clearHistory: '清除历史',
    connected: '已连接设备',
    history: '历史记录',
    lastConnected: '上次连接',
    manufacturer: '厂商',
    model: '型号',
    noConnected: '暂无已连接设备。',
    noHistory: '暂无历史记录。',
    serial: '序列号',
    title: '设备管理'
  }
};
