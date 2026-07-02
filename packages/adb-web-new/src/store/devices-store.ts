import { Store } from '@tanstack/react-store';
import type { Adb } from '@yume-chan/adb';
import type { AdbDaemonWebUsbDevice } from '@yume-chan/adb-daemon-webusb';

export type DevicesState = {
  devices: AdbDaemonWebUsbDevice[];
  currentDevice: AdbDaemonWebUsbDevice | null;
  adb: Adb | null;
};

export const devicesStore = new Store<DevicesState>({
  devices: [],
  currentDevice: null,
  adb: null
});

export const setCurrentDevice = (device: AdbDaemonWebUsbDevice | null, adb?: Adb | null) => {
  devicesStore.setState((prev) => ({
    ...prev,
    currentDevice: device,
    adb: adb !== undefined ? adb : prev.adb
  }));
};

export const addDevice = (device: AdbDaemonWebUsbDevice) => {
  devicesStore.setState((prev) => ({
    ...prev,
    devices: [...new Set([...prev.devices, device])]
  }));
  addDeviceHistory(device);
};

export const removeDevice = (device: AdbDaemonWebUsbDevice) => {
  devicesStore.setState((prev) => {
    const id = device.serial;
    return {
      ...prev,
      devices: prev.devices.filter((v) => v.serial !== id)
    };
  });
};

export type DeviceHistoryInfo = {
  serial: string;
  name: string;
  manufacturer: string | null;
  lastConnectedAt: number;
};

const DEVICE_HISTORY_KEY = 'adb-web:device-history';

const readHistoryFromStorage = (): DeviceHistoryInfo[] => {
  try {
    const raw = localStorage.getItem(DEVICE_HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as DeviceHistoryInfo[];
  } catch {
    return [];
  }
};

const writeHistoryToStorage = (history: DeviceHistoryInfo[]) => {
  localStorage.setItem(DEVICE_HISTORY_KEY, JSON.stringify(history));
};

export type DeviceHistoryState = {
  items: DeviceHistoryInfo[];
};

export const deviceHistoryStore = new Store<DeviceHistoryState>({
  items: readHistoryFromStorage()
});

export const getDeviceHistory = (): DeviceHistoryInfo[] => {
  return deviceHistoryStore.state.items;
};

const updateHistoryStore = () => {
  deviceHistoryStore.setState(() => ({
    items: readHistoryFromStorage()
  }));
};

export const addDeviceHistory = (device: AdbDaemonWebUsbDevice) => {
  const history = readHistoryFromStorage();
  const existing = history.findIndex((h) => h.serial === device.serial);
  const entry: DeviceHistoryInfo = {
    serial: device.serial,
    name: device.name ?? device.serial,
    manufacturer: device.raw.manufacturerName,
    lastConnectedAt: Date.now()
  };
  if (existing >= 0) {
    history[existing] = entry;
  } else {
    history.unshift(entry);
  }
  writeHistoryToStorage(history);
  updateHistoryStore();
};

export const clearDeviceHistory = () => {
  localStorage.removeItem(DEVICE_HISTORY_KEY);
  updateHistoryStore();
};
