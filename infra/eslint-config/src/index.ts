import { createLeetcodeConfig } from './leetcode.js';
import { createLibConfig } from './lib-config.js';
import type { EslintConfigOptions, ReactAppOptions, SolidAppOptions } from './options.js';
import { createReactAppConfig } from './react-app.js';
import { createSolidAppConfig } from './solid-app.js';
import { createWorkerConfig } from './worker.js';

const ESLINT_CONFIG = {
  /** Node.js 库 / CLI / 服务端工具。 */
  NODE_LIB: (options: EslintConfigOptions) => createLibConfig('node', options),
  /** 浏览器侧库（无框架专用规则）。 */
  WEB_LIB: (options: EslintConfigOptions) => createLibConfig('browser', options),
  /** 同时面向 browser + node 的共享工具库。 */
  ISOMORPHIC_LIB: (options: EslintConfigOptions) => createLibConfig('isomorphic', options),
  /** Solid（及同类 JSX）应用。 */
  SOLID_APP: (options: SolidAppOptions) => createSolidAppConfig(options),
  /** React + Vite 应用。 */
  REACT_APP: (options: ReactAppOptions) => createReactAppConfig(options),
  /** Cloudflare Workers 等 isolate 运行时。 */
  WORKER: (options: EslintConfigOptions) => createWorkerConfig(options),
  /** 算法练习包。 */
  LEETCODE: (options: EslintConfigOptions) => createLeetcodeConfig(options)
} as const;

export { ESLINT_CONFIG };
export default ESLINT_CONFIG;
export type { EslintConfigOptions, ReactAppOptions, SolidAppOptions };
