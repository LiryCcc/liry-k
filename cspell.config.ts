import { defineConfig } from 'cspell';

const cspellConfig = defineConfig({
  ignorePaths: [
    'node_modules',
    '**/package.json',
    '**/pnpm-lock.yaml',
    '**/dist',
    'rust-packages/**/target',
    'packages/polaris/src-tauri/**',
    'infra/proto/src/generated/**',
    'mc-plugins/**/gradlew.bat',
    'mc-plugins/**/gradle-wrapper.properties',
    'mc-plugins/**/gradlew',
    'mc-plugins/**/build.gradle.kts',
    'mc-plugins/**/settings.gradle.kts'
  ],
  useGitignore: true,
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
    'gomoku',
    'tauri',
    'gradle',
    'gradlew',
    'bukkit',
    'bufbuild',
    'leetcode'
  ]
});

export default cspellConfig;
