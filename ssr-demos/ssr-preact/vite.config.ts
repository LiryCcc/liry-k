import preact from '@preact/preset-vite';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const viteConfig = defineConfig({
  plugins: [
    preact({
      babel: {
        cwd: createRequire(import.meta.url).resolve('@preact/preset-vite')
      }
    })
  ],
  build: {
    manifest: true,
    rollupOptions: {
      input: resolve(import.meta.dirname, 'src/client.ts')
    }
  }
});

export default viteConfig;
