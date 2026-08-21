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
    tracesSampleRate: 1.0,

    replaysSessionSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0
  });
};
