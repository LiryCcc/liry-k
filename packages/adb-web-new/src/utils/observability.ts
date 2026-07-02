import { pushObservabilityEvent } from '@/store/observability-store.js';

const now = (): number => performance.now();

export const info = (label: string, ...data: unknown[]): void => {
  pushObservabilityEvent({
    label,
    level: 'info',
    data: data.map((d) => (typeof d === 'object' ? JSON.stringify(d) : String(d))).join(' '),
    timestamp: now()
  });
};

export const initObservability = async (): Promise<void> => {
  try {
    await import('@opentelemetry/api');
    pushObservabilityEvent({
      label: 'OpenTelemetry loaded',
      level: 'info',
      data: 'API initialized',
      timestamp: now()
    });
  } catch (e) {
    pushObservabilityEvent({
      label: 'OpenTelemetry init error',
      level: 'error',
      data: String(e),
      timestamp: now()
    });
  }
};
