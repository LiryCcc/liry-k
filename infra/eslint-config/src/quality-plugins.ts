import type { Linter } from 'eslint';
import security from 'eslint-plugin-security';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';

/** 仅作用于脚本；避免 unicorn/sonarjs/security 作用到 CSS 语言块。 */
const JS_TS_GLOBS = ['**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}'] as const;

/**
 * 全包共享的质量 / 安全插件配置。
 * unicorn 使用 `unopinionated`：保留高价值规则，避免 recommended 的风格强约束与 AGENTS 冲突。
 */
const qualityPluginConfigs: Linter.Config[] = [
  { ...security.configs.recommended, files: [...JS_TS_GLOBS] },
  { ...sonarjs.configs.recommended, files: [...JS_TS_GLOBS] },
  { ...unicorn.configs.unopinionated, files: [...JS_TS_GLOBS] }
];

/**
 * 与本仓库惯例冲突、或误报过多的规则覆盖。
 */
const qualityRuleOverrides: Linter.RulesRecord = {
  /** 经典误报：合法索引访问几乎都会触发。 */
  'security/detect-object-injection': 'off',
  /** 字符串相等比较常被误判为 timing attack。 */
  'security/detect-possible-timing-attacks': 'off',

  /** 第三方 API 弃用应由升级跟踪，不阻塞 lint。 */
  'sonarjs/deprecation': 'off',
  'sonarjs/todo-tag': 'off',
  'sonarjs/pseudo-random': 'off',
  'sonarjs/cognitive-complexity': 'off',
  'sonarjs/no-nested-conditional': 'off',
  'sonarjs/no-nested-functions': 'off',
  /** 与 TypeScript 收窄语义冲突较多。 */
  'sonarjs/different-types-comparison': 'off',
  /** 与 `@typescript-eslint/no-unused-vars` 重复。 */
  'sonarjs/no-unused-vars': 'off',
  'sonarjs/no-duplicate-string': 'off',
  'sonarjs/no-identical-functions': 'off',
  /** CLI / 脚本会读 PATH，属预期。 */
  'sonarjs/no-os-command-from-path': 'off',
  /** CLI exit code 常固定为 0；不强制改成“有匹配才成功”。 */
  'sonarjs/no-invariant-returns': 'off',
  /** CLI / 工具包按用户路径读写属预期。 */
  'security/detect-non-literal-fs-filename': 'off',

  'unicorn/no-top-level-side-effects': 'off',
  'unicorn/prefer-await': 'off',
  'unicorn/prefer-global-this': 'off',
  'unicorn/no-unnecessary-global-this': 'off',
  'unicorn/no-global-object-property-assignment': 'off',
  'unicorn/no-array-for-each': 'off',
  'unicorn/no-for-each': 'off',
  'unicorn/prefer-top-level-await': 'off',
  'unicorn/numeric-separators-style': 'off',
  'unicorn/prefer-ternary': 'off',
  /** Vite / Node 配置里 namespace import 更常见。 */
  'unicorn/import-style': 'off',
  'unicorn/prefer-early-return': 'off',
  'unicorn/no-negated-condition': 'off',
  'unicorn/prefer-module': 'off',
  'unicorn/no-process-exit': 'off',
  'unicorn/no-empty-file': 'off',
  'unicorn/prefer-number-coercion': 'off',
  'unicorn/text-encoding-identifier-case': 'off',
  'unicorn/prefer-code-point': 'off',
  'unicorn/prefer-blob-reading-methods': 'off',
  'unicorn/prefer-add-event-listener': 'off',
  'unicorn/prefer-minimal-ternary': 'off',
  'unicorn/consistent-compound-words': 'off',
  'unicorn/no-declarations-before-early-exit': 'off',
  'unicorn/prefer-array-from-map': 'off',
  'unicorn/prefer-object-iterable-methods': 'off',
  'unicorn/no-array-sort': 'off',
  'unicorn/prefer-string-replace-all': 'off',
  'unicorn/prefer-dom-node-append': 'off',
  'unicorn/prefer-node-protocol': 'off',
  /**
   * autofix 会改成 `dataset.foo`，与 `noPropertyAccessFromIndexSignature` 冲突。
   */
  'unicorn/dom-node-dataset': 'off',
  /** 与 Prettier 对十六进制字面量的大小写偏好冲突。 */
  'unicorn/number-literal-case': 'off',
  'sonarjs/updated-loop-counter': 'off',
  'sonarjs/prefer-promise-shorthand': 'off',
  'sonarjs/public-static-readonly': 'off'
};

/**
 * 算法练习包额外放宽。
 */
const leetcodeQualityRuleOverrides: Linter.RulesRecord = {
  ...qualityRuleOverrides,
  'sonarjs/function-return-type': 'off',
  'sonarjs/no-misleading-array-reverse': 'off',
  'sonarjs/arguments-order': 'off',
  'sonarjs/misplaced-loop-counter': 'off',
  'sonarjs/no-redundant-jump': 'off',
  'unicorn/no-array-reverse': 'off',
  'unicorn/no-magic-array-flat-depth': 'off',
  'unicorn/error-message': 'off',
  'unicorn/prefer-at': 'off',
  'unicorn/prefer-set-has': 'off',
  'unicorn/prefer-direct-iteration': 'off',
  'unicorn/prefer-switch': 'off',
  'unicorn/prefer-number-properties': 'off',
  'unicorn/prefer-minimal-ternary': 'off',
  'unicorn/prefer-single-call': 'off',
  'unicorn/prefer-promise-with-resolvers': 'off',
  'unicorn/explicit-timer-delay': 'off',
  'unicorn/no-typeof-undefined': 'off',
  'unicorn/no-subtraction-comparison': 'off',
  'unicorn/no-lonely-if': 'off',
  'unicorn/no-invalid-argument-count': 'off',
  'unicorn/no-nonstandard-builtin-properties': 'off',
  'unicorn/no-useless-continue': 'off',
  'unicorn/no-unreadable-array-destructuring': 'off',
  'unicorn/prefer-math-min-max': 'off',
  'unicorn/no-array-sort-for-min-max': 'off',
  'unicorn/no-new-array': 'off',
  'unicorn/new-for-builtins': 'off',
  'security/detect-non-literal-regexp': 'off'
};

export { leetcodeQualityRuleOverrides, qualityPluginConfigs, qualityRuleOverrides };
