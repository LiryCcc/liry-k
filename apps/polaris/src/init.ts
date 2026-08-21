import { initSentry } from './utils/sentry.js';

export const init = async () => {
  await Promise.all([initSentry()]);
};
