import { defineConfig } from 'wxt';

import targetBrowsers from './target-browsers.ts';

/**
 * WXT builds one browser per `wxt build` invocation.
 * `targetBrowsers` only narrows `import.meta.env.BROWSER` types — it does not
 * multi-build. Use `pnpm build` / `pnpm zip` (see package.json) to emit all.
 */
export default defineConfig({
  modules: ['@wxt-dev/module-solid'],
  targetBrowsers: [...targetBrowsers],
  /** Extension build output root (per-browser dirs: `dist/chrome-mv3`, …). */
  outDir: 'dist',
  manifest: {
    name: 'Page QR',
    description: 'Generate a QR code for the current page URL',
    permissions: ['activeTab', 'clipboardWrite'],
    browser_specific_settings: {
      gecko: {
        id: 'page-qr@liry-k',
        strict_min_version: '109.0',
        data_collection_permissions: {
          required: ['none']
        }
      },
      safari: {
        strict_min_version: '15.4'
      }
    }
  }
});
