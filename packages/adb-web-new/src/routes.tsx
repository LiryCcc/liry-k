import { RootLayoutComponent } from '@/pages/root-layout/index.js';
import { isDebugUnlocked } from '@/utils/debug-guard.js';
import { createRootRoute, createRoute, createRouter, redirect } from '@tanstack/react-router';
import { lazy } from 'react';

const rootRoute = createRootRoute({
  component: RootLayoutComponent,
  notFoundComponent: lazy(() => import('@/pages/not-found-page/index.js'))
});

/**
 * 类似 React Router 的 children：用「子路由数组」集中写表，不要用 .map() 生成，
 * 否则 TS 会丢失 path 字面量，整棵树的 Link / getRouteApi 强类型会失效。
 */
const routeTree = rootRoute.addChildren([
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: lazy(() => import('@/pages/home-page/index.js'))
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/devices',
    component: lazy(() => import('@/pages/connected-devices-manage/index.js'))
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/basic-operations',
    component: lazy(() => import('@/pages/basic-operations/index.js'))
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/debug',
    component: lazy(() => import('@/pages/debug-page/index.js')),
    beforeLoad: () => {
      if (!isDebugUnlocked()) {
        throw redirect({ to: '/' });
      }
    }
  })
]);

const router = createRouter({
  routeTree,
  defaultPreload: 'intent'
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default router;
