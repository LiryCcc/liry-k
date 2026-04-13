import { createRouter } from '@tanstack/solid-router';
import { routeTree } from './route-tree.gen.js';

const router = createRouter({
  // routeTree 由 TanStack Router 插件根据文件路由自动生成。
  routeTree,
  defaultPreload: 'intent'
});

declare module '@tanstack/solid-router' {
  interface Register {
    router: typeof router;
  }
}

export default router;
