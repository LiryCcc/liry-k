import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

const viteConfig = defineConfig({
  plugins: [solid()],
  build: {
    target: false,
    minify: false,
    cssMinify: false,
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
      '@@': resolve(import.meta.dirname)
    }
  },
  server: {
    port: 26413
  }
});

export default viteConfig;
