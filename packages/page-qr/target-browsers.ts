/**
 * Browsers WXT officially targets for this extension.
 * Kept in sync with `targetBrowsers` in `wxt.config.ts` and the build/zip scripts.
 */
const targetBrowsers = ['chrome', 'firefox', 'edge', 'safari'] as const;

export type TargetBrowserName = (typeof targetBrowsers)[number];

export default targetBrowsers;
