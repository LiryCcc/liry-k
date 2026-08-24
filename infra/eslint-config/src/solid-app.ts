import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import type { SolidAppOptions } from './options.js';
import { qualityPluginConfigs, qualityRuleOverrides } from './quality-plugins.js';
import {
  cssConfig,
  jsxNoLiteralsBlock,
  mergeIgnores,
  resolveProjectService,
  zodRestrictedImportsRule
} from './shared.js';

/**
 * Solid（及 Preact 等仅需 jsx-no-literals 的 JSX）应用配置。
 */
const createSolidAppConfig = (options: SolidAppOptions) =>
  defineConfig([
    globalIgnores(mergeIgnores(options.ignores)),
    ...qualityPluginConfigs,
    {
      files: ['**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}'],
      extends: [js.configs.recommended, tseslint.configs.recommended],
      languageOptions: {
        ecmaVersion: 2026,
        globals: options.ssr ? { ...globals.browser, ...globals.node } : globals.browser,
        parserOptions: {
          ecmaFeatures: { jsx: true },
          projectService: resolveProjectService(options),
          tsconfigRootDir: options.tsconfigRootDir
        }
      },
      rules: {
        'no-void': 'error',
        ...zodRestrictedImportsRule,
        ...qualityRuleOverrides
      }
    },
    jsxNoLiteralsBlock,
    ...(options.css === false ? [] : [cssConfig])
  ]);

export { createSolidAppConfig };
