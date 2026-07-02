import { AdbDaemonWebUsbDeviceManager } from '@yume-chan/adb-daemon-webusb';

export const initAdb = async () => {
  window.ADB_DAEMON_WEB_USB_DEVICE_MANAGER = AdbDaemonWebUsbDeviceManager.BROWSER;
};
