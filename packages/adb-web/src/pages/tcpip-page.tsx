import { PageShell } from '@/components/page-shell';
import styles from '@/pages/tcpip-page.module.css';
import { globalAppStore, showGlobalError } from '@/store/global-app-store';
import { strings } from '@/strings';
import { Button, Field, Input, Link, MessageBar, MessageBarBody, Switch, Text } from '@fluentui/react-components';
import { ArrowClockwiseRegular, SaveRegular } from '@fluentui/react-icons';
import { useStore } from '@tanstack/react-store';
import type { Adb } from '@yume-chan/adb';
import { useCallback, useEffect, useState } from 'react';

type TcpipPropsSnapshot = {
  serviceListenAddresses: string[] | undefined;
  servicePortEnabled: boolean;
  servicePort: string;
  persistPortEnabled: boolean;
  persistPort: string | undefined;
};

const readTcpipProps = async (adb: Adb, signal: AbortSignal): Promise<TcpipPropsSnapshot | null> => {
  const serviceListenAddressesRaw = await adb.getProp('service.adb.listen_addrs');
  const servicePortRaw = await adb.getProp('service.adb.tcp.port');
  const persistPortRaw = await adb.getProp('persist.adb.tcp.port');

  if (signal.aborted) {
    return null;
  }

  const addrs = serviceListenAddressesRaw !== '' ? serviceListenAddressesRaw.split(',') : undefined;

  let nextServicePortEnabled = false;
  let nextServicePort = '5555';
  if (servicePortRaw) {
    nextServicePortEnabled = !addrs && servicePortRaw !== '0';
    nextServicePort = servicePortRaw;
  }

  let nextPersistPortEnabled = false;
  let nextPersistPort: string | undefined;
  if (persistPortRaw) {
    nextPersistPortEnabled = !addrs && !servicePortRaw;
    nextPersistPort = persistPortRaw;
  }

  return {
    serviceListenAddresses: addrs,
    servicePortEnabled: nextServicePortEnabled,
    servicePort: nextServicePort,
    persistPortEnabled: nextPersistPortEnabled,
    persistPort: nextPersistPort
  };
};

const TcpipPageInner = ({ adb }: { adb: Adb | undefined }) => {
  const [serviceListenAddresses, setServiceListenAddresses] = useState<string[] | undefined>(undefined);
  const [servicePortEnabled, setServicePortEnabled] = useState(false);
  const [servicePort, setServicePort] = useState('5555');
  const [persistPortEnabled, setPersistPortEnabled] = useState(false);
  const [persistPort, setPersistPort] = useState<string | undefined>(undefined);

  const applySnapshot = useCallback((snap: TcpipPropsSnapshot) => {
    setServiceListenAddresses(snap.serviceListenAddresses);
    setServicePortEnabled(snap.servicePortEnabled);
    setServicePort(snap.servicePort);
    setPersistPortEnabled(snap.persistPortEnabled);
    setPersistPort(snap.persistPort);
  }, []);

  useEffect(() => {
    if (!adb) {
      return;
    }
    const ac = new AbortController();
    void (async () => {
      const snap = await readTcpipProps(adb, ac.signal);
      if (!ac.signal.aborted && snap) {
        applySnapshot(snap);
      }
    })();
    return () => {
      ac.abort();
    };
  }, [adb, applySnapshot]);

  const handleRefresh = useCallback(() => {
    if (!adb) {
      return;
    }
    const ac = new AbortController();
    void (async () => {
      const snap = await readTcpipProps(adb, ac.signal);
      if (!ac.signal.aborted && snap) {
        applySnapshot(snap);
      }
    })();
  }, [adb, applySnapshot]);

  const handleApply = useCallback(async () => {
    if (!adb) {
      return;
    }
    try {
      if (servicePortEnabled) {
        await adb.tcpip.setPort(Number.parseInt(servicePort, 10));
      } else {
        await adb.tcpip.disable();
      }
    } catch (e: unknown) {
      showGlobalError(e instanceof Error ? e : String(e));
    }
  }, [adb, servicePort, servicePortEnabled]);

  const tcpPortBlocked = !!serviceListenAddresses;

  return (
    <PageShell>
      <div className={styles.toolbar}>
        <Button appearance='secondary' icon={<ArrowClockwiseRegular />} disabled={!adb} onClick={handleRefresh}>
          {strings.tcpip.refresh}
        </Button>
        <Button appearance='primary' icon={<SaveRegular />} disabled={!adb} onClick={() => void handleApply()}>
          {strings.tcpip.apply}
        </Button>
      </div>

      <MessageBar intent='info'>
        <MessageBarBody>
          <Text as='span'>{strings.tcpip.wifiHintPrefix}</Text>{' '}
          <Link href={strings.tcpip.wifiHintLink} target='_blank' rel='noreferrer'>
            {strings.tcpip.wifiHintLinkLabel}
          </Link>
          <Text as='span'>{strings.tcpip.wifiHintSuffix}</Text>
        </MessageBarBody>
      </MessageBar>

      <MessageBar intent='warning'>
        <MessageBarBody>{strings.tcpip.disconnectWarning}</MessageBarBody>
      </MessageBar>

      <div className={styles.section}>
        <Field label={strings.tcpip.listenAddrsProp}>
          <div className={styles.row}>
            <Switch checked={!!serviceListenAddresses} disabled />
          </div>
          {serviceListenAddresses?.map((address) => (
            <Input key={address} className={styles.inputNarrow} readOnly value={address} />
          ))}
        </Field>

        <Field label={strings.tcpip.tcpPortProp}>
          <div className={styles.row}>
            <Switch
              checked={servicePortEnabled}
              disabled={!adb || tcpPortBlocked}
              onChange={(_, d) => {
                setServicePortEnabled(d.checked);
              }}
            />
            <Input
              className={styles.inputNarrow}
              disabled={!adb || tcpPortBlocked}
              value={servicePort}
              onChange={(_, d) => {
                setServicePort(d.value);
              }}
            />
          </div>
        </Field>

        <Field label={strings.tcpip.persistPortProp}>
          <div className={styles.row}>
            <Switch checked={persistPortEnabled} disabled />
          </div>
          {persistPort ? <Input className={styles.inputNarrow} readOnly value={persistPort} /> : null}
        </Field>
      </div>
    </PageShell>
  );
};

export const TcpipPage = () => {
  const adb = useStore(globalAppStore, (s) => s.adb);

  useEffect(() => {
    document.title = strings.tcpip.documentTitle;
  }, []);

  return <TcpipPageInner key={adb?.serial ?? 'disconnected'} adb={adb} />;
};
