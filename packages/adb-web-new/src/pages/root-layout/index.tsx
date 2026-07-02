import { requestAdbDaemonWebUsbDevice } from '@/adb/request.js';
import { Sidebar } from '@/components/sidebar/index.js';
import type { TranslationKey } from '@/i18n/translation-tree.js';
import { useTranslation } from '@/i18n/use-translation.js';
import { addDevice, devicesStore, setCurrentDevice } from '@/store/devices-store.js';
import type { ThemeName } from '@/store/theme-store.js';
import { setTheme, themeNames, themeStore } from '@/store/theme-store.js';
import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Spinner,
  Tooltip
} from '@fluentui/react-components';
import { CheckmarkRegular, NavigationRegular, WeatherMoonRegular, WeatherSunnyRegular } from '@fluentui/react-icons';
import { Outlet } from '@tanstack/react-router';
import { useSelector } from '@tanstack/react-store';
import { Adb, AdbDaemonTransport } from '@yume-chan/adb';
import type { ReactElement } from 'react';
import { useCallback, useMemo, useState } from 'react';
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
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useSelector(themeStore);
  const currentDevice = useSelector(devicesStore, (state) => state.currentDevice);
  const devices = useSelector(devicesStore, (state) => state.devices);

  const [connecting, setConnecting] = useState(false);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((v) => !v);
  }, []);

  const handleSelectDevice = useCallback((device: typeof currentDevice) => {
    setCurrentDevice(device);
  }, []);

  const currentLabel = useMemo(() => `(${t('connect.current')})`, [t]);

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
        <div className={styles['title']}>
          <span>{appTitle}</span>
          {currentDevice ? (
            <Menu>
              <MenuTrigger disableButtonEnhancement>
                <Button appearance='subtle' size='small' className={styles['device-badge']}>
                  {currentDevice.name ?? currentDevice.serial}
                </Button>
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  {devices.map((device) => {
                    const isCurrent = device.serial === currentDevice.serial;
                    return (
                      <MenuItem
                        key={device.serial}
                        icon={isCurrent ? <CheckmarkRegular /> : null}
                        onClick={() => {
                          handleSelectDevice(device);
                        }}
                      >
                        {isCurrent ? `${device.name ?? device.serial} ${currentLabel}` : (device.name ?? device.serial)}
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </MenuPopover>
            </Menu>
          ) : (
            <Button appearance='subtle' size='small' className={styles['device-badge']}>
              {t('connect.disconnected')}
            </Button>
          )}
        </div>
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
        <Button
          onClick={async () => {
            const connect = await requestAdbDaemonWebUsbDevice();
            if (connect.success === true) {
              const { device } = connect;
              addDevice(device);
              setCurrentDevice(device);
              setConnecting(true);
              try {
                const connection = await device.connect();
                const transport = await AdbDaemonTransport.authenticate({
                  serial: device.serial,
                  connection,
                  credentialStore: window.ADB_WEB_CREDENTIAL_STORE
                });
                const adb = new Adb(transport);
                setCurrentDevice(device, adb);
              } catch (e) {
                console.error(e);
              } finally {
                setConnecting(false);
              }
            } else {
              alert('connect error');
            }
          }}
        >
          {t('connect.buttonLabel')}
        </Button>
      </header>
      <Dialog open={connecting}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{t('connect.connectingTitle')}</DialogTitle>
            <DialogContent className={styles['connecting-content']}>
              <Spinner size='medium' />
              <span>{t('connect.connectingMessage')}</span>
            </DialogContent>
          </DialogBody>
        </DialogSurface>
      </Dialog>
      <div className={styles['body']}>
        <Sidebar collapsed={collapsed} />
        <main className={styles['main']}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export const RootLayoutComponent = RootLayout;
