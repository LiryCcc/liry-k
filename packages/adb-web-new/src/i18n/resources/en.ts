import type { TranslationTree } from '@/i18n/translation-tree.js';

/** 英文文案表，结构受 TranslationTree 约束。 */
export const enResources: TranslationTree = {
  app: { title: 'ADB Web' },
  home: {
    desc: 'Welcome to ADB Web.',
    title: 'Home'
  },
  nav: {
    basicOperations: 'Basic Ops',
    collapse: 'Collapse sidebar',
    devices: 'Devices',
    expand: 'Expand sidebar',
    home: 'Home'
  },
  notFound: {
    backHome: 'Back to home',
    desc: 'This page does not exist.',
    title: '404'
  },
  debug: {
    title: 'Debug Info',
    environment: 'Environment',
    envVars: 'Environment Variables',
    theme: 'Theme',
    font: 'Font',
    adb: 'ADB Device'
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
    buttonLabel: 'Connect Device',
    connectingMessage: 'Please confirm on your device.',
    connectingTitle: 'Connecting',
    current: 'Current',
    disconnected: 'Disconnected'
  },
  basicOperations: {
    autoBrightness: 'Auto',
    brightness: 'Brightness',
    noDevice: 'No device connected.',
    title: 'Basic Operations',
    volume: 'Volume'
  },
  devices: {
    androidVersion: 'Android Version',
    clearHistory: 'Clear History',
    connected: 'Connected Devices',
    history: 'History',
    lastConnected: 'Last Connected',
    manufacturer: 'Manufacturer',
    model: 'Model',
    noConnected: 'No devices connected.',
    noHistory: 'No device history.',
    serial: 'Serial',
    title: 'Devices'
  }
};
