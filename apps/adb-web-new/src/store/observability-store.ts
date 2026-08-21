import { saveTrace } from '@/utils/db.js';
import { snowflakeId } from '@liry-k/stellar';
import { Store } from '@tanstack/react-store';

export type ObservabilityEvent = {
  id: string;
  label: string;
  level: 'info' | 'warn' | 'error';
  data: string;
  timestamp: number;
};

export type ObservabilityState = {
  events: ObservabilityEvent[];
};

export const observabilityStore = new Store<ObservabilityState>({
  events: []
});

export const pushObservabilityEvent = (event: Omit<ObservabilityEvent, 'id'>): void => {
  const full: ObservabilityEvent = { ...event, id: snowflakeId() };
  observabilityStore.setState((state) => ({
    events: [...state.events.slice(-499), full]
  }));
  saveTrace(full);
};
