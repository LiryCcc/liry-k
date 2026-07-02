import p from '@@/package.json' with { type: 'json' };
import AdbWebCredentialStore from '@yume-chan/adb-credential-web';
import { AdbDaemonWebUsbDeviceManager } from '@yume-chan/adb-daemon-webusb';

export const initAdb = async () => {
  window.ADB_DAEMON_WEB_USB_DEVICE_MANAGER = AdbDaemonWebUsbDeviceManager.BROWSER;
  window.ADB_WEB_CREDENTIAL_STORE = new AdbWebCredentialStore(p.name);
};
