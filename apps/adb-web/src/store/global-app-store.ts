import { Store } from '@tanstack/store';
import type { Adb, AdbDaemonDevice, AdbPacketData } from '@yume-chan/adb';

export type PacketLogDirection = 'in' | 'out';

export type PacketLogItem = AdbPacketData & {
  direction: PacketLogDirection;
  timestamp?: Date;
  commandString?: string;
  arg0String?: string;
  arg1String?: string;
  payloadString?: string;
};

export type GlobalAppState = {
  device: AdbDaemonDevice | undefined;
  adb: Adb | undefined;
  errorDialogVisible: boolean;
  errorDialogMessage: string;
  logs: PacketLogItem[];
};

const initialState: GlobalAppState = {
  device: undefined,
  adb: undefined,
  errorDialogVisible: false,
  errorDialogMessage: '',
  logs: []
};

export const globalAppStore = new Store<GlobalAppState>(initialState);

export const setGlobalDevice = (device: AdbDaemonDevice | undefined, adb: Adb | undefined): void => {
  globalAppStore.setState((s) => ({ ...s, device, adb }));
};

export const showGlobalError = (message: Error | string): void => {
  const errorDialogMessage = message instanceof Error ? (message.stack ?? message.message) : message;
  globalAppStore.setState((s) => ({ ...s, errorDialogVisible: true, errorDialogMessage }));
};

export const hideGlobalError = (): void => {
  globalAppStore.setState((s) => ({ ...s, errorDialogVisible: false }));
};

export const appendPacketLog = (direction: PacketLogDirection, packet: AdbPacketData): void => {
  globalAppStore.setState((s) => ({
    ...s,
    logs: [
      ...s.logs,
      {
        ...packet,
        direction,
        timestamp: new Date(),
        payload: packet.payload.slice()
      } as PacketLogItem
    ]
  }));
};

export const clearPacketLog = (): void => {
  globalAppStore.setState((s) => ({ ...s, logs: [] }));
};
