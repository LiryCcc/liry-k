import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

const viteConfig = defineConfig({
  plugins: [
    tanstackRouter({
      target: 'solid',
      autoCodeSplitting: true,
      routesDirectory: './src/routes',
      generatedRouteTree: './src/route-tree.gen.ts',
      routeFileIgnorePrefix: '-',
      quoteStyle: 'single'
    }),
    solid()
  ],
  build: {
    target: false
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
