import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

const viteConfig = defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
      '@@': resolve(import.meta.dirname)
    }
  },
  server: {
    port: 45892
  }
});

export default viteConfig;
