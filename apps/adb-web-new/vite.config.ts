import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { randomBytes } from 'crypto';
import { resolve } from 'path';
import { defineConfig } from 'vite';

const TOTP_SECRET = randomBytes(20).toString('hex');

const viteConfig = defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
      '@@': resolve(import.meta.dirname)
    }
  },
  define: {
    __TOTP_SECRET__: JSON.stringify(TOTP_SECRET)
  },
  build: {
    minify: false
  },
  builder: {},
  server: {
    port: 45895,
    headers: {
      // 仅对 src 下 worker 文件放行全局scope
      'Service-Worker-Allowed': '/'
    }
  },
  optimizeDeps: {
    include: ['@liry-k/stellar']
  }
});

export default viteConfig;
