import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const viteConfig = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
      '@@': resolve(import.meta.dirname)
    }
  },
  build: {
    manifest: true,
    rollupOptions: {
      input: resolve(import.meta.dirname, 'src/client.ts')
    }
  }
});

export default viteConfig;
