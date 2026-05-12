import type { PolarisPlatform } from '@/typings/platform.js';
import { isTauri } from '@tauri-apps/api/core';
import { platform } from '@tauri-apps/plugin-os';

export const IS_TAURI = isTauri();
export const POLARIS_PLATFORM: PolarisPlatform = IS_TAURI ? platform() : 'web';
