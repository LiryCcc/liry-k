import { pushObservabilityEvent } from '@/store/observability-store.js';

const sessionTraceId = crypto.randomUUID().slice(0, 8);
let spanCounter = 0;

const now = (): number => performance.now();

export const info = (label: string, ...data: unknown[]): void => {
  const spanId = spanCounter++;
  const formatted = data.map((d) => (typeof d === 'object' ? JSON.stringify(d) : String(d))).join(' ');
  console.log(`[trace] [${sessionTraceId}:${spanId}] ${label}`, ...data);
  pushObservabilityEvent({
    label,
    level: 'info',
    data: formatted,
    timestamp: now()
  });
};

export const initObservability = async (): Promise<void> => {
  info('observability.init');
};
