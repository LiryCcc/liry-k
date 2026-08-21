import { useTranslation } from '@/i18n/use-translation.js';
import type { DeviceHistoryInfo } from '@/store/devices-store.js';
import { clearDeviceHistory, deviceHistoryStore, devicesStore } from '@/store/devices-store.js';
import { info } from '@/utils/observability.js';
import { Button, Text } from '@fluentui/react-components';
import { useSelector } from '@tanstack/react-store';
import { useCallback } from 'react';
import styles from './index.module.css';

const NA = '—';

type DeviceDisplay = {
  serial: string;
  name: string;
  manufacturer: string | null;
};

const DeviceCard = ({ device }: { device: DeviceDisplay }) => {
  const { t } = useTranslation();

  return (
    <div className={styles['card']}>
      <div className={styles['card-field']}>
        <span className={styles['card-label']}>{t('devices.serial')}</span>
        <span className={styles['card-value']}>{device.serial}</span>
      </div>
      <div className={styles['card-field']}>
        <span className={styles['card-label']}>{t('devices.manufacturer')}</span>
        <span className={styles['card-value']}>{device.manufacturer ?? NA}</span>
      </div>
      <div className={styles['card-field']}>
        <span className={styles['card-label']}>{t('devices.model')}</span>
        <span className={styles['card-value']}>{device.name}</span>
      </div>
      <div className={styles['card-field']}>
        <span className={styles['card-label']}>{t('devices.androidVersion')}</span>
        <span className={styles['card-value']}>{NA}</span>
      </div>
    </div>
  );
};

const HistoryDeviceCard = ({ entry }: { entry: DeviceHistoryInfo }) => {
  const { t } = useTranslation();

  return (
    <div className={styles['card']}>
      <div className={styles['card-field']}>
        <span className={styles['card-label']}>{t('devices.serial')}</span>
        <span className={styles['card-value']}>{entry.serial}</span>
      </div>
      <div className={styles['card-field']}>
        <span className={styles['card-label']}>{t('devices.manufacturer')}</span>
        <span className={styles['card-value']}>{entry.manufacturer ?? NA}</span>
      </div>
      <div className={styles['card-field']}>
        <span className={styles['card-label']}>{t('devices.model')}</span>
        <span className={styles['card-value']}>{entry.name}</span>
      </div>
      <div className={styles['card-field']}>
        <span className={styles['card-label']}>{t('devices.androidVersion')}</span>
        <span className={styles['card-value']}>{NA}</span>
      </div>
      <div className={styles['card-field']}>
        <span className={styles['card-label']}>{t('devices.lastConnected')}</span>
        <span className={styles['card-value']}>{new Date(entry.lastConnectedAt).toLocaleString()}</span>
      </div>
    </div>
  );
};

const ConnectedDevicesManage = () => {
  const { t } = useTranslation();
  const devices = useSelector(devicesStore, (state) => state.devices);
  const history = useSelector(deviceHistoryStore, (state) => state.items);

  const connectedSerials = new Set(devices.map((d) => d.serial));
  const filteredHistory = history.filter((entry) => !connectedSerials.has(entry.serial));

  const handleClearHistory = useCallback(() => {
    info('device.clearHistory');
    clearDeviceHistory();
  }, []);

  return (
    <div className={styles['page']}>
      <Text as='h1' size={700} weight='semibold'>
        {t('devices.title')}
      </Text>

      <div className={styles['section']}>
        <Text as='h2' size={500} weight='semibold' className={styles['section-title']}>
          {t('devices.connected')}
        </Text>
        {devices.length === 0 ? (
          <Text>{t('devices.noConnected')}</Text>
        ) : (
          <div className={styles['card-grid']}>
            {devices.map((device) => (
              <DeviceCard
                key={device.serial}
                device={{
                  serial: device.serial,
                  name: device.name ?? device.serial,
                  manufacturer: device.raw.manufacturerName
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className={styles['section']}>
        <div className={styles['section-header']}>
          <Text as='h2' size={500} weight='semibold' className={styles['section-title']}>
            {t('devices.history')}
          </Text>
          {filteredHistory.length > 0 && (
            <Button appearance='outline' size='small' onClick={handleClearHistory}>
              {t('devices.clearHistory')}
            </Button>
          )}
        </div>
        {filteredHistory.length === 0 ? (
          <Text>{t('devices.noHistory')}</Text>
        ) : (
          <div className={styles['card-grid']}>
            {filteredHistory.map((entry: DeviceHistoryInfo) => (
              <HistoryDeviceCard key={entry.serial} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const ConnectedDevicesManageComponent = ConnectedDevicesManage;
export default ConnectedDevicesManageComponent;
