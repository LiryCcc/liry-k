import { Store } from '@tanstack/react-store';
import type { AdbDaemonWebUsbDevice } from '@yume-chan/adb-daemon-webusb';

export type DeviceState = {
  devices: AdbDaemonWebUsbDevice[];
};

export const deviceStore = new Store<DeviceState>({
  devices: []
});

export const addDevice = (device: AdbDaemonWebUsbDevice) => {
  deviceStore.setState((prev) => ({
    devices: [...new Set([...prev.devices, device])]
  }));
};

export const removeDevice = (device: AdbDaemonWebUsbDevice) => {
  deviceStore.setState((prev) => {
    const id = device.serial;
    return {
      devices: prev.devices.filter((v) => v.serial !== id)
    };
  });
};
