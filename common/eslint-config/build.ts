import { build } from '@liry-k/build';

const eslintConfigBuild = () =>
  build({
    inputOptions: {
      resolve: {
        mainFields: ['module', 'main'],
        extensions: ['.ts', '.mts', '.cts', '.js', '.cjs', '.mjs', '.d.ts', '.d.cts', '.d.mts']
      }
    }
  });

eslintConfigBuild();
