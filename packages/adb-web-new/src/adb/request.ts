import type { AdbDaemonWebUsbDevice } from '@yume-chan/adb-daemon-webusb';

export type RequestAdbDaemonWebUsbDeviceResult =
  | {
      success: true;
      device: AdbDaemonWebUsbDevice;
    }
  | { success: false };

export const requestAdbDaemonWebUsbDevice = async (): Promise<RequestAdbDaemonWebUsbDeviceResult> => {
  try {
    const device = await window.ADB_DAEMON_WEB_USB_DEVICE_MANAGER?.requestDevice();
    if (device) {
      return { device, success: true };
    }
  } catch {
    /** @todo catch error */
  }
  return { success: false };
};
