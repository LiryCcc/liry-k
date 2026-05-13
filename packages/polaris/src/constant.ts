import type { PolarisPlatform } from '@/typings/platform.js';
import { isTauri } from '@tauri-apps/api/core';
import { platform } from '@tauri-apps/plugin-os';

export const IS_TAURI = isTauri();
export const POLARIS_PLATFORM: PolarisPlatform = IS_TAURI ? platform() : 'web';

export const LAYOUT_CONSTANTS = {
  /** macOS Overlay 标题栏下用于放置自定义拖拽条的高度；其它平台为 0（沿用系统标题栏拖拽）。 */
  get DRAG_TITLE_HEIGHT() {
    if (!IS_TAURI) {
      return 0;
    }
    return POLARIS_PLATFORM === 'macos' ? 28 : 0;
  },
  /** macOS：为红绿灯区域预留宽度，避免拖拽层挡住系统按钮。 */
  MACOS_TRAFFIC_LIGHT_RESERVE: 78
} as const;
