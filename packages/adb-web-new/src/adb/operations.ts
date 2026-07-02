import type { Adb } from '@yume-chan/adb';
import { Settings } from '@yume-chan/android-bin';
import {
  BRIGHTNESS_MAX,
  BRIGHTNESS_MODE_AUTO,
  BRIGHTNESS_MODE_MANUAL,
  SETTING_SCREEN_BRIGHTNESS,
  SETTING_SCREEN_BRIGHTNESS_MODE,
  SETTING_VOLUME_MUSIC,
  SETTINGS_NAMESPACE_SYSTEM,
  VOLUME_MAX
} from './constant.js';

export const getVolume = async (adb: Adb): Promise<number> => {
  const settings = new Settings(adb);
  const value = await settings.get(SETTINGS_NAMESPACE_SYSTEM, SETTING_VOLUME_MUSIC);
  return Math.min(Number(value), VOLUME_MAX);
};

export const setVolume = async (adb: Adb, value: number): Promise<void> => {
  const clamped = Math.max(0, Math.min(value, VOLUME_MAX));
  const valueStr = String(clamped);
  const methods: Array<{ cmd: string; args: readonly string[] }> = [
    { cmd: 'cmd', args: ['media_session', 'volume', '--stream', '3', '--index', valueStr] as const },
    { cmd: 'media', args: ['volume', '--stream', '3', '--set', valueStr] as const },
    { cmd: 'settings', args: ['put', 'system', 'volume_music', valueStr] as const }
  ];
  for (const { cmd, args } of methods) {
    try {
      const result = await adb.subprocess.spawnAndWait([cmd, ...args]);
      if (!result.stderr) return;
    } catch {
      /** try next method */
    }
  }
};

export const getBrightness = async (adb: Adb): Promise<number> => {
  const settings = new Settings(adb);
  const value = await settings.get(SETTINGS_NAMESPACE_SYSTEM, SETTING_SCREEN_BRIGHTNESS);
  return Math.min(Number(value), BRIGHTNESS_MAX);
};

export const getBrightnessMode = async (adb: Adb): Promise<boolean> => {
  const settings = new Settings(adb);
  const value = await settings.get(SETTINGS_NAMESPACE_SYSTEM, SETTING_SCREEN_BRIGHTNESS_MODE);
  return value === BRIGHTNESS_MODE_AUTO;
};

export const setBrightnessMode = async (adb: Adb, auto: boolean): Promise<void> => {
  const settings = new Settings(adb);
  await settings.put(
    SETTINGS_NAMESPACE_SYSTEM,
    SETTING_SCREEN_BRIGHTNESS_MODE,
    auto ? BRIGHTNESS_MODE_AUTO : BRIGHTNESS_MODE_MANUAL
  );
};

export const setBrightness = async (adb: Adb, value: number): Promise<void> => {
  const clamped = Math.max(0, Math.min(value, BRIGHTNESS_MAX));
  const settings = new Settings(adb);
  await setBrightnessMode(adb, false);
  await settings.put(SETTINGS_NAMESPACE_SYSTEM, SETTING_SCREEN_BRIGHTNESS, String(clamped));
};
