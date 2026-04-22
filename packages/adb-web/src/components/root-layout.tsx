import { Connect } from '@/components/connect';
import styles from '@/components/root-layout.module.css';
import { strings } from '@/strings';
import { Button } from '@fluentui/react-components';
import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useCallback, useState } from 'react';

const nav = [
  { to: '/', label: strings.nav.home },
  { to: '/device-info', label: strings.nav.deviceInfo },
  { to: '/file-manager', label: strings.nav.fileManager },
  { to: '/framebuffer', label: strings.nav.framebuffer },
  { to: '/install', label: strings.nav.install },
  { to: '/tcpip', label: strings.nav.tcpip },
  { to: '/logcat', label: strings.nav.logcat },
  { to: '/power', label: strings.nav.power },
  { to: '/packet-log', label: strings.nav.packetLog },
  { to: '/bug-report', label: strings.nav.bugReport }
] as const;

export const RootLayout = () => {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof globalThis !== 'undefined' && globalThis.innerWidth > 650
  );

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((v) => !v);
  }, []);

  return (
    <>
      <div className={styles.shell}>
        <header className={styles.titleBar}>
          <Button appearance='subtle' aria-label={strings.toggleMenu} onClick={toggleSidebar}>
            {sidebarOpen ? '◀' : '☰'}
          </Button>
          <div className={styles.title}>{strings.appTitle}</div>
        </header>
        <div className={styles.body}>
          <aside className={`${styles.sidebar} ${sidebarOpen ? '' : styles.sidebarHidden}`}>
            <Connect />
            <nav className={styles.nav} aria-label={strings.nav.home}>
              {nav.map((item) => {
                const active =
                  item.to === '/' ? pathname === '/' : pathname === item.to || pathname.startsWith(`${item.to}/`);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
          <main className={styles.main}>
            <Outlet />
          </main>
        </div>
      </div>
      {import.meta.env.DEV ? <TanStackRouterDevtools position='bottom-right' /> : null}
    </>
  );
};
