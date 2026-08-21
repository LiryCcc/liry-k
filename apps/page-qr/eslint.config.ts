/// <reference types="node" />
import { ESLINT_CONFIG } from '@liry-k/eslint-config';

export default ESLINT_CONFIG.SOLID_APP({
  tsconfigRootDir: import.meta.dirname,
  /** Material Web CSS 变量与 baseline 规则冲突，改由 stylelint 覆盖样式。 */
  css: false,
  allowDefaultProject: ['eslint.config.ts', 'wxt.config.ts', 'scripts/*.ts', 'target-browsers.ts']
});
