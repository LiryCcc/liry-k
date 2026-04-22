import { PageShell } from '@/components/page-shell';
import styles from '@/pages/power-page.module.css';
import { globalAppStore, showGlobalError } from '@/store/global-app-store';
import { strings } from '@/strings';
import { Button, MessageBar, MessageBarBody, Tooltip } from '@fluentui/react-components';
import { InfoRegular } from '@fluentui/react-icons';
import { useStore } from '@tanstack/react-store';
import { useEffect } from 'react';

export const PowerPage = () => {
  const adb = useStore(globalAppStore, (s) => s.adb);

  useEffect(() => {
    document.title = strings.power.documentTitle;
  }, []);

  const run = (fn: () => Promise<unknown>) => {
    if (!adb) {
      return;
    }
    void (async () => {
      try {
        await fn();
      } catch (e: unknown) {
        showGlobalError(e instanceof Error ? e : String(e));
      }
    })();
  };

  return (
    <PageShell>
      <div className={styles.row}>
        <Button disabled={!adb} onClick={() => run(async () => adb!.power.reboot())}>
          {strings.power.reboot}
        </Button>
      </div>
      <div className={styles.row}>
        <Button disabled={!adb} onClick={() => run(async () => adb!.power.powerOff())}>
          {strings.power.powerOff}
        </Button>
      </div>
      <div className={styles.row}>
        <Button disabled={!adb} onClick={() => run(async () => adb!.power.powerButton())}>
          {strings.power.powerButton}
        </Button>
      </div>

      <div className={styles.row}>
        <MessageBar intent='error'>
          <MessageBarBody>{strings.power.danger}</MessageBarBody>
        </MessageBar>
      </div>

      <div className={styles.row}>
        <Button disabled={!adb} onClick={() => run(async () => adb!.power.bootloader())}>
          {strings.power.bootloader}
        </Button>
      </div>
      <div className={styles.row}>
        <Button disabled={!adb} onClick={() => run(async () => adb!.power.fastboot())}>
          {strings.power.fastboot}
        </Button>
      </div>
      <div className={styles.row}>
        <Button disabled={!adb} onClick={() => run(async () => adb!.power.recovery())}>
          {strings.power.recovery}
        </Button>
      </div>
      <div className={styles.row}>
        <Button disabled={!adb} onClick={() => run(async () => adb!.power.sideload())}>
          {strings.power.sideload}
        </Button>
      </div>
      <div className={styles.row}>
        <Button disabled={!adb} onClick={() => run(async () => adb!.power.qualcommEdlMode())}>
          {strings.power.edl}
        </Button>
        <Tooltip content={strings.power.qualcommTooltip} relationship='label'>
          <InfoRegular className={styles.infoIcon} />
        </Tooltip>
      </div>
    </PageShell>
  );
};
