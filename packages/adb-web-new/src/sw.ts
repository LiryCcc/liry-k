/// <reference lib="WebWorker" />

declare const self: ServiceWorkerGlobalScope;

self.addEventListener('activate', (e) => {
  console.log('activate', e);
});

self.addEventListener('cookiechange', (e) => {
  console.log('cookie change', e);
});
