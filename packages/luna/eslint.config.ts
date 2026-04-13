/// <reference types="node" />
import css from '@eslint/css';
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const zodImportMessage = '仅允许使用 import { z } from "zod/v4"；禁止 zod 包其它入口与子路径（含 zod/v4/core 等）。';

const eslintConfig = defineConfig([
  globalIgnores(['.tanstack', 'dist', 'node_modules', 'route-tree.gen.ts']),
  {
    // 含 tsx/jsx，便于 TS + JSX 与下方 react/jsx-no-literals 共用同一解析链路。
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
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
    // 禁止 JSX 子节点中的裸文本，须写成 {'…'}；仅用 react 插件这一条规则，不引入 React 专用推荐集。
    files: ['**/*.{tsx,jsx}'],
    plugins: { react },
    settings: { react: { version: '18.2' } },
    rules: {
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
