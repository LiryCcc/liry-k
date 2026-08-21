type EslintConfigOptions = {
  /** 消费方包根目录，通常传 `import.meta.dirname`。 */
  tsconfigRootDir: string;
  /** 追加到默认 ignore 列表的路径。 */
  ignores?: string[];
  /**
   * 是否对 `*.css` 启用 `@eslint/css`。
   * SOLID 默认 true；REACT / 库 / WORKER 默认 false（Fluent 等设计 token 易误报）。
   */
  css?: boolean;
  /**
   * 未列入本包 tsconfig 的文件（如 `eslint.config.ts`、脚本），交给 default project。
   * 勿列入已被 tsconfig 包含的路径。
   */
  allowDefaultProject?: string[];
};

type SolidAppOptions = EslintConfigOptions & {
  /** SSR 场景同时启用 browser + node globals。 */
  ssr?: boolean;
};

type ReactAppOptions = EslintConfigOptions & {
  /** SSR 场景同时启用 browser + node globals。 */
  ssr?: boolean;
  /** 启用 eslint-plugin-react-compiler。 */
  compiler?: boolean;
  /**
   * 旧版应用兼容：关闭 jsx-no-literals / CSS，并放宽部分 react-hooks 规则。
   * 仅用于尚未清理的历史包（如 `adb-web`）。
   */
  relaxed?: boolean;
};

export type { EslintConfigOptions, ReactAppOptions, SolidAppOptions };
