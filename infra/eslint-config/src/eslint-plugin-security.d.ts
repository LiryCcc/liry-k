declare module 'eslint-plugin-security' {
  import type { ESLint, Linter } from 'eslint';

  const pluginSecurity: ESLint.Plugin & {
    configs: {
      recommended: Linter.Config;
    };
  };

  export default pluginSecurity;
}
