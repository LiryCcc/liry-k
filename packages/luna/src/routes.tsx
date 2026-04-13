import { createRootRoute, createRoute, createRouter } from '@tanstack/solid-router';
import { z } from 'zod';
import { AboutPage } from './pages/about-page/index.js';
import { HomePage } from './pages/home-page/index.js';
import { NotFoundPage } from './pages/not-found-page/index.js';
import { PathParamPage } from './pages/path-param-page/index.js';
import { QueryJsonPage } from './pages/query-json-page/index.js';
import { RootLayout } from './pages/root-layout/index.js';

const queryJsonSearchSchema = z.object({
  keyword: z.string().optional(),
  page: z.coerce.number().int().positive().catch(1),
  tags: z.array(z.string()).catch([])
});

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage
});

const queryJsonRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/query-json',
  validateSearch: queryJsonSearchSchema,
  component: QueryJsonPage
});

const pathParamRoute = createRoute({
  getParentRoute: () => rootRoute,
  // 仅通过路径声明动态段，TanStack 会自动推导 params 类型。
  path: '/path-demo/$postId',
  component: PathParamPage
});

const routeTree = rootRoute.addChildren([homeRoute, aboutRoute, queryJsonRoute, pathParamRoute]);

const router = createRouter({
  // 统一维护配置式路由表，结构类似 React Router。
  routeTree,
  defaultPreload: 'intent'
});

declare module '@tanstack/solid-router' {
  interface Register {
    router: typeof router;
  }
}

export default router;
