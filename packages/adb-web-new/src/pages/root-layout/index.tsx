import { getPairedDevices, requestAdbDaemonWebUsbDevice } from '@/adb/request.js';
import { Sidebar } from '@/components/sidebar/index.js';
import type { TranslationKey } from '@/i18n/translation-tree.js';
import { useTranslation } from '@/i18n/use-translation.js';
import { addDevice, devicesStore, removeDeviceBySerial, setCurrentDevice } from '@/store/devices-store.js';
import type { ThemeName } from '@/store/theme-store.js';
import { setTheme, themeNames, themeStore } from '@/store/theme-store.js';
import { unlockDebug } from '@/utils/debug-guard.js';
import { info } from '@/utils/observability.js';
import { verifyTOTP } from '@/utils/totp.js';
import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Input,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Spinner,
  Tooltip
} from '@fluentui/react-components';
import { CheckmarkRegular, NavigationRegular, WeatherMoonRegular, WeatherSunnyRegular } from '@fluentui/react-icons';
import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { useSelector } from '@tanstack/react-store';
import { Adb, AdbDaemonTransport } from '@yume-chan/adb';
import type { ReactElement } from 'react';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
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
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const currentDevice = useSelector(devicesStore, (state) => state.currentDevice);
  const devices = useSelector(devicesStore, (state) => state.devices);

  const [connecting, setConnecting] = useState(false);
  const [titleClickCount, setTitleClickCount] = useState(0);
  const [totpDialogOpen, setTotpDialogOpen] = useState(false);
  const [totpCode, setTotpCode] = useState('');
  const [totpError, setTotpError] = useState('');
  const navigate = useNavigate();

  const handleTitleClick = useCallback(() => {
    const next = titleClickCount + 1;
    setTitleClickCount(next);
    if (next >= 7) {
      info('ui.titleClick.unlock');
      setTitleClickCount(0);
      setTotpCode('');
      setTotpError('');
      setTotpDialogOpen(true);
    }
  }, [titleClickCount]);

  const handleTotpSubmit = useCallback(async () => {
    info('debug.totpSubmit');
    const ok = await verifyTOTP(__TOTP_SECRET__, totpCode);
    if (ok) {
      setTotpDialogOpen(false);
      unlockDebug();
      navigate({ to: '/debug' });
    } else {
      setTotpError('Invalid code');
    }
  }, [totpCode, navigate]);

  useEffect(() => {
    info('nav.routeChange', pathname);
  }, [pathname]);

  useEffect(() => {
    const onDisconnect = (event: USBConnectionEvent) => {
      const serial = event.device.serialNumber;
      if (serial) {
        info('device.usbDisconnected', serial);
        removeDeviceBySerial(serial);
      }
    };
    navigator.usb.addEventListener('disconnect', onDisconnect);
    return () => navigator.usb.removeEventListener('disconnect', onDisconnect);
  }, []);

  const handleConnect = useCallback(async () => {
    info('device.connect.start');
    const paired = await getPairedDevices();
    const knownSerials = new Set(devicesStore.state.devices.map((d) => d.serial));
    const newPaired = paired.filter((d) => !knownSerials.has(d.serial));
    let device = newPaired[0];

    if (!device) {
      const result = await requestAdbDaemonWebUsbDevice();
      if (result.success) {
        device = result.device;
      }
    }

    if (!device) {
      alert('connect error');
      return;
    }

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
  }, []);

  const toggleCollapsed = useCallback(() => {
    info('ui.sidebarToggle', !collapsed);
    setCollapsed((v) => !v);
  }, [collapsed]);

  const handleSelectDevice = useCallback((device: typeof currentDevice) => {
    info('device.selectDevice', device?.serial ?? 'null');
    setCurrentDevice(device);
  }, []);

  const currentLabel = useMemo(() => `(${t('connect.current')})`, [t]);

  const appTitle = t('app.title');
  const langLabel = language === 'zh' ? t('ui.switchToEn') : t('ui.switchToZh');
  const sidebarCollapseLabel = collapsed ? t('nav.expand') : t('nav.collapse');
  const themeTooltip = t('ui.themeLabel');

  return (
    <div className={styles['shell']}>
      <header className={styles['title-bar']}>
        <Tooltip content={sidebarCollapseLabel} relationship='label'>
          <Button
            appearance='subtle'
            icon={collapsed ? <NavigationRegular /> : <NavigationRegular />}
            onClick={toggleCollapsed}
          />
        </Tooltip>
        <div className={styles['title']}>
          <span onClick={handleTitleClick} style={{ cursor: 'default' }}>
            {appTitle}
          </span>
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
                    info('theme.setTheme', name);
                    setTheme(name);
                  }}
                >
                  {t(themeLabelKey[name])}
                </MenuItem>
              ))}
            </MenuList>
          </MenuPopover>
        </Menu>
        {import.meta.env.DEV && (
          <Button
            appearance='subtle'
            onClick={() => {
              info('nav.goToDebug');
              unlockDebug();
              navigate({ to: '/debug' });
            }}
          >
            {t('debug.title')}
          </Button>
        )}
        <Button
          appearance='subtle'
          onClick={() => {
            info('i18n.changeLanguage', language === 'zh' ? 'en' : 'zh');
            changeLanguage(language === 'zh' ? 'en' : 'zh');
          }}
        >
          {langLabel}
        </Button>
        <Button onClick={handleConnect}>{t('connect.buttonLabel')}</Button>
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
      <Dialog open={totpDialogOpen} onOpenChange={(_e, data) => setTotpDialogOpen(data.open)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{t('debug.totpTitle')}</DialogTitle>
            <DialogContent className={styles['connecting-content']}>
              <Input
                placeholder={t('debug.totpPlaceholder')}
                value={totpCode}
                onChange={(_e, data) => {
                  setTotpCode(data.value);
                  setTotpError('');
                }}
                maxLength={6}
              />
              {totpError && <span style={{ color: 'var(--colorPaletteRedForeground1)' }}>{totpError}</span>}
              <Button appearance='primary' onClick={handleTotpSubmit}>
                {t('debug.totpVerify')}
              </Button>
              <Button onClick={() => setTotpDialogOpen(false)}>{t('debug.totpCancel')}</Button>
            </DialogContent>
          </DialogBody>
        </DialogSurface>
      </Dialog>
      <div className={styles['body']}>
        <Sidebar collapsed={collapsed} />
        <main className={styles['main']}>
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export const RootLayoutComponent = RootLayout;
