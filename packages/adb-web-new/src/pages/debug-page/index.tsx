import { useTranslation } from '@/i18n/use-translation.js';
import { debugDataStore } from '@/store/debug-data-store.js';
import { devicesStore } from '@/store/devices-store.js';
import { themeStore } from '@/store/theme-store.js';
import { getCurrentTOTPCode } from '@/utils/totp.js';
import { Text } from '@fluentui/react-components';
import { useSelector } from '@tanstack/react-store';
import { useEffect, useState } from 'react';
import styles from './index.module.css';

const KV = ({ label, value }: { label: string; value: string }) => (
  <div className={styles['row']}>
    <span className={styles['label']}>{label}</span>
    <span className={styles['value']}>{value}</span>
  </div>
);

const DebugPage = () => {
  const { t } = useTranslation();
  const dd = useSelector(debugDataStore, (state) => state);
  const deviceState = useSelector(devicesStore, (state) => state);
  const themeState = useSelector(themeStore, (state) => state);
  const [totpCode, setTotpCode] = useState('');

  useEffect(() => {
    const update = async () => {
      try {
        const code = await getCurrentTOTPCode(__TOTP_SECRET__);
        setTotpCode(code);
      } catch {
        /**/
      }
    };
    update();
    const id = setInterval(update, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles['page']}>
      <Text as='h1' size={700} weight='semibold'>
        {t('debug.title')}
      </Text>

      <div className={styles['section']}>
        <Text as='h2' size={500} weight='semibold'>
          {t('debug.environment')}
        </Text>
        <KV label='User Agent' value={dd.environment.userAgent} />
        <KV label='Platform' value={dd.environment.platform} />
        <KV label='Language' value={dd.environment.language} />
        <KV label='URL' value={dd.environment.url} />
        <KV label='CPU Cores' value={String(dd.environment.hardwareConcurrency)} />
        <KV label='Cookie Enabled' value={String(dd.environment.cookieEnabled)} />
      </div>

      <div className={styles['section']}>
        <Text as='h2' size={500} weight='semibold'>
          {t('debug.screen')}
        </Text>
        <KV label='Resolution' value={`${dd.screen.width} x ${dd.screen.height}`} />
        <KV label='Device Pixel Ratio' value={String(dd.screen.devicePixelRatio)} />
        <KV label='Color Depth' value={String(dd.screen.colorDepth)} />
        <KV label='Orientation' value={dd.screen.orientation} />
      </div>

      <div className={styles['section']}>
        <Text as='h2' size={500} weight='semibold'>
          {t('debug.network')}
        </Text>
        <KV label='Online' value={String(dd.network.online)} />
        <KV label='Effective Type' value={dd.network.connection.effectiveType} />
        <KV label='Downlink' value={`${dd.network.connection.downlink} Mbps`} />
        <KV label='RTT' value={`${dd.network.connection.rtt} ms`} />
      </div>

      <div className={styles['section']}>
        <Text as='h2' size={500} weight='semibold'>
          {t('debug.capabilities')}
        </Text>
        {Object.entries(dd.capabilities).map(([key, val]) => (
          <KV key={key} label={key} value={String(val)} />
        ))}
      </div>

      <div className={styles['section']}>
        <Text as='h2' size={500} weight='semibold'>
          {t('debug.storage')}
        </Text>
        <KV label='localStorage Keys' value={String(dd.storage.localStorageCount)} />
        <KV label='localStorage Size' value={dd.storage.localStorageSize} />
        <KV label='Cache Names' value={dd.storage.cacheNames.join(', ') || '(none)'} />
      </div>

      <div className={styles['section']}>
        <Text as='h2' size={500} weight='semibold'>
          {t('debug.totp')}
        </Text>
        <KV label='Secret' value={`${__TOTP_SECRET__.slice(0, 8)}...`} />
        <KV label='Current Code' value={totpCode} />
      </div>

      <div className={styles['section']}>
        <Text as='h2' size={500} weight='semibold'>
          {t('debug.theme')}
        </Text>
        <KV label='Theme' value={themeState.theme} />
      </div>

      <div className={styles['section']}>
        <Text as='h2' size={500} weight='semibold'>
          {t('debug.adb')}
        </Text>
        <KV label='Has ADB' value={String(!!deviceState.adb)} />
        <KV label='Current Device' value={deviceState.currentDevice?.serial ?? 'none'} />
        <KV label='Devices Count' value={String(deviceState.devices.length)} />
      </div>
    </div>
  );
};

export const DebugPageComponent = DebugPage;
export default DebugPageComponent;
