import { Store } from '@tanstack/react-store';

const log = (...args: unknown[]): void => {
  console.log('[debug-data]', ...args);
};

type ConnType = { effectiveType: string; downlink: string; rtt: string };

type GeoPosition = {
  latitude: number;
  longitude: number;
  accuracy: number;
};

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

const getBatteryInfo = async (): Promise<{
  level: string;
  charging: boolean;
  chargingTime: string;
  dischargingTime: string;
}> => {
  try {
    const nav = navigator as unknown as { getBattery?: () => Promise<Record<string, unknown>> };
    if (!nav.getBattery)
      return { level: 'unsupported', charging: false, chargingTime: 'unsupported', dischargingTime: 'unsupported' };
    const b = await nav.getBattery();
    return {
      level: `${((b['level'] as number) * 100).toFixed(0)}%`,
      charging: b['charging'] as boolean,
      chargingTime: (b['chargingTime'] as number) === Infinity ? 'N/A' : `${b['chargingTime']}s`,
      dischargingTime: (b['dischargingTime'] as number) === Infinity ? 'N/A' : `${b['dischargingTime']}s`
    };
  } catch (e) {
    return { level: `error: ${(e as Error).message}`, charging: false, chargingTime: '', dischargingTime: '' };
  }
};

const getMediaDevices = async (): Promise<{
  cameraCount: number;
  microphoneCount: number;
}> => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return {
      cameraCount: devices.filter((d) => d.kind === 'videoinput').length,
      microphoneCount: devices.filter((d) => d.kind === 'audioinput').length
    };
  } catch {
    return { cameraCount: 0, microphoneCount: 0 };
  }
};

const getGeolocationInfo = async (): Promise<{ permission: string; position: GeoPosition | null }> => {
  if (!('geolocation' in navigator)) return { permission: 'unsupported', position: null };
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        log('geolocation position:', pos);
        resolve({
          permission: 'granted',
          position: { latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: pos.coords.accuracy }
        });
      },
      (err) => {
        log('geolocation error:', err.message);
        if (err.code === err.PERMISSION_DENIED) resolve({ permission: 'denied', position: null });
        else resolve({ permission: `error (${err.message})`, position: null });
      },
      { timeout: 3000, maximumAge: 60000 }
    );
  });
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
  performance: {
    domContentLoaded: string;
    load: string;
    navigationType: string;
    resourceCount: number;
  };
  memory: {
    jsHeapSize: string;
    deviceMemory: string;
  };
  battery: {
    level: string;
    charging: boolean;
    chargingTime: string;
    dischargingTime: string;
  };
  geolocation: {
    permission: string;
    position: GeoPosition | null;
  };
  media: {
    cameraCount: number;
    microphoneCount: number;
  };
  window: {
    innerWidth: number;
    innerHeight: number;
    visibilityState: string;
  };
  time: {
    timezone: string;
    timestamp: string;
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

const initialPerformance = (): DebugDataState['performance'] => {
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  return {
    domContentLoaded: nav ? `${(nav.domContentLoadedEventEnd - nav.startTime).toFixed(0)} ms` : 'unknown',
    load: nav ? `${(nav.loadEventEnd - nav.startTime).toFixed(0)} ms` : 'unknown',
    navigationType: nav?.type ?? 'unknown',
    resourceCount: performance.getEntriesByType('resource').length
  };
};

const initialMemory = (): DebugDataState['memory'] => {
  const perf = performance as unknown as Record<string, unknown>;
  const mem = perf['memory'] as { usedJSHeapSize: number } | undefined;
  const nav = navigator as unknown as Record<string, unknown>;
  return {
    jsHeapSize: mem ? `${(mem.usedJSHeapSize / 1048576).toFixed(1)} MB` : 'N/A',
    deviceMemory: String(nav['deviceMemory'] ?? 'unknown')
  };
};

const initialWindow = (): DebugDataState['window'] => ({
  innerWidth: window.innerWidth,
  innerHeight: window.innerHeight,
  visibilityState: document.visibilityState
});

const initialTime = (): DebugDataState['time'] => ({
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  timestamp: new Date().toISOString()
});

const makeInitialState = (): DebugDataState => ({
  environment: initialEnv(),
  screen: initialScreen(),
  network: initialNetwork(),
  capabilities: initialCapabilities(),
  storage: { localStorageCount: 0, localStorageSize: '', cacheNames: [] },
  performance: initialPerformance(),
  memory: initialMemory(),
  battery: { level: '', charging: false, chargingTime: '', dischargingTime: '' },
  geolocation: { permission: 'checking...', position: null },
  media: { cameraCount: 0, microphoneCount: 0 },
  window: initialWindow(),
  time: initialTime()
});

export const debugDataStore = new Store<DebugDataState>(makeInitialState());

log('initial state created');

const refreshAsync = async (): Promise<void> => {
  log('refreshing async data...');
  const [storage, battery, media, geoPermission] = await Promise.all([
    getStorageUsage().then((r) => {
      log('storage:', r);
      return r;
    }),
    getBatteryInfo().then((r) => {
      log('battery:', r);
      return r;
    }),
    getMediaDevices().then((r) => {
      log('media:', r);
      return r;
    }),
    getGeolocationInfo().then((r) => {
      log('geolocation:', r);
      return r;
    })
  ]);
  debugDataStore.setState((state) => ({
    ...state,
    storage,
    battery,
    media,
    geolocation: geoPermission,
    network: initialNetwork(),
    window: initialWindow(),
    time: initialTime(),
    performance: initialPerformance(),
    memory: initialMemory()
  }));
  log('async data refreshed');
};

refreshAsync();

export const refreshDebugData = (): void => {
  debugDataStore.setState(() => makeInitialState());
  refreshAsync();
};
