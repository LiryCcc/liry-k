import sw from '@/sw.js?url&no-inline';

export const initServiceWorker = async (): Promise<void> => {
  try {
    await navigator.serviceWorker.register(sw, {
      scope: '/'
      // type: 'module',
      // updateViaCache: 'none'
    });
  } catch {
    /** sw registration failed */
  }
};
