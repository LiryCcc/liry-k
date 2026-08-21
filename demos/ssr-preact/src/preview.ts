import { startSsrServer } from '@liry-k/ssr-server';
import { resolve } from 'node:path';
import { render } from './server.js';

await startSsrServer({
  root: resolve(import.meta.dirname, '../..'),
  isProduction: true,
  render
});
