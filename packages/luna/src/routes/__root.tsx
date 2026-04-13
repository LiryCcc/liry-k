import { createRootRoute, Outlet } from '@tanstack/solid-router';

// 根路由只负责承载子路由渲染出口。
export const Route = createRootRoute({
  component: () => <Outlet />
});
