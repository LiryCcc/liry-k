import styles from '@/components/connect.module.css';
import { appendPacketLog, globalAppStore, setGlobalDevice, showGlobalError } from '@/store/global-app-store';
import { strings } from '@/strings';
import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Field,
  ProgressBar
} from '@fluentui/react-components';
import { PlugDisconnectedRegular, UsbPlugRegular } from '@fluentui/react-icons';
import { useStore } from '@tanstack/react-store';
import { Adb, AdbDaemonTransport, type AdbDaemonDevice, type AdbPacketInit } from '@yume-chan/adb';
import AdbWebCredentialStore from '@yume-chan/adb-credential-web';
import { AdbDaemonWebUsbDeviceManager, AdbDaemonWebUsbDeviceWatcher } from '@yume-chan/adb-daemon-webusb';
import { Consumable, InspectStream, pipeFrom } from '@yume-chan/stream-extra';
import { useCallback, useEffect, useState } from 'react';

const credentialStore = new AdbWebCredentialStore();

export const Connect = () => {
  const adb = useStore(globalAppStore, (s) => s.adb);
  const [selectedSerial, setSelectedSerial] = useState<string | undefined>();
  const [connecting, setConnecting] = useState(false);
  const [usbSupported, setUsbSupported] = useState(true);
  const [usbDeviceList, setUsbDeviceList] = useState<AdbDaemonDevice[]>([]);

  const updateUsbDeviceList = useCallback(async () => {
    if (!AdbDaemonWebUsbDeviceManager.BROWSER) {
      return [];
    }
    const devices = await AdbDaemonWebUsbDeviceManager.BROWSER.getDevices();
    setUsbDeviceList(devices);
    return devices;
  }, []);

  useEffect(() => {
    const supported = !!AdbDaemonWebUsbDeviceManager.BROWSER;
    setUsbSupported(supported);
    if (!supported) {
      showGlobalError(strings.connect.webUsbUnsupported);
      return;
    }
    void updateUsbDeviceList();
    const watcher = new AdbDaemonWebUsbDeviceWatcher(async (serial?: string) => {
      const list = await updateUsbDeviceList();
      if (serial) {
        setSelectedSerial(list.find((d) => d.serial === serial)?.serial);
      }
    }, globalThis.navigator.usb);
    return () => watcher.dispose();
  }, [updateUsbDeviceList]);

  useEffect(() => {
    setSelectedSerial((prev) => {
      if (prev) {
        const cur = usbDeviceList.find((d) => d.serial === prev);
        if (cur) {
          return cur.serial;
        }
      }
      return usbDeviceList[0]?.serial;
    });
  }, [usbDeviceList]);

  const selected = usbDeviceList.find((d) => d.serial === selectedSerial);

  const addUsbDevice = useCallback(async () => {
    if (!AdbDaemonWebUsbDeviceManager.BROWSER) {
      return;
    }
    const device = await AdbDaemonWebUsbDeviceManager.BROWSER.requestDevice();
    if (!device) {
      return;
    }
    setSelectedSerial(device.serial);
    await updateUsbDeviceList();
  }, [updateUsbDeviceList]);

  const connect = useCallback(async () => {
    if (!selected) {
      return;
    }
    setConnecting(true);

    try {
      const streams = await selected.connect();
      const readable = streams.readable.pipeThrough(
        new InspectStream((packet) => {
          appendPacketLog('in', packet);
        })
      );
      const writable = pipeFrom(
        streams.writable,
        new InspectStream((packet: Consumable<AdbPacketInit>) => {
          appendPacketLog('out', packet.value);
        })
      );

      const dispose = async () => {
        try {
          readable.cancel();
        } catch {
          /* ignore */
        }
        try {
          await writable.close();
        } catch {
          /* ignore */
        }
        setGlobalDevice(undefined, undefined);
      };

      try {
        const device = new Adb(
          await AdbDaemonTransport.authenticate({
            serial: selected.serial,
            connection: { readable, writable },
            credentialStore
          })
        );

        void (async () => {
          try {
            await device.disconnected;
            await dispose();
          } catch (e: unknown) {
            showGlobalError(e instanceof Error ? e : String(e));
            await dispose();
          }
        })();

        setGlobalDevice(selected, device);
      } catch (e) {
        showGlobalError(e instanceof Error ? e : String(e));
        await dispose();
      } finally {
        setConnecting(false);
      }
    } catch (e) {
      showGlobalError(e instanceof Error ? e : String(e));
      setConnecting(false);
    }
  }, [selected]);

  const disconnect = useCallback(async () => {
    const current = globalAppStore.state.adb;
    if (!current) {
      return;
    }
    try {
      await current.close();
    } catch (e) {
      showGlobalError(e instanceof Error ? e : String(e));
    }
  }, []);

  return (
    <div className={styles.connect}>
      <Field label={strings.connect.availableDevices}>
        <select
          disabled={!!adb || usbDeviceList.length === 0}
          value={selectedSerial ?? ''}
          onChange={(e) => {
            setSelectedSerial(e.target.value || undefined);
          }}
          style={{ width: '100%', minHeight: 32 }}
        >
          <option value=''>{strings.connect.noDevices}</option>
          {usbDeviceList.map((d) => (
            <option key={d.serial} value={d.serial}>
              {d.serial}
              {d.name ? ` (${d.name})` : ''}
            </option>
          ))}
        </select>
      </Field>

      {!adb ? (
        <div className={styles.row}>
          <Button
            appearance='primary'
            icon={<UsbPlugRegular />}
            disabled={!selected || !usbSupported}
            onClick={() => void connect()}
          >
            {strings.connect.connect}
          </Button>
          <Button icon={<UsbPlugRegular />} disabled={!usbSupported} onClick={() => void addUsbDevice()}>
            {strings.connect.addUsb}
          </Button>
        </div>
      ) : (
        <Button icon={<PlugDisconnectedRegular />} onClick={() => void disconnect()}>
          {strings.connect.disconnect}
        </Button>
      )}

      <Dialog open={connecting}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{strings.connect.connectingTitle}</DialogTitle>
            <DialogContent>
              <p>{strings.connect.connectingSub}</p>
              <ProgressBar />
            </DialogContent>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
};
