import { render } from '@/server.js';
import { startSsrServer } from '@liry-k/ssr-server';
import { resolve } from 'node:path';

const server = await startSsrServer({
  root: resolve(import.meta.dirname, '../..'),
  healthPath: '/healthz',
  isProduction: true,
  render
});

const shutdown = () => {
  server.close((error) => {
    if (error !== undefined) {
      console.error(error);
      process.exitCode = 1;
    }
  });
};

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
