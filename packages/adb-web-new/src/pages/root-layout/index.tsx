import type { TranslationKey } from '@/i18n/translation-tree.js';
import { useTranslation } from '@/i18n/use-translation.js';
import type { ThemeName } from '@/store/theme-store.js';
import { setTheme, themeNames, themeStore } from '@/store/theme-store.js';
import { Button, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger, Text, Tooltip } from '@fluentui/react-components';
import { HomeRegular, NavigationRegular, WeatherMoonRegular, WeatherSunnyRegular } from '@fluentui/react-icons';
import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import { useSelector } from '@tanstack/react-store';
import type { ReactElement } from 'react';
import { useCallback, useState } from 'react';
import styles from './index.module.css';

const themeIconMap: Record<ThemeName, ReactElement> = {
  dark: <WeatherMoonRegular />,
  light: <WeatherSunnyRegular />,
  teamsDark: <WeatherMoonRegular />,
  teamsLight: <WeatherSunnyRegular />
};

const themeLabelKey: Record<ThemeName, TranslationKey> = {
  dark: 'ui.themeDark',
  light: 'ui.themeLight',
  teamsDark: 'ui.themeTeamsDark',
  teamsLight: 'ui.themeTeamsLight'
};

const RootLayout = () => {
  const { t, changeLanguage, language } = useTranslation();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useSelector(themeStore);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((v) => !v);
  }, []);

  const appTitle = t('app.title');
  const langLabel = language === 'zh' ? t('ui.switchToEn') : t('ui.switchToZh');
  const sidebarCollapseLabel = collapsed ? t('nav.expand') : t('nav.collapse');
  const themeTooltip = t('ui.themeLabel');

  return (
    <div className={styles['shell']}>
      <header className={styles['titleBar']}>
        <Tooltip content={sidebarCollapseLabel} relationship='label'>
          <Button
            appearance='subtle'
            icon={collapsed ? <NavigationRegular /> : <NavigationRegular />}
            onClick={toggleCollapsed}
          />
        </Tooltip>
        <div className={styles['title']}>{appTitle}</div>
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Tooltip content={themeTooltip} relationship='label'>
              <Button appearance='subtle' icon={themeIconMap[theme]} />
            </Tooltip>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              {themeNames.map((name) => (
                <MenuItem
                  key={name}
                  icon={themeIconMap[name]}
                  onClick={() => {
                    setTheme(name);
                  }}
                >
                  {t(themeLabelKey[name])}
                </MenuItem>
              ))}
            </MenuList>
          </MenuPopover>
        </Menu>
        <Button
          appearance='subtle'
          onClick={() => {
            changeLanguage(language === 'zh' ? 'en' : 'zh');
          }}
        >
          {langLabel}
        </Button>
      </header>
      <div className={styles['body']}>
        <aside className={`${styles['sidebar']} ${collapsed ? styles['sidebarCollapsed'] : ''}`}>
          <nav className={styles['nav']}>
            <Link to='/' className={`${styles['navLink']} ${pathname === '/' ? styles['navLinkActive'] : ''}`}>
              <HomeRegular />
              {collapsed ? null : <Text>{t('nav.home')}</Text>}
            </Link>
          </nav>
        </aside>
        <main className={styles['main']}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export const RootLayoutComponent = RootLayout;
