import type { Config } from 'stylelint';

const stylelintConfig: Config = {
  extends: ['stylelint-config-standard'],
  ignoreFiles: ['**/node_modules/**', '**/dist/**', '**/coverage/**', '**/src/generated/**'],
  rules: {
    /**
     * CSS Modules 文件中类名惯用 camelCase，与 JS/TS 对象属性名对齐；
     * 自定义属性（如 Fluent UI token）同样使用 camelCase，此处放宽限制。
     */
    'selector-class-pattern': null,
    'custom-property-pattern': null
  }
};

export default stylelintConfig;
