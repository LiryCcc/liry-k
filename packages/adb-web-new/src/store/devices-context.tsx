import type { AdbDaemonWebUsbDevice } from '@yume-chan/adb-daemon-webusb';
import { createContext, type ReactNode } from 'react';

const DevicesContext = createContext<AdbDaemonWebUsbDevice[]>([]);

export const DevicesProvider = ({ children }: { children: ReactNode }) => {
  return <DevicesContext value={[]}>{children}</DevicesContext>;
};
