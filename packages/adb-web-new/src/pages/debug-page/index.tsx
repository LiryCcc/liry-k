import { useTranslation } from '@/i18n/use-translation.js';
import { debugDataStore, refreshDebugData } from '@/store/debug-data-store.js';
import { devicesStore } from '@/store/devices-store.js';
import { themeStore } from '@/store/theme-store.js';
import { getCurrentTOTPCode } from '@/utils/totp.js';
import { Button, Text } from '@fluentui/react-components';
import { useSelector } from '@tanstack/react-store';
import { useEffect, useState } from 'react';
import styles from './index.module.css';

const KV = ({ label, value }: { label: string; value: string }) => (
  <div className={styles['row']}>
    <span className={styles['label']}>{label}</span>
    <span className={styles['value']}>{value}</span>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className={styles['section']}>
    <Text as='h2' size={500} weight='semibold'>
      {title}
    </Text>
    {children}
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
      <Button appearance='subtle' onClick={refreshDebugData}>
        {t('debug.refresh')}
      </Button>

      <Section title={t('debug.environment')}>
        <KV label='User Agent' value={dd.environment.userAgent} />
        <KV label='Platform' value={dd.environment.platform} />
        <KV label='Language' value={dd.environment.language} />
        <KV label='URL' value={dd.environment.url} />
        <KV label='CPU Cores' value={String(dd.environment.hardwareConcurrency)} />
        <KV label='Cookie Enabled' value={String(dd.environment.cookieEnabled)} />
      </Section>

      <Section title={t('debug.screen')}>
        <KV label='Resolution' value={`${dd.screen.width} x ${dd.screen.height}`} />
        <KV label='Device Pixel Ratio' value={String(dd.screen.devicePixelRatio)} />
        <KV label='Color Depth' value={String(dd.screen.colorDepth)} />
        <KV label='Orientation' value={dd.screen.orientation} />
      </Section>

      <Section title={t('debug.window')}>
        <KV label='Inner Width' value={String(dd.window.innerWidth)} />
        <KV label='Inner Height' value={String(dd.window.innerHeight)} />
        <KV label='Visibility' value={dd.window.visibilityState} />
      </Section>

      <Section title={t('debug.network')}>
        <KV label='Online' value={String(dd.network.online)} />
        <KV label='Effective Type' value={dd.network.connection.effectiveType} />
        <KV label='Downlink' value={`${dd.network.connection.downlink} Mbps`} />
        <KV label='RTT' value={`${dd.network.connection.rtt} ms`} />
      </Section>

      <Section title={t('debug.performance')}>
        <KV label='DOMContentLoaded' value={dd.performance.domContentLoaded} />
        <KV label='Load' value={dd.performance.load} />
        <KV label='Navigation Type' value={dd.performance.navigationType} />
        <KV label='Resource Count' value={String(dd.performance.resourceCount)} />
      </Section>

      <Section title={t('debug.memory')}>
        <KV label='JS Heap Size' value={dd.memory.jsHeapSize} />
        <KV label='Device Memory' value={dd.memory.deviceMemory} />
      </Section>

      <Section title={t('debug.battery')}>
        <KV label='Level' value={dd.battery.level} />
        <KV label='Charging' value={String(dd.battery.charging)} />
        <KV label='Charging Time' value={dd.battery.chargingTime} />
        <KV label='Discharging Time' value={dd.battery.dischargingTime} />
      </Section>

      <Section title={t('debug.geolocation')}>
        <KV label='Permission' value={dd.geolocation.permission} />
        {dd.geolocation.position && <KV label='Position' value={JSON.stringify(dd.geolocation.position)} />}
      </Section>

      <Section title={t('debug.media')}>
        <KV label='Cameras' value={String(dd.media.cameraCount)} />
        <KV label='Microphones' value={String(dd.media.microphoneCount)} />
      </Section>

      <Section title={t('debug.capabilities')}>
        {Object.entries(dd.capabilities).map(([key, val]) => (
          <KV key={key} label={key} value={String(val)} />
        ))}
      </Section>

      <Section title={t('debug.storage')}>
        <KV label='localStorage Keys' value={String(dd.storage.localStorageCount)} />
        <KV label='localStorage Size' value={dd.storage.localStorageSize} />
        <KV label='Cache Names' value={dd.storage.cacheNames.join(', ') || '(none)'} />
      </Section>

      <Section title={t('debug.time')}>
        <KV label='Timezone' value={dd.time.timezone} />
        <KV label='Timestamp' value={dd.time.timestamp} />
      </Section>

      <Section title={t('debug.totp')}>
        <KV label='Secret' value={`${__TOTP_SECRET__.slice(0, 8)}...`} />
        <KV label='Current Code' value={totpCode} />
      </Section>

      <Section title={t('debug.theme')}>
        <KV label='Theme' value={themeState.theme} />
      </Section>

      <Section title={t('debug.adb')}>
        <KV label='Has ADB' value={String(!!deviceState.adb)} />
        <KV label='Current Device' value={deviceState.currentDevice?.serial ?? 'none'} />
        <KV label='Devices Count' value={String(deviceState.devices.length)} />
      </Section>
    </div>
  );
};

export const DebugPageComponent = DebugPage;
export default DebugPageComponent;
