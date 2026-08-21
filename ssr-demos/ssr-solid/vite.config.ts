import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

const viteConfig = defineConfig({
  plugins: [solid({ ssr: true })],
  build: {
    manifest: true,
    rollupOptions: {
      input: resolve(import.meta.dirname, 'src/client.ts')
    }
  }
});

export default viteConfig;
