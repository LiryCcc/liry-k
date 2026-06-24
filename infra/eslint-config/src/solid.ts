import js from '@eslint/js';
import react from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { commonConfig } from './common-config.js';

export const SOLID_CONFIG = defineConfig([
  {
    // 含 tsx/jsx，便于 TS + JSX 与下方 react/jsx-no-literals 共用同一解析链路。
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended, react.configs.flat],
    languageOptions: {
      globals: globals.browser,
      // 以本包为 TS 工程根，避免 monorepo 内多个 tsconfig 并列时解析歧义。
      parserOptions: {
        ecmaFeatures: { jsx: true },
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      'react/jsx-no-literals': [
        'error',
        {
          ignoreProps: true,
          noAttributeStrings: false,
          noStrings: true
        }
      ]
    }
  },
  commonConfig('browser')
]);
