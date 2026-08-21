import { setupI18n } from '@/i18n/setup-i18n.js';

/**
 * 应用启动时集中执行的异步初始化（i18n、后续可扩展其它 bootstrap）。
 */
export const init = async (): Promise<void> => {
  await setupI18n();
};
