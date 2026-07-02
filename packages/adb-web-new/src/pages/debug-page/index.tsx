import { useTranslation } from '@/i18n/use-translation.js';
import { devicesStore } from '@/store/devices-store.js';
import { themeStore } from '@/store/theme-store.js';
import { Text } from '@fluentui/react-components';
import { useSelector } from '@tanstack/react-store';
import styles from './index.module.css';

const KV = ({ label, value }: { label: string; value: string }) => (
  <div className={styles['row']}>
    <span className={styles['label']}>{label}</span>
    <span className={styles['value']}>{value}</span>
  </div>
);

const DebugPage = () => {
  const { t } = useTranslation();
  const deviceState = useSelector(devicesStore, (state) => state);
  const themeState = useSelector(themeStore, (state) => state);

  return (
    <div className={styles['page']}>
      <Text as='h1' size={700} weight='semibold'>
        {t('debug.title')}
      </Text>

      <div className={styles['section']}>
        <Text as='h2' size={500} weight='semibold'>
          {t('debug.environment')}
        </Text>
        <KV label='User Agent' value={navigator.userAgent} />
        <KV label='Platform' value={navigator.platform} />
        <KV label='Language' value={navigator.language} />
        <KV label='URL' value={location.href} />
      </div>

      <div className={styles['section']}>
        <Text as='h2' size={500} weight='semibold'>
          {t('debug.envVars')}
        </Text>
        {Object.entries(import.meta.env).map(([key, value]) => (
          <KV key={key} label={key} value={String(value)} />
        ))}
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
