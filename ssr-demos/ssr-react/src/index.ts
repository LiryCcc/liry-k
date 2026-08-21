import { startSsrServer } from '@liry-k/ssr-server';
import { resolve } from 'node:path';

await startSsrServer({
  root: resolve(import.meta.dirname, '..')
});
