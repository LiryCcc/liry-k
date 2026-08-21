import { defineConfig } from 'tsdown';

const tsdownConfig = defineConfig({
  entry: 'src/index.ts',
  dts: true,
  format: 'esm',
  clean: true,
  fixedExtension: false
});

export default tsdownConfig;
