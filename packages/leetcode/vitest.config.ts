import { defineConfig } from 'vitest/config';

const vitestConfig = defineConfig({
  test: {
    testTimeout: 30000000,
    pool: 'threads',
    cache: {
      dir: '../../node_modules/.vitest/packages/leetcode'
    }
  }
});
export default vitestConfig;
