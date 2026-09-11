import ThemeProvider from '@/theme/theme-provider.js';
import { Link, Outlet } from '@tanstack/react-router';

const BRAND_DESCRIPTION = 'React · Vite · Hono';
const BRAND_TITLE = 'SSR Lab';
const NAV_ABOUT = 'About';
const NAV_HOME = 'Counter';
const NAV_LABEL = 'Primary navigation';
const NAV_SETTINGS = 'Settings';

const RootLayout = () => (
  <ThemeProvider>
    <div className='app-layout'>
      <header className='site-header'>
        <div className='brand'>
          <Link className='brand-title' to='/'>
            {BRAND_TITLE}
          </Link>
          <span>{BRAND_DESCRIPTION}</span>
        </div>
        <nav aria-label={NAV_LABEL} className='primary-nav'>
          <Link activeProps={{ className: 'nav-link-active' }} className='nav-link' to='/'>
            {NAV_HOME}
          </Link>
          <Link activeProps={{ className: 'nav-link-active' }} className='nav-link' to='/about'>
            {NAV_ABOUT}
          </Link>
          <Link activeProps={{ className: 'nav-link-active' }} className='nav-link' to='/settings'>
            {NAV_SETTINGS}
          </Link>
        </nav>
      </header>
      <main className='page-content'>
        <Outlet />
      </main>
    </div>
  </ThemeProvider>
);

export default RootLayout;
