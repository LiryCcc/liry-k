import js from '@eslint/js';

import security from 'eslint-plugin-security';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';

import type { Linter } from 'eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist', 'vite.config.ts']),

  {
    files: ['**/*.{ts,tsx}'],

    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,

      security.configs.recommended as Linter.Config,
      sonarjs.configs!.recommended as Linter.Config,
      unicorn.configs.recommended
    ],

    languageOptions: {
      globals: globals.browser
    },

    rules: {
      'unicorn/import-style': 'off',
      'unicorn/default-export-style': 'off',
      'sonarjs/todo-tag': 'off'
    }
  }
]);
