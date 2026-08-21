import p from '@@/package.json';
import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  return c.json(p);
});

export default app;
