import { startSsrServer } from '@liry-k/ssr-server';
import { resolve } from 'node:path';
import { createServer as createViteServer } from 'vite';

await startSsrServer({
  root: resolve(import.meta.dirname, '..'),
  createViteServer
});
