/// <reference types="node" />
import { ESLINT_CONFIG } from '@liry-k/eslint-config';

export default ESLINT_CONFIG.LEETCODE({
  tsconfigRootDir: import.meta.dirname
});
