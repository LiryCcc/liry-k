import type { AdbDaemonWebUsbDeviceManager } from '@yume-chan/adb-daemon-webusb';

declare global {
  interface Window {
    ADB_DAEMON_WEB_USB_DEVICE_MANAGER: typeof AdbDaemonWebUsbDeviceManager.BROWSER;
  }
}
