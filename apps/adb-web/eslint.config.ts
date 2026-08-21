/// <reference types="node" />
import { ESLINT_CONFIG } from '@liry-k/eslint-config';

export default ESLINT_CONFIG.REACT_APP({
  tsconfigRootDir: import.meta.dirname,
  relaxed: true,
  allowDefaultProject: ['eslint.config.ts']
});
