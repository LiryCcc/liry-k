import { BasicOperationsComponent } from '@/pages/basic-operations/index.js';
import { ConnectedDevicesManageComponent } from '@/pages/connected-devices-manage/index.js';
import { HomePageComponent } from '@/pages/home-page/index.js';
import { NotFoundPageComponent } from '@/pages/not-found-page/index.js';
import { RootLayoutComponent } from '@/pages/root-layout/index.js';
import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';

const rootRoute = createRootRoute({
  component: RootLayoutComponent,
  notFoundComponent: NotFoundPageComponent
});

/**
 * 类似 React Router 的 children：用「子路由数组」集中写表，不要用 .map() 生成，
 * 否则 TS 会丢失 path 字面量，整棵树的 Link / getRouteApi 强类型会失效。
 */
const routeTree = rootRoute.addChildren([
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: HomePageComponent
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/devices',
    component: ConnectedDevicesManageComponent
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/basic-operations',
    component: BasicOperationsComponent
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
