import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

const viteConfig = defineConfig({
  plugins: [solid()],
  build: {
    target: false
  },
  server: {
    port: 26413
  }
});

export default viteConfig;
