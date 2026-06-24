import { commonConfig } from './common-config.js';
import { REACT_CONFIG } from './react.js';
import { SOLID_CONFIG } from './solid.js';

const ESLINT_CONFIG = {
  NODE_LIB: commonConfig('node'),
  WEB_LIB: commonConfig('browser'),
  REACT_APP: REACT_CONFIG,
  SOLID_CONFIG: SOLID_CONFIG
} as const;

export { ESLINT_CONFIG };
export default ESLINT_CONFIG;
