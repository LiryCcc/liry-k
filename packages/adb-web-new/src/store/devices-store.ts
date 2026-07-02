import { Store } from '@tanstack/react-store';
import type { AdbDaemonWebUsbDevice } from '@yume-chan/adb-daemon-webusb';

export type DevicesState = {
  devices: AdbDaemonWebUsbDevice[];
  currentDevice: AdbDaemonWebUsbDevice | null;
};

export const devicesStore = new Store<DevicesState>({
  devices: [],
  currentDevice: null
});

export const addDevice = (device: AdbDaemonWebUsbDevice) => {
  devicesStore.setState((prev) => ({
    ...prev,
    devices: [...new Set([...prev.devices, device])]
  }));
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
