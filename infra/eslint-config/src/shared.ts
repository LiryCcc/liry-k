import css from '@eslint/css';
import type { Linter } from 'eslint';
import react from 'eslint-plugin-react';

import type { EslintConfigOptions } from './options.js';

const DEFAULT_IGNORES = [
  'dist',
  'node_modules',
  'src/generated',
  'src-tauri',
  'coverage',
  '.wrangler',
  '.wxt',
  '.output',
  '.tanstack',
  'route-tree.gen.ts',
  'worker-configuration.d.ts'
];

const ZOD_IMPORT_MESSAGE = '仅允许使用 import { z } from "zod/v4"；禁止 zod 包其它入口与子路径（含 zod/v4/core 等）。';

const zodRestrictedImportsRule: Linter.RulesRecord = {
  'no-restricted-imports': [
    'error',
    {
      paths: [
        { name: 'zod', message: ZOD_IMPORT_MESSAGE },
        { name: 'zod/mini', message: ZOD_IMPORT_MESSAGE },
        { name: 'zod/locales', message: ZOD_IMPORT_MESSAGE },
        { name: 'zod/v3', message: ZOD_IMPORT_MESSAGE },
        { name: 'zod/v4-mini', message: ZOD_IMPORT_MESSAGE },
        {
          allowImportNames: ['z'],
          message: ZOD_IMPORT_MESSAGE,
          name: 'zod/v4'
        }
      ],
      patterns: [
        {
          message: ZOD_IMPORT_MESSAGE,
          regex: '^zod\\/v4\\/.+'
        }
      ]
    }
  ]
};

const jsxNoLiteralsRule: Linter.RulesRecord = {
  'react/jsx-no-literals': [
    'error',
    {
      ignoreProps: true,
      noAttributeStrings: false,
      noStrings: true
    }
  ]
};

const cssConfig = {
  files: ['**/*.css'],
  plugins: { css },
  language: 'css/css',
  extends: [css.configs.recommended]
};

const jsxNoLiteralsBlock = {
  files: ['**/*.{tsx,jsx}'],
  plugins: { react },
  settings: { react: { version: 'detect' } },
  rules: jsxNoLiteralsRule
};

const mergeIgnores = (extra: string[] | undefined): string[] => [...DEFAULT_IGNORES, ...(extra ?? [])];

/**
 * 默认 `projectService: true`；仅当消费方显式传入未纳入 tsconfig 的文件时启用 allowDefaultProject。
 */
const resolveProjectService = (options: EslintConfigOptions) => {
  if (options.allowDefaultProject === undefined || options.allowDefaultProject.length === 0) {
    return true;
  }
  return { allowDefaultProject: options.allowDefaultProject };
};

export {
  cssConfig,
  jsxNoLiteralsBlock,
  jsxNoLiteralsRule,
  mergeIgnores,
  resolveProjectService,
  zodRestrictedImportsRule
};
