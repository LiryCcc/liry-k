import css from '@eslint/css';
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const zodImportMessage = '仅允许使用 import { z } from "zod/v4"；禁止 zod 包其它入口与子路径（含 zod/v4/core 等）。';

const eslintConfig = defineConfig([
  globalIgnores(['.tanstack', 'dist', 'node_modules', 'route-tree.gen.ts']),
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: { globals: globals.browser },
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'zod', message: zodImportMessage },
            { name: 'zod/mini', message: zodImportMessage },
            { name: 'zod/locales', message: zodImportMessage },
            { name: 'zod/v3', message: zodImportMessage },
            { name: 'zod/v4-mini', message: zodImportMessage },
            {
              allowImportNames: ['z'],
              message: zodImportMessage,
              name: 'zod/v4'
            }
          ],
          // 拦截 zod/v4/core、zod/v4/mini、zod/v4/locales 等一切 zod/v4/* 子路径
          patterns: [
            {
              message: zodImportMessage,
              regex: '^zod\\/v4\\/.+'
            }
          ]
        }
      ]
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
