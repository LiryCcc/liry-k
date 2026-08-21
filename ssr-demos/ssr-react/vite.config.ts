import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const viteConfig = defineConfig({
  plugins: [react()],
  build: {
    manifest: true,
    rollupOptions: {
      input: resolve(import.meta.dirname, 'src/client.ts')
    }
  }
});

export default viteConfig;
