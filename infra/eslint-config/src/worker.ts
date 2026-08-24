import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import type { EslintConfigOptions } from './options.js';
import { qualityPluginConfigs, qualityRuleOverrides } from './quality-plugins.js';
import { mergeIgnores, resolveProjectService, zodRestrictedImportsRule } from './shared.js';

/**
 * Cloudflare Workers 等 V8 isolate 运行时（globals 对齐浏览器）。
 */
const createWorkerConfig = (options: EslintConfigOptions) =>
  defineConfig([
    globalIgnores(mergeIgnores(options.ignores)),
    ...qualityPluginConfigs,
    {
      files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
      extends: [js.configs.recommended, tseslint.configs.recommended],
      languageOptions: {
        ecmaVersion: 2026,
        globals: globals.browser,
        parserOptions: {
          projectService: resolveProjectService(options),
          tsconfigRootDir: options.tsconfigRootDir
        }
      },
      rules: {
        'no-void': 'error',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        ...zodRestrictedImportsRule,
        ...qualityRuleOverrides
      }
    }
  ]);

export { createWorkerConfig };
