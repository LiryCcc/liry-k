import { defineConfig } from 'cspell';

const cspellConfig = defineConfig({
  ignorePaths: ['node_modules', '**/package.json', '**/pnpm-lock.yaml', '**/dist', 'rust-packages/**/target'],
  version: '0.2',
  words: [
    'liry',
    'languagedetector',
    'lngs',
    'lng',
    'logcat',
    'fluentui',
    'yume',
    'fastboot',
    'sideload',
    'webadb',
    'tcpip',
    'webusb',
    'fflate',
    'gprs',
    'hspa',
    'clse',
    'cnxn',
    'addrs',
    'wrte',
    'liu',
    'hengxuan',
    'heng',
    'xuan',
    'rust',
    'rustc',
    'serde',
    'formatcp',
    'clippy',
    'gomoku'
  ]
});

export default cspellConfig;
