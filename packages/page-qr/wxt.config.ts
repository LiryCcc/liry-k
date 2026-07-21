import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-solid'],
  manifest: {
    name: 'Page QR',
    description: 'Generate a QR code for the current page URL',
    permissions: ['activeTab']
  }
});
