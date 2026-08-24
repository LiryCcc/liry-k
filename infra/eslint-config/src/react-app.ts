import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactCompiler from 'eslint-plugin-react-compiler';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import type { ReactAppOptions } from './options.js';
import { qualityPluginConfigs, qualityRuleOverrides } from './quality-plugins.js';
import {
  cssConfig,
  jsxNoLiteralsRule,
  mergeIgnores,
  resolveProjectService,
  zodRestrictedImportsRule
} from './shared.js';

/**
 * React + Vite 应用配置。
 *
 * 默认启用：
 * - `eslint-plugin-react`（`jsx-runtime`，适配新 JSX transform）
 * - `eslint-plugin-react-hooks`
 * - `eslint-plugin-react-refresh`（Vite）
 * - `eslint-plugin-react-compiler`
 */
const createReactAppConfig = (options: ReactAppOptions) => {
  const relaxed = options.relaxed === true;
  const compilerEnabled = options.compiler !== false;
  const reactJsxRuntime = react.configs.flat['jsx-runtime'];
  if (reactJsxRuntime === undefined) {
    throw new Error('eslint-plugin-react flat jsx-runtime config is missing');
  }

  const extendsList = [
    js.configs.recommended,
    tseslint.configs.recommended,
    reactJsxRuntime,
    reactHooks.configs.flat.recommended,
    reactRefresh.configs.vite,
    ...(compilerEnabled ? [reactCompiler.configs.recommended] : [])
  ];

  return defineConfig([
    globalIgnores(mergeIgnores(options.ignores)),
    ...qualityPluginConfigs,
    {
      files: ['**/*.{ts,tsx}'],
      extends: extendsList,
      languageOptions: {
        ecmaVersion: 2026,
        globals: options.ssr ? { ...globals.browser, ...globals.node } : globals.browser,
        parserOptions: {
          projectService: resolveProjectService(options),
          tsconfigRootDir: options.tsconfigRootDir
        }
      },
      settings: { react: { version: 'detect' } },
      rules: {
        'no-void': 'error',
        ...zodRestrictedImportsRule,
        ...qualityRuleOverrides,
        ...(relaxed ? {} : jsxNoLiteralsRule),
        ...(relaxed
          ? {
              'react-hooks/set-state-in-effect': 'off',
              'react-hooks/refs': 'off'
            }
          : {})
      }
    },
    ...(options.css === true ? [cssConfig] : [])
  ]);
};

export { createReactAppConfig };
