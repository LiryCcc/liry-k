import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import type { EslintConfigOptions } from './options.js';
import { leetcodeQualityRuleOverrides, qualityPluginConfigs } from './quality-plugins.js';
import { mergeIgnores, resolveProjectService, zodRestrictedImportsRule } from './shared.js';

/**
 * 算法练习包：允许 `_` 占位未使用变量，并强制 type-only import。
 */
const createLeetcodeConfig = (options: EslintConfigOptions) =>
  defineConfig([
    globalIgnores(mergeIgnores(options.ignores)),
    ...qualityPluginConfigs,
    {
      files: ['**/*.{ts,tsx}'],
      extends: [js.configs.recommended, tseslint.configs.recommended],
      languageOptions: {
        ecmaVersion: 2026,
        globals: { ...globals.browser, ...globals.node },
        parserOptions: {
          projectService: resolveProjectService(options),
          tsconfigRootDir: options.tsconfigRootDir
        }
      },
      rules: {
        'no-void': 'error',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^_'
          }
        ],
        '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
        ...zodRestrictedImportsRule,
        ...leetcodeQualityRuleOverrides
      }
    },
    {
      files: ['**/*.{js,mjs,cjs}'],
      extends: [js.configs.recommended],
      languageOptions: {
        globals: { ...globals.browser, ...globals.node }
      },
      rules: {
        'no-void': 'error',
        'no-unused-vars': ['error', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
        ...leetcodeQualityRuleOverrides
      }
    }
  ]);

export { createLeetcodeConfig };
