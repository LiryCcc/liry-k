import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

const vitestConfig = defineConfig({
  test: {
    testTimeout: 30000000,
    pool: 'threads',
    cache: {
      dir: resolve(import.meta.dirname, 'node_modules/.vitest')
    }
  }
});
export default vitestConfig;
