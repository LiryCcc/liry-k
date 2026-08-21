/// <reference types="node" />
import { ESLINT_CONFIG } from '@liry-k/eslint-config';

export default ESLINT_CONFIG.NODE_LIB({
  tsconfigRootDir: import.meta.dirname,
  allowDefaultProject: ['eslint.config.ts', 'run-protoc.ts', 'build.ts']
});
