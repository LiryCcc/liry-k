import { RootLayout } from '@/components/root-layout';
import { BugReportPage } from '@/pages/bug-report-page';
import { DeviceInfoPage } from '@/pages/device-info-page';
import { FileManagerPage } from '@/pages/file-manager-page';
import { FramebufferPage } from '@/pages/framebuffer-page';
import { HomePage } from '@/pages/home-page';
import { InstallPage } from '@/pages/install-page';
import { LogcatPage } from '@/pages/logcat-page';
import { PacketLogPage } from '@/pages/packet-log-page';
import { PowerPage } from '@/pages/power-page';
import { TcpipPage } from '@/pages/tcpip-page';
import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';

const rootRoute = createRootRoute({
  component: RootLayout
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage
});

const deviceInfoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/device-info',
  component: DeviceInfoPage
});

const fileManagerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/file-manager',
  component: FileManagerPage
});

const framebufferRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/framebuffer',
  component: FramebufferPage
});

const installRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/install',
  component: InstallPage
});

const tcpipRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tcpip',
  component: TcpipPage
});

const logcatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/logcat',
  component: LogcatPage
});

const powerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/power',
  component: PowerPage
});

const packetLogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/packet-log',
  component: PacketLogPage
});

const bugReportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bug-report',
  component: BugReportPage
});

export const routeTree = rootRoute.addChildren([
  indexRoute,
  deviceInfoRoute,
  fileManagerRoute,
  framebufferRoute,
  installRoute,
  tcpipRoute,
  logcatRoute,
  powerRoute,
  packetLogRoute,
  bugReportRoute
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
