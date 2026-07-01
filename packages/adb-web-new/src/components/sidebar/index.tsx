import { useTranslation } from '@/i18n/use-translation.js';
import { Text } from '@fluentui/react-components';
import { HomeRegular } from '@fluentui/react-icons';
import { Link, useRouterState } from '@tanstack/react-router';
import styles from './index.module.css';

export const Sidebar = ({ collapsed }: { collapsed: boolean }) => {
  const { t } = useTranslation();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className={`${styles['sidebar']} ${collapsed ? styles['sidebarCollapsed'] : ''}`}>
      <nav className={styles['nav']}>
        <Link to='/' className={`${styles['navLink']} ${pathname === '/' ? styles['navLinkActive'] : ''}`}>
          <HomeRegular />
          {collapsed ? null : <Text>{t('nav.home')}</Text>}
        </Link>
      </nav>
    </aside>
  );
};
