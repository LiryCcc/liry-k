import { PageShell } from '@/components/page-shell';
import styles from '@/pages/bug-report-page.module.css';
import { globalAppStore, showGlobalError } from '@/store/global-app-store';
import { strings } from '@/strings';
import { saveFile } from '@/utils/file';
import { Button, MessageBar, MessageBarBody, Text } from '@fluentui/react-components';
import { useStore } from '@tanstack/react-store';
import type { Adb } from '@yume-chan/adb';
import { BugReport } from '@yume-chan/android-bin';
import { useCallback, useEffect, useState } from 'react';

const BugReportPageInner = ({ adb }: { adb: Adb }) => {
  const [tool, setTool] = useState<BugReport | undefined>();
  const [zipInProgress, setZipInProgress] = useState(false);
  const [zipProgress, setZipProgress] = useState<string | undefined>();
  const [zipTotal, setZipTotal] = useState<string | undefined>();

  useEffect(() => {
    const ac = new AbortController();
    void (async () => {
      try {
        const b = await BugReport.queryCapabilities(adb);
        if (!ac.signal.aborted) {
          setTool(b);
        }
      } catch (e: unknown) {
        if (!ac.signal.aborted) {
          showGlobalError(e instanceof Error ? e : String(e));
        }
      }
    })();
    return () => {
      ac.abort();
    };
  }, [adb]);

  const run = useCallback((fn: () => Promise<void>) => {
    void (async () => {
      try {
        await fn();
      } catch (e: unknown) {
        showGlobalError(e instanceof Error ? e : String(e));
      }
    })();
  }, []);

  const generateText = useCallback(() => {
    if (!tool) {
      return;
    }
    run(async () => {
      await tool.bugReport().pipeTo(saveFile('bugReport.txt'));
    });
  }, [run, tool]);

  const generateZipStream = useCallback(() => {
    if (!tool) {
      return;
    }
    run(async () => {
      await tool.bugReportZStream().pipeTo(saveFile('bugReport.zip'));
    });
  }, [run, tool]);

  const generateZip = useCallback(() => {
    if (!tool) {
      return;
    }
    run(async () => {
      setZipInProgress(true);
      setZipProgress(undefined);
      setZipTotal(undefined);
      try {
        const filename = await tool.bugReportZ({
          onProgress: tool.supportsBugReportZProgress
            ? (progress, total) => {
                setZipProgress(progress);
                setZipTotal(total);
              }
            : undefined
        });

        const sync = await adb.sync();
        try {
          await sync.read(filename).pipeTo(saveFile('bugReport.zip'));
        } finally {
          sync.dispose();
        }
      } finally {
        setZipInProgress(false);
        setZipProgress(undefined);
        setZipTotal(undefined);
      }
    });
  }, [adb, run, tool]);

  return (
    <PageShell>
      <div className={styles.row}>
        <MessageBar intent='info'>
          <MessageBarBody>{strings.bugReport.intro}</MessageBarBody>
        </MessageBar>
      </div>

      <div className={styles.row}>
        <Button disabled={!tool} onClick={generateText}>
          {strings.bugReport.generateText}
        </Button>
      </div>

      <div className={styles.row}>
        <Button disabled={!tool?.supportsBugReportZStream} onClick={generateZipStream}>
          {strings.bugReport.generateZipStream}
        </Button>
      </div>

      <div className={`${styles.row} ${styles.rowInline}`}>
        <Button disabled={!tool?.supportsBugReportZ || zipInProgress} onClick={generateZip}>
          {strings.bugReport.generateZip}
        </Button>
        {zipInProgress ? (
          zipTotal ? (
            <Text>
              {strings.bugReport.progress}：{zipProgress} / {zipTotal}
            </Text>
          ) : (
            <Text>
              {strings.bugReport.generating}
              {!tool?.supportsBugReportZProgress ? ` ${strings.bugReport.noProgressHint}` : ''}
            </Text>
          )
        ) : null}
      </div>
    </PageShell>
  );
};

export const BugReportPage = () => {
  const adb = useStore(globalAppStore, (s) => s.adb);
  const serial = useStore(globalAppStore, (s) => s.device?.serial ?? '');

  useEffect(() => {
    document.title = strings.bugReport.documentTitle;
  }, []);

  if (!adb) {
    return (
      <PageShell>
        <MessageBar intent='warning'>
          <MessageBarBody>{strings.bugReport.noDevice}</MessageBarBody>
        </MessageBar>
      </PageShell>
    );
  }

  return <BugReportPageInner key={serial} adb={adb} />;
};
