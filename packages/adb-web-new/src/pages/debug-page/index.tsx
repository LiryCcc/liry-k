import { useTranslation } from '@/i18n/use-translation.js';
import { debugDataStore, refreshDebugData } from '@/store/debug-data-store.js';
import { devicesStore } from '@/store/devices-store.js';
import { observabilityStore } from '@/store/observability-store.js';
import { themeStore } from '@/store/theme-store.js';
import { clearTraces } from '@/utils/db.js';
import { getCurrentTOTPCode } from '@/utils/totp.js';
import { Button, Text } from '@fluentui/react-components';
import { useSelector } from '@tanstack/react-store';
import { useCallback, useEffect, useState } from 'react';
import styles from './index.module.css';

const KV = ({ label, value }: { label: string; value: string }) => (
  <div className={styles['row']}>
    <span className={styles['label']}>{label}</span>
    <span className={styles['value']}>{value}</span>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className={styles['section']}>
    <Text as='h2' size={500} weight='semibold'>
      {title}
    </Text>
    {children}
  </div>
);

const DebugPage = () => {
  const { t } = useTranslation();
  const dd = useSelector(debugDataStore, (state) => state);
  const deviceState = useSelector(devicesStore, (state) => state);
  const themeState = useSelector(themeStore, (state) => state);
  const traceEvents = useSelector(observabilityStore, (state) => state.events);
  const [totpCode, setTotpCode] = useState('');
  const [notifTitle, setNotifTitle] = useState('Debug Test');
  const [notifBody, setNotifBody] = useState('Notification test from ADB Web debug page');
  const [notifStatus, setNotifStatus] = useState('');

  const handleTestNotification = useCallback(async () => {
    console.log('[notif] starting, notifTitle:', notifTitle, 'notifBody:', notifBody);
    console.log('[notif] secure context:', window.isSecureContext);
    console.log('[notif] user agent:', navigator.userAgent);
    if (!('Notification' in window)) {
      console.log('[notif] Notification API not available');
      setNotifStatus('unsupported');
      return;
    }
    console.log('[notif] current permission:', Notification.permission);
    if (Notification.permission === 'denied') {
      console.log('[notif] permission denied - check macOS System Settings > Notifications > Chrome');
      setNotifStatus('denied (check macOS System Settings > Notifications)');
      return;
    }
    if (Notification.permission === 'granted') {
      console.log('[notif] permission granted, sending notification');
      try {
        const n = new Notification(notifTitle, { body: notifBody, requireInteraction: true });
        console.log('[notif] notification object:', n);
        console.log('[notif] notification tag:', n.tag);
        console.log('[notif] notification silent:', n.silent);
        n.onshow = () => console.log('[notif] onshow fired');
        n.onclick = () => console.log('[notif] onclick fired');
        n.onclose = () => console.log('[notif] onclose fired');
        n.onerror = (e) => console.log('[notif] onerror:', e);
        console.log(
          '[notif] if not shown, check: 1) macOS System Settings > Notifications > Chrome 2) Do Not Disturb / Focus mode'
        );
        setNotifStatus('sent (check Notification Center if not visible)');
      } catch (e) {
        console.log('[notif] error creating notification:', e);
        setNotifStatus(`error: ${(e as Error).message}`);
      }
      return;
    }
    console.log('[notif] requesting permission...');
    try {
      const perm = await Notification.requestPermission();
      console.log('[notif] permission result:', perm);
      if (perm === 'granted') {
        try {
          const n = new Notification(notifTitle, { body: notifBody, requireInteraction: true });
          console.log('[notif] notification created:', n);
          n.onshow = () => console.log('[notif] onshow fired');
          n.onclick = () => console.log('[notif] onclick fired');
          n.onclose = () => console.log('[notif] onclose fired');
          n.onerror = (e) => console.log('[notif] onerror:', e);
          setNotifStatus('sent (check Notification Center if not visible)');
        } catch (e) {
          console.log('[notif] error creating notification:', e);
          setNotifStatus(`error: ${(e as Error).message}`);
        }
      } else {
        console.log('[notif] permission denied by user');
        setNotifStatus('denied');
      }
    } catch (e) {
      console.log('[notif] error requesting permission:', e);
      setNotifStatus(`request error: ${(e as Error).message}`);
    }
  }, [notifTitle, notifBody]);

  useEffect(() => {
    const update = async () => {
      try {
        const code = await getCurrentTOTPCode(__TOTP_SECRET__);
        setTotpCode(code);
      } catch {
        /**/
      }
    };
    update();
    const id = setInterval(update, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles['page']}>
      <Text as='h1' size={700} weight='semibold'>
        {t('debug.title')}
      </Text>
      <Button appearance='subtle' onClick={refreshDebugData}>
        {t('debug.refresh')}
      </Button>

      <Section title={t('debug.environment')}>
        <KV label='User Agent' value={dd.environment.userAgent} />
        <KV label='Platform' value={dd.environment.platform} />
        <KV label='Language' value={dd.environment.language} />
        <KV label='URL' value={dd.environment.url} />
        <KV label='CPU Cores' value={String(dd.environment.hardwareConcurrency)} />
        <KV label='Cookie Enabled' value={String(dd.environment.cookieEnabled)} />
      </Section>

      <Section title={t('debug.screen')}>
        <KV label='Resolution' value={`${dd.screen.width} x ${dd.screen.height}`} />
        <KV label='Device Pixel Ratio' value={String(dd.screen.devicePixelRatio)} />
        <KV label='Color Depth' value={String(dd.screen.colorDepth)} />
        <KV label='Orientation' value={dd.screen.orientation} />
      </Section>

      <Section title={t('debug.window')}>
        <KV label='Inner Width' value={String(dd.window.innerWidth)} />
        <KV label='Inner Height' value={String(dd.window.innerHeight)} />
        <KV label='Visibility' value={dd.window.visibilityState} />
      </Section>

      <Section title={t('debug.network')}>
        <KV label='Online' value={String(dd.network.online)} />
        <KV label='Effective Type' value={dd.network.connection.effectiveType} />
        <KV label='Downlink' value={`${dd.network.connection.downlink} Mbps`} />
        <KV label='RTT' value={`${dd.network.connection.rtt} ms`} />
      </Section>

      <Section title={t('debug.performance')}>
        <KV label='DOMContentLoaded' value={dd.performance.domContentLoaded} />
        <KV label='Load' value={dd.performance.load} />
        <KV label='Navigation Type' value={dd.performance.navigationType} />
        <KV label='Resource Count' value={String(dd.performance.resourceCount)} />
      </Section>

      <Section title={t('debug.memory')}>
        <KV label='JS Heap Size' value={dd.memory.jsHeapSize} />
        <KV label='Device Memory' value={dd.memory.deviceMemory} />
      </Section>

      <Section title={t('debug.battery')}>
        <KV label='Level' value={dd.battery.level} />
        <KV label='Charging' value={String(dd.battery.charging)} />
        <KV label='Charging Time' value={dd.battery.chargingTime} />
        <KV label='Discharging Time' value={dd.battery.dischargingTime} />
      </Section>

      <Section title={t('debug.geolocation')}>
        <KV label='Permission' value={dd.geolocation.permission} />
        {dd.geolocation.position && <KV label='Position' value={JSON.stringify(dd.geolocation.position)} />}
      </Section>

      <Section title={t('debug.media')}>
        <KV label='Cameras' value={String(dd.media.cameraCount)} />
        <KV label='Microphones' value={String(dd.media.microphoneCount)} />
      </Section>

      <Section title={t('debug.capabilities')}>
        {Object.entries(dd.capabilities).map(([key, val]) => (
          <KV key={key} label={key} value={String(val)} />
        ))}
        <div className={styles['row']} style={{ marginTop: '0.5rem', flexDirection: 'column', gap: '0.25rem' }}>
          <span className={styles['label']}>{t('debug.notification')}</span>
          <input
            value={notifTitle}
            onChange={(e) => setNotifTitle(e.currentTarget.value)}
            placeholder='Title'
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
          <input
            value={notifBody}
            onChange={(e) => setNotifBody(e.currentTarget.value)}
            placeholder='Body'
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
            <Button appearance='subtle' size='small' onClick={handleTestNotification}>
              {t('debug.testSend')}
            </Button>
            {notifStatus && <span className={styles['value']}>{notifStatus}</span>}
          </div>
        </div>
      </Section>

      <Section title={t('debug.storage')}>
        <KV label='localStorage Keys' value={String(dd.storage.localStorageCount)} />
        <KV label='localStorage Size' value={dd.storage.localStorageSize} />
        <KV label='Cache Names' value={dd.storage.cacheNames.join(', ') || '(none)'} />
      </Section>

      <Section title={t('debug.time')}>
        <KV label='Timezone' value={dd.time.timezone} />
        <KV label='Timestamp' value={dd.time.timestamp} />
      </Section>

      <Section title={t('debug.totp')}>
        <KV label='Secret' value={`${__TOTP_SECRET__.slice(0, 8)}...`} />
        <KV label='Current Code' value={totpCode} />
      </Section>

      <Section title={t('debug.theme')}>
        <KV label='Theme' value={themeState.theme} />
      </Section>

      <Section title={t('debug.traces')}>
        <Button
          appearance='subtle'
          size='small'
          onClick={() => {
            clearTraces();
            observabilityStore.setState(() => ({ events: [] }));
          }}
        >
          {t('debug.clear')}
        </Button>
        {traceEvents.length === 0 && <KV label={t('debug.noEvents')} value='' />}
        {[...traceEvents]
          .reverse()
          .slice(0, 50)
          .map((e) => (
            <KV
              key={e.id}
              label={`${new Date(e.timestamp).toLocaleTimeString()} [${e.level}] ${e.label}`}
              value={e.data}
            />
          ))}
      </Section>

      <Section title={t('debug.adb')}>
        <KV label='Has ADB' value={String(!!deviceState.adb)} />
        <KV label='Current Device' value={deviceState.currentDevice?.serial ?? 'none'} />
        <KV label='Devices Count' value={String(deviceState.devices.length)} />
      </Section>
    </div>
  );
};

export const DebugPageComponent = DebugPage;
export default DebugPageComponent;
