import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactCompiler from 'eslint-plugin-react-compiler';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import type { ReactAppOptions } from './options.js';
import {
  cssConfig,
  jsxNoLiteralsRule,
  mergeIgnores,
  resolveProjectService,
  zodRestrictedImportsRule
} from './shared.js';

/**
 * React + Vite 应用配置。
 */
const createReactAppConfig = (options: ReactAppOptions) => {
  const relaxed = options.relaxed === true;
  const extendsList = [
    js.configs.recommended,
    tseslint.configs.recommended,
    reactHooks.configs.flat.recommended,
    reactRefresh.configs.vite,
    ...(options.compiler === true ? [reactCompiler.configs.recommended] : [])
  ];

  return defineConfig([
    globalIgnores(mergeIgnores(options.ignores)),
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
      plugins: { react },
      settings: { react: { version: 'detect' } },
      rules: {
        'no-void': 'error',
        ...zodRestrictedImportsRule,
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
