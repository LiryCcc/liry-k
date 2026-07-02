import { Store } from '@tanstack/react-store';

type ConnType = { effectiveType: string; downlink: string; rtt: string };

const getConnection = (): ConnType => {
  const nav = navigator as unknown as Record<string, unknown>;
  const c = nav['connection'] as ConnType | undefined;
  return c
    ? { effectiveType: c.effectiveType, downlink: String(c.downlink), rtt: String(c.rtt) }
    : { effectiveType: 'unknown', downlink: 'unknown', rtt: 'unknown' };
};

const getStorageUsage = async (): Promise<{
  localStorageCount: number;
  localStorageSize: string;
  cacheNames: string[];
}> => {
  const lcKeys = { ...localStorage };
  const lcSize = new Blob([Object.values(lcKeys).join('')]).size;
  let cacheNames: string[] = [];
  try {
    cacheNames = await caches.keys();
  } catch {
    /**/
  }
  return {
    localStorageCount: Object.keys(lcKeys).length,
    localStorageSize: `${(lcSize / 1024).toFixed(1)} KB`,
    cacheNames
  };
};

export type DebugDataState = {
  environment: {
    userAgent: string;
    platform: string;
    language: string;
    url: string;
    hardwareConcurrency: number;
    cookieEnabled: boolean;
  };
  screen: {
    width: number;
    height: number;
    devicePixelRatio: number;
    colorDepth: number;
    orientation: string;
  };
  network: {
    online: boolean;
    connection: ConnType;
  };
  capabilities: {
    webUsb: boolean;
    webSerial: boolean;
    webBluetooth: boolean;
    webHid: boolean;
    webMidi: boolean;
    serviceWorker: boolean;
    webShare: boolean;
    webSocket: boolean;
  };
  storage: {
    localStorageCount: number;
    localStorageSize: string;
    cacheNames: string[];
  };
};

const initialEnv = (): DebugDataState['environment'] => ({
  userAgent: navigator.userAgent,
  platform: navigator.platform,
  language: navigator.language,
  url: location.href,
  hardwareConcurrency: navigator.hardwareConcurrency,
  cookieEnabled: navigator.cookieEnabled
});

const initialScreen = (): DebugDataState['screen'] => ({
  width: screen.width,
  height: screen.height,
  devicePixelRatio: devicePixelRatio,
  colorDepth: screen.colorDepth,
  orientation: screen.orientation?.type ?? 'unknown'
});

const initialNetwork = (): DebugDataState['network'] => ({
  online: navigator.onLine,
  connection: getConnection()
});

const initialCapabilities = (): DebugDataState['capabilities'] => ({
  webUsb: 'usb' in navigator,
  webSerial: 'serial' in navigator,
  webBluetooth: 'bluetooth' in navigator,
  webHid: 'hid' in navigator,
  webMidi: 'requestMIDIAccess' in navigator,
  serviceWorker: 'serviceWorker' in navigator,
  webShare: 'share' in navigator,
  webSocket: typeof WebSocket !== 'undefined'
});

export const debugDataStore = new Store<DebugDataState>({
  environment: initialEnv(),
  screen: initialScreen(),
  network: initialNetwork(),
  capabilities: initialCapabilities(),
  storage: {
    localStorageCount: 0,
    localStorageSize: '',
    cacheNames: []
  }
});

getStorageUsage().then((storage) => {
  debugDataStore.setState((state) => ({ ...state, storage }));
});
