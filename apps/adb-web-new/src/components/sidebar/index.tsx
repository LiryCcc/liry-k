import { useTranslation } from '@/i18n/use-translation.js';
import { Text } from '@fluentui/react-components';
import { DeviceEqRegular, HomeRegular, SettingsRegular } from '@fluentui/react-icons';
import { Link, useRouterState } from '@tanstack/react-router';
import styles from './index.module.css';

const linkClass = (currentPath: string, target: string) =>
  `${styles['nav-link']} ${currentPath === target ? styles['nav-link-active'] : ''}`;

export const Sidebar = ({ collapsed }: { collapsed: boolean }) => {
  const { t } = useTranslation();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className={`${styles['sidebar']} ${collapsed ? styles['sidebar-collapsed'] : ''}`}>
      <nav className={styles['nav']}>
        <Link to='/' className={linkClass(pathname, '/')}>
          <HomeRegular />
          {collapsed ? null : <Text>{t('nav.home')}</Text>}
        </Link>
        <Link to='/devices' className={linkClass(pathname, '/devices')}>
          <DeviceEqRegular />
          {collapsed ? null : <Text>{t('nav.devices')}</Text>}
        </Link>
        <Link to='/basic-operations' className={linkClass(pathname, '/basic-operations')}>
          <SettingsRegular />
          {collapsed ? null : <Text>{t('nav.basicOperations')}</Text>}
        </Link>
      </nav>
    </aside>
  );
};
