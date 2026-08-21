/// <reference types="node" />
import { ESLINT_CONFIG } from '@liry-k/eslint-config';

export default ESLINT_CONFIG.WORKER({
  tsconfigRootDir: import.meta.dirname,
  ignores: ['test/env.d.ts']
});
