import { useTranslation } from '@/i18n/use-translation.js';
import { devicesStore } from '@/store/devices-store.js';
import { Slider, Text } from '@fluentui/react-components';
import { useSelector } from '@tanstack/react-store';
import { Settings } from '@yume-chan/android-bin';
import { useCallback, useEffect, useState } from 'react';
import styles from './index.module.css';

const BRIGHTNESS_MAX = 255;
const VOLUME_MAX = 15;

const BasicOperations = () => {
  const { t } = useTranslation();
  const currentDevice = useSelector(devicesStore, (state) => state.currentDevice);
  const adb = useSelector(devicesStore, (state) => state.adb);

  const [volume, setVolume] = useState(0);
  const [brightness, setBrightness] = useState(0);

  useEffect(() => {
    if (!adb) return;
    const settings = new Settings(adb);
    const load = async () => {
      try {
        const [volStr, briStr] = await Promise.all([
          settings.get('system', 'volume_music'),
          settings.get('system', 'screen_brightness')
        ]);
        setVolume(Number(volStr));
        setBrightness(Number(briStr));
      } catch {
        /** ignore */
      }
    };
    load();
  }, [adb]);

  const handleVolumeChange = useCallback(
    (_e: unknown, data: { value: number }) => {
      setVolume(data.value);
      if (!adb) return;
      const settings = new Settings(adb);
      settings.put('system', 'volume_music', String(data.value)).catch(() => {});
    },
    [adb]
  );

  const handleBrightnessChange = useCallback(
    (_e: unknown, data: { value: number }) => {
      setBrightness(data.value);
      if (!adb) return;
      const settings = new Settings(adb);
      settings.put('system', 'screen_brightness', String(data.value)).catch(() => {});
    },
    [adb]
  );

  if (!currentDevice) {
    return (
      <div className={styles['page']}>
        <Text>{t('basicOperations.noDevice')}</Text>
      </div>
    );
  }

  return (
    <div className={styles['page']}>
      <Text as='h1' size={700} weight='semibold'>
        {t('basicOperations.title')}
      </Text>

      <div className={styles['section']}>
        <Text as='h2' size={500} weight='semibold' className={styles['section-title']}>
          {t('basicOperations.volume')}
        </Text>
        <div className={styles['slider-row']}>
          <Slider
            aria-label={t('basicOperations.volume')}
            min={0}
            max={VOLUME_MAX}
            step={1}
            value={volume}
            disabled={!adb}
            onChange={handleVolumeChange}
          />
          <Text className={styles['slider-value']}>{volume}</Text>
        </div>
      </div>

      <div className={styles['section']}>
        <Text as='h2' size={500} weight='semibold' className={styles['section-title']}>
          {t('basicOperations.brightness')}
        </Text>
        <div className={styles['slider-row']}>
          <Slider
            aria-label={t('basicOperations.brightness')}
            min={0}
            max={BRIGHTNESS_MAX}
            step={1}
            value={brightness}
            disabled={!adb}
            onChange={handleBrightnessChange}
          />
          <Text className={styles['slider-value']}>{brightness}</Text>
        </div>
      </div>
    </div>
  );
};

export const BasicOperationsComponent = BasicOperations;
