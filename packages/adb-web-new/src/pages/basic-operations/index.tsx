import { BRIGHTNESS_MAX, VOLUME_MAX } from '@/adb/constant.js';
import {
  getBrightness,
  getBrightnessMode,
  getVolume,
  setBrightness,
  setBrightnessMode,
  setVolume
} from '@/adb/operations.js';
import { useTranslation } from '@/i18n/use-translation.js';
import { devicesStore } from '@/store/devices-store.js';
import { info } from '@/utils/observability.js';
import { Slider, Switch, Text } from '@fluentui/react-components';
import { useSelector } from '@tanstack/react-store';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './index.module.css';

const BasicOperations = () => {
  const { t } = useTranslation();
  const currentDevice = useSelector(devicesStore, (state) => state.currentDevice);
  const adb = useSelector(devicesStore, (state) => state.adb);

  const [volume, setVolumeState] = useState(0);
  const [brightness, setBrightnessState] = useState(0);
  const [autoBrightness, setAutoBrightnessState] = useState(false);

  const dirtyRef = useRef({ volume: false, brightness: false });

  useEffect(() => {
    if (!adb) return;
    const poll = async () => {
      try {
        const [vol, bri, auto] = await Promise.all([getVolume(adb), getBrightness(adb), getBrightnessMode(adb)]);
        if (!dirtyRef.current.volume) setVolumeState(vol);
        if (!dirtyRef.current.brightness) setBrightnessState(bri);
        setAutoBrightnessState(auto);
      } catch {
        /** ignore */
      }
    };
    poll();
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  }, [adb]);

  const clearDirtyVolume = useCallback(() => {
    dirtyRef.current.volume = false;
  }, []);

  const clearDirtyBrightness = useCallback(() => {
    dirtyRef.current.brightness = false;
  }, []);

  const handleVolumeChange = useCallback(
    (_e: unknown, data: { value: number }) => {
      info('basicOps.volumeChange', data.value);
      setVolumeState(data.value);
      dirtyRef.current.volume = true;
      if (!adb) return;
      setVolume(adb, data.value).then(clearDirtyVolume).catch(clearDirtyVolume);
    },
    [adb, clearDirtyVolume]
  );

  const handleBrightnessChange = useCallback(
    (_e: unknown, data: { value: number }) => {
      info('basicOps.brightnessChange', data.value);
      setBrightnessState(data.value);
      dirtyRef.current.brightness = true;
      if (!adb) return;
      setBrightness(adb, data.value).then(clearDirtyBrightness).catch(clearDirtyBrightness);
    },
    [adb, clearDirtyBrightness]
  );

  const handleAutoBrightnessToggle = useCallback(
    (_e: unknown, data: { checked: boolean }) => {
      info('basicOps.autoBrightnessToggle', data.checked);
      setAutoBrightnessState(data.checked);
      if (!adb) return;
      if (data.checked) {
        setBrightnessMode(adb, true).catch(() => {});
      } else {
        getBrightness(adb)
          .then((bri) => {
            setBrightnessState(bri);
            setBrightnessMode(adb, false).catch(() => {});
          })
          .catch(() => {});
      }
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
          <div className={styles['slider-grow']}>
            <Slider
              aria-label={t('basicOperations.volume')}
              min={0}
              max={VOLUME_MAX}
              step={1}
              value={volume}
              disabled={!adb}
              onChange={handleVolumeChange}
            />
          </div>
          <Text className={styles['slider-value']}>{volume}</Text>
        </div>
      </div>

      <div className={styles['section']}>
        <div className={styles['section-header']}>
          <Text as='h2' size={500} weight='semibold' className={styles['section-title']}>
            {t('basicOperations.brightness')}
          </Text>
          <Switch
            label={t('basicOperations.autoBrightness')}
            checked={autoBrightness}
            onChange={handleAutoBrightnessToggle}
          />
        </div>
        <div className={styles['slider-row']}>
          <div className={styles['slider-grow']}>
            <Slider
              aria-label={t('basicOperations.brightness')}
              min={0}
              max={BRIGHTNESS_MAX}
              step={1}
              value={brightness}
              disabled={!adb || autoBrightness}
              onChange={handleBrightnessChange}
            />
          </div>
          <Text className={styles['slider-value']}>{brightness}</Text>
        </div>
      </div>
    </div>
  );
};

export const BasicOperationsComponent = BasicOperations;
export default BasicOperationsComponent;
