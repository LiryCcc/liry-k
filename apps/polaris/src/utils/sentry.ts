import { feedbackIntegration, init, replayIntegration } from '@sentry/solid';

export const initSentry = () => {
  init({
    sendDefaultPii: true,
    integrations: [
      // todo: add tanstack router tracing integration
      replayIntegration(),
      feedbackIntegration({
        colorScheme: 'system'
      })
    ],

    enableLogs: true,
    tracesSampleRate: 1,

    replaysSessionSampleRate: 1,
    replaysOnErrorSampleRate: 1
  });
};
