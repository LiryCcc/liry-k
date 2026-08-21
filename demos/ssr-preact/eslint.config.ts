/// <reference types="node" />
import css from '@eslint/css';
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const eslintConfig = defineConfig([
  globalIgnores(['dist', 'node_modules']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaFeatures: { jsx: true },
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    plugins: { react },
    settings: { react: { version: '18.2' } },
    rules: {
      'no-void': 'error',
      'react/jsx-no-literals': ['error', { ignoreProps: true, noAttributeStrings: false, noStrings: true }]
    }
  },
  {
    files: ['**/*.css'],
    plugins: { css },
    language: 'css/css',
    extends: [css.configs.recommended]
  }
]);

export default eslintConfig;
