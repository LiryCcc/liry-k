import type AdbWebCredentialStore from '@yume-chan/adb-credential-web';
import type { AdbDaemonWebUsbDeviceManager } from '@yume-chan/adb-daemon-webusb';
import type { i18n as I18nInstance, TFunction } from 'i18next';

declare global {
  interface Window {
    ADB_DAEMON_WEB_USB_DEVICE_MANAGER: typeof AdbDaemonWebUsbDeviceManager.BROWSER;
    ADB_WEB_CREDENTIAL_STORE: AdbWebCredentialStore;
    I18N: I18nInstance;
    I18N_READY: boolean;
    T_FUNCTION: TFunction;
  }
}
