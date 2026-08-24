import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import type { EslintConfigOptions } from './options.js';
import { qualityPluginConfigs, qualityRuleOverrides } from './quality-plugins.js';
import { cssConfig, mergeIgnores, resolveProjectService, zodRestrictedImportsRule } from './shared.js';

type GlobalsMode = 'node' | 'browser' | 'isomorphic';

const resolveGlobals = (mode: GlobalsMode) => {
  if (mode === 'node') {
    return globals.node;
  }
  if (mode === 'browser') {
    return globals.browser;
  }
  return { ...globals.browser, ...globals.node };
};

/**
 * 无框架的 TS/JS 库或工具包配置（Node / Browser / isomorphic）。
 */
const createLibConfig = (mode: GlobalsMode, options: EslintConfigOptions) =>
  defineConfig([
    globalIgnores(mergeIgnores(options.ignores)),
    ...qualityPluginConfigs,
    {
      files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
      extends: [js.configs.recommended, tseslint.configs.recommended],
      languageOptions: {
        ecmaVersion: 2026,
        globals: resolveGlobals(mode),
        parserOptions: {
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
    ...(options.css === true ? [cssConfig] : [])
  ]);

export { createLibConfig };
