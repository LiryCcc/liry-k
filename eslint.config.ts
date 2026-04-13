import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

/**
 * 全 monorepo 各包（packages/*）统一禁止「连续多行 //」作一段说明，与 agents.md 约定一致。
 * 各包可另有本地 eslint.config（如 luna）；本条仅在仓库根对 packages/** 再跑一遍注释风格。
 */
export default defineConfig([
  globalIgnores(['**/node_modules/**', '**/dist/**', 'packages/luna/.tanstack/**', '**/route-tree.gen.ts']),
  {
    files: ['*/**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin
    },
    rules: {
      'multiline-comment-style': ['error', 'starred-block']
    }
  }
]);
