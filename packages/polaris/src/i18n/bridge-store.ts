import { Store } from '@tanstack/store';

/**
 * 与 i18next 解耦的桥接状态：语言切换时递增 revision，驱动 Solid 侧按新文案重绘。
 */
export const i18nBridgeStore = new Store({
  language: '',
  revision: 0
});
