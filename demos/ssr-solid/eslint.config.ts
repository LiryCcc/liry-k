/// <reference types="node" />
import { ESLINT_CONFIG } from '@liry-k/eslint-config';

export default ESLINT_CONFIG.SOLID_APP({
  tsconfigRootDir: import.meta.dirname,
  ssr: true
});
