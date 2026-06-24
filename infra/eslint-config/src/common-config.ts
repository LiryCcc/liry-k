import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import { cwd } from 'node:process';
import tseslint from 'typescript-eslint';

export const commonConfig = (type: keyof typeof globals) =>
  defineConfig([
    // for generated code such as proto
    globalIgnores(['dist', 'node_modules', 'src/generated']),
    {
      files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
      extends: [js.configs.recommended, tseslint.configs.recommended],
      languageOptions: {
        globals: globals[type],
        parserOptions: {
          projectService: true,
          // for the cwd not import.meta.dirname
          tsconfigRootDir: cwd()
        }
      },
      rules: {
        'no-void': 'error'
      }
    }
  ]);
