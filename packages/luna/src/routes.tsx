import { createRootRoute, createRoute, createRouter } from '@tanstack/solid-router';
import { z } from 'zod/v4';
import { AboutPage } from '@/pages/about-page/index.js';
import { HomePage } from '@/pages/home-page/index.js';
import { NotFoundPage } from '@/pages/not-found-page/index.js';
import { PathParamPage } from '@/pages/path-param-page/index.js';
import { QueryJsonPage } from '@/pages/query-json-page/index.js';
import { RootLayout } from '@/pages/root-layout/index.js';

const queryJsonSearchSchema = z.object({
  keyword: z.string().optional().catch(''),
  page: z.coerce.number().int().positive().catch(1),
  tags: z.array(z.string()).catch([])
});

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage
});

// 类似 React Router 的 children：用「子路由数组」集中写表，不要用 .map() 生成，
// 否则 TS 会丢失 path 字面量，整棵树的 Link / getRouteApi 强类型会失效。
const routeTree = rootRoute.addChildren([
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: HomePage
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/about',
    component: AboutPage
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/query-json',
    validateSearch: queryJsonSearchSchema,
    component: QueryJsonPage
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/path-demo/$postId',
    component: PathParamPage
  })
]);

const router = createRouter({
  routeTree,
  defaultPreload: 'intent'
});

declare module '@tanstack/solid-router' {
  interface Register {
    router: typeof router;
  }
}

export default router;
