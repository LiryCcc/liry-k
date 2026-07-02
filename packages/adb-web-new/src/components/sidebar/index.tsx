import { useTranslation } from '@/i18n/use-translation.js';
import { Text } from '@fluentui/react-components';
import { DeviceEqRegular, HomeRegular } from '@fluentui/react-icons';
import { Link, useRouterState } from '@tanstack/react-router';
import styles from './index.module.css';

const linkClass = (currentPath: string, target: string) =>
  `${styles['navLink']} ${currentPath === target ? styles['navLinkActive'] : ''}`;

export const Sidebar = ({ collapsed }: { collapsed: boolean }) => {
  const { t } = useTranslation();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className={`${styles['sidebar']} ${collapsed ? styles['sidebarCollapsed'] : ''}`}>
      <nav className={styles['nav']}>
        <Link to='/' className={linkClass(pathname, '/')}>
          <HomeRegular />
          {collapsed ? null : <Text>{t('nav.home')}</Text>}
        </Link>
        <Link to='/devices' className={linkClass(pathname, '/devices')}>
          <DeviceEqRegular />
          {collapsed ? null : <Text>{t('nav.devices')}</Text>}
        </Link>
      </nav>
    </aside>
  );
};
