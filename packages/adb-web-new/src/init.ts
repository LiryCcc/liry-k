import { setupI18n } from '@/i18n/setup-i18n.js';
import { initAdb } from './adb/init.js';
import { initObservability } from './utils/observability.js';

/**
 * 应用启动时集中执行的异步初始化（i18n、后续可扩展其它 bootstrap）。
 */
export const init = async (): Promise<void> => {
  await Promise.all([setupI18n(), initAdb(), initObservability()]);
};
