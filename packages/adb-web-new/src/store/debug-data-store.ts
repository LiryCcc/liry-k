import { Store } from '@tanstack/react-store';

export type DebugDataState = {
  userAgent: string;
  platform: string;
  language: string;
  url: string;
};

export const debugDataStore = new Store<DebugDataState>({
  userAgent: navigator.userAgent,
  platform: navigator.platform,
  language: navigator.language,
  url: location.href
});
