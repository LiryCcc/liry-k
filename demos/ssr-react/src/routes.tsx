import RootLayout from '@/layouts/root-layout/index.js';
import AboutPage from '@/pages/about-page/index.js';
import CounterPage from '@/pages/counter-page/index.js';
import NotFoundPage from '@/pages/not-found-page/index.js';
import SettingsPage from '@/pages/settings-page/index.js';
import { createMemoryHistory, createRootRoute, createRoute, createRouter } from '@tanstack/react-router';

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage
});

const routeTree = rootRoute.addChildren([
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: CounterPage
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/about',
    component: AboutPage
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/settings',
    component: SettingsPage
  })
]);

export const createAppRouter = (initialUrl?: string) =>
  createRouter({
    routeTree,
    defaultPreload: 'intent',
    ...(initialUrl === undefined
      ? {}
      : {
          history: createMemoryHistory({ initialEntries: [initialUrl] })
        })
  });

export type AppRouter = ReturnType<typeof createAppRouter>;

declare module '@tanstack/react-router' {
  interface Register {
    router: AppRouter;
  }
}
