/// <reference types="node" />
import { ESLINT_CONFIG } from '@liry-k/eslint-config';

export default ESLINT_CONFIG.REACT_APP({
  tsconfigRootDir: import.meta.dirname,
  css: false,
  /** Demo 文案直接写在 JSX 里，不做 i18n 字面量约束。 */
  relaxed: true
});
