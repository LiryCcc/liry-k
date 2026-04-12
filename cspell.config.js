import { defineConfig } from 'cspell';

const cspellConfig = defineConfig({
  ignorePaths: ['node_modules', '**/package.json', '**/pnpm-lock.yaml', '**/dist'],
  version: '0.2',
  words: ['liry']
});

export default cspellConfig;
