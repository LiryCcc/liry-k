/// <reference types="node" />
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const config = defineConfig([
  globalIgnores(['dist', 'node_modules', '.wrangler', 'worker-configuration.d.ts', 'test/env.d.ts']),
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      /**
       * Cloudflare Worker 运行在 V8 isolate（Service Worker 模型），
       * 全局 API 与浏览器对齐，不含 Node.js globals。
       */
      globals: globals.browser,
      // 以本包为 TS 工程根，避免 monorepo 内多个 tsconfig 并列时解析歧义。
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      'no-void': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'zod',
              message: "请使用 import { z } from 'zod/v4'"
            },
            {
              name: 'zod/v4/core',
              message: "请使用 import { z } from 'zod/v4'"
            }
          ]
        }
      ]
    }
  }
]);

export default config;
