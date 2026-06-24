import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { commonConfig } from './common-config.js';

export const REACT_CONFIG = defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      react.configs.flat,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite
    ],
    languageOptions: {
      ecmaVersion: 2026,
      globals: globals.browser
    },
    rules: {
      'no-void': 'error',

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
