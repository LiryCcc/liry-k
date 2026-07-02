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
  debug: {
    title: '调试信息',
    environment: '环境',
    envVars: '环境变量',
    screen: '屏幕',
    network: '网络',
    capabilities: '能力',
    storage: '存储',
    totp: 'TOTP',
    totpTitle: '调试入口',
    totpPlaceholder: '输入 TOTP 验证码',
    totpVerify: '验证',
    totpCancel: '取消',
    totpError: '验证码错误',
    performance: '性能',
    memory: '内存',
    battery: '电池',
    geolocation: '地理位置',
    media: '媒体设备',
    window: '窗口',
    time: '本地时间',
    refresh: '刷新',
    notification: '通知',
    testSend: '测试发送',
    theme: '主题',
    font: '字体',
    adb: 'ADB 设备'
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
    autoBrightness: '自动',
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
