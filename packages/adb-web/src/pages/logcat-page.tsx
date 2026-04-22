import { Grid, type GridCellProps, type GridColumn, type GridHeaderProps, type GridRowProps } from '@/components/grid';
import { PageShell } from '@/components/page-shell';
import { isModKey, useListSelection } from '@/hooks/use-list-selection';
import styles from '@/pages/logcat-page.module.css';
import { globalAppStore } from '@/store/global-app-store';
import { strings } from '@/strings';
import { saveFile } from '@/utils/file';
import { stripNullChars } from '@/utils/hex-text';
import { Button, mergeClasses, Text } from '@fluentui/react-components';
import { CopyRegular, DeleteRegular, SaveRegular, WandRegular } from '@fluentui/react-icons';
import { useStore } from '@tanstack/react-store';
import {
  AndroidLogPriority,
  Logcat,
  LogcatFormat,
  type AndroidLogEntry,
  type LogcatFormatModifiers
} from '@yume-chan/android-bin';
import { WritableStream } from '@yume-chan/stream-extra';
import type { KeyboardEvent, PointerEvent } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const LINE_HEIGHT = 32;

const IS_MAC = typeof globalThis !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(globalThis.navigator.platform);

type LogRow = AndroidLogEntry & { timeString?: string };

const formatOptions: { value: LogcatFormat; label: string }[] = [
  { value: LogcatFormat.Brief, label: 'Brief' },
  { value: LogcatFormat.Process, label: 'Process' },
  { value: LogcatFormat.Tag, label: 'Tag' },
  { value: LogcatFormat.Thread, label: 'Thread' },
  { value: LogcatFormat.Raw, label: 'Raw' },
  { value: LogcatFormat.Time, label: 'Time' },
  { value: LogcatFormat.ThreadTime, label: 'ThreadTime' },
  { value: LogcatFormat.Long, label: 'Long' }
];

const timeModeOptions = [
  { value: 'default', label: strings.logcat.timeDefault },
  { value: 'year', label: 'year' },
  { value: 'epoch', label: 'epoch' },
  { value: 'monotonic', label: 'monotonic' }
] as const;

const nanoOptions = [
  { value: 'millisecond', label: 'ms' },
  { value: 'microsecond', label: 'µs' },
  { value: 'nanosecond', label: 'ns' }
] as const;

export const LogcatPage = () => {
  const adb = useStore(globalAppStore, (s) => s.adb);
  const [list, setList] = useState<LogRow[]>([]);
  const [running, setRunning] = useState(false);
  const [format, setFormat] = useState(LogcatFormat.ThreadTime);
  const [modifierUid, setModifierUid] = useState(false);
  const [modifierTz, setModifierTz] = useState(false);
  const [timeMode, setTimeMode] = useState<'default' | 'year' | 'epoch' | 'monotonic'>('default');
  const [nanoMode, setNanoMode] = useState<'millisecond' | 'microsecond' | 'nanosecond'>('millisecond');

  const logcatRef = useRef<Logcat | undefined>(undefined);
  const bufferRef = useRef<LogRow[]>([]);
  const flushRequestedRef = useRef(false);
  const rafRef = useRef<number | undefined>(undefined);
  const stopRef = useRef<AbortController | undefined>(undefined);

  const selection = useListSelection();

  useEffect(() => {
    document.title = strings.logcat.documentTitle;
  }, []);

  useEffect(() => {
    if (!adb) {
      logcatRef.current = undefined;
      return;
    }
    logcatRef.current = new Logcat(adb);
  }, [adb]);

  useEffect(() => {
    if (!adb && running) {
      stopRef.current?.abort();
    }
  }, [adb, running]);

  useEffect(() => {
    if (list.length === 0) {
      selection.clear();
    }
  }, [list.length, selection]);

  const formatModifiers = useMemo((): LogcatFormatModifiers => {
    return {
      uid: modifierUid,
      timezone: modifierTz,
      year: timeMode === 'year',
      epoch: timeMode === 'epoch',
      monotonic: timeMode === 'monotonic',
      microseconds: nanoMode === 'microsecond',
      nanoseconds: nanoMode === 'nanosecond'
    };
  }, [modifierUid, modifierTz, timeMode, nanoMode]);

  const formatEntry = useCallback(
    (entry: LogRow) => {
      return entry.toString(format, formatModifiers);
    },
    [format, formatModifiers]
  );

  const flush = useCallback(() => {
    flushRequestedRef.current = false;
    setList((prev) => {
      const chunk = bufferRef.current;
      bufferRef.current = [];
      return prev.concat(chunk);
    });
  }, []);

  const start = useCallback(() => {
    const lc = logcatRef.current;
    if (!lc || running) {
      return;
    }
    setList([]);
    bufferRef.current = [];
    setRunning(true);
    const stream = lc.binary();
    const ac = new AbortController();
    stopRef.current = ac;
    void (async () => {
      try {
        await stream.pipeTo(
          new WritableStream<AndroidLogEntry>({
            write: (chunk) => {
              bufferRef.current.push(chunk as LogRow);
              if (!flushRequestedRef.current) {
                flushRequestedRef.current = true;
                rafRef.current = requestAnimationFrame(() => {
                  flush();
                });
              }
            }
          }),
          { signal: ac.signal }
        );
      } catch (e: unknown) {
        if (!ac.signal.aborted) {
          console.error(e);
        }
      } finally {
        setRunning(false);
      }
    })();
  }, [running, flush]);

  const stop = useCallback(() => {
    stopRef.current?.abort();
  }, []);

  const clear = useCallback(() => {
    setList([]);
    bufferRef.current = [];
    selection.clear();
  }, [selection]);

  const handleCopy = useCallback(() => {
    const text = [...selection]
      .map((index) => list[index])
      .filter((row): row is NonNullable<(typeof list)[number]> => row !== undefined)
      .map((row) => `${stripNullChars(formatEntry(row))}\n`)
      .join('');
    void navigator.clipboard.writeText(text);
  }, [list, selection, formatEntry]);

  const handleSave = useCallback(async () => {
    const stream = saveFile('logcat.txt');
    const writer = stream.getWriter();
    const enc = new TextEncoder();
    try {
      for (const index of selection) {
        const row = list[index];
        if (row) {
          await writer.write(enc.encode(`${stripNullChars(formatEntry(row))}\n`));
        }
      }
    } finally {
      await writer.close();
    }
  }, [list, selection, formatEntry]);

  const empty = list.length === 0;

  const columns: GridColumn[] = useMemo(
    () => [
      {
        width: 200,
        title: strings.logcat.colTime,
        CellComponent: ({ className, rowIndex, ...rest }: GridCellProps) => {
          const item = list[rowIndex];
          const ts = item ? new Date(item.seconds * 1000).toISOString() : '';
          return (
            <div className={mergeClasses(className, styles.code)} {...rest}>
              {ts}
            </div>
          );
        }
      },
      {
        width: 60,
        title: strings.logcat.colPid,
        CellComponent: ({ className, rowIndex, ...rest }: GridCellProps) => {
          const item = list[rowIndex];
          return (
            <div className={mergeClasses(className, styles.code)} {...rest}>
              {item?.pid ?? ''}
            </div>
          );
        }
      },
      {
        width: 60,
        title: strings.logcat.colTid,
        CellComponent: ({ className, rowIndex, ...rest }: GridCellProps) => {
          const item = list[rowIndex];
          return (
            <div className={mergeClasses(className, styles.code)} {...rest}>
              {item?.tid ?? ''}
            </div>
          );
        }
      },
      {
        width: 80,
        title: strings.logcat.colPri,
        CellComponent: ({ className, rowIndex, ...rest }: GridCellProps) => {
          const item = list[rowIndex];
          return (
            <div className={mergeClasses(className, styles.code)} {...rest}>
              {item ? AndroidLogPriority[item.priority] : ''}
            </div>
          );
        }
      },
      {
        width: 300,
        title: strings.logcat.colTag,
        CellComponent: ({ className, rowIndex, ...rest }: GridCellProps) => {
          const item = list[rowIndex];
          return (
            <div className={mergeClasses(className, styles.code)} {...rest}>
              {item?.tag ?? ''}
            </div>
          );
        }
      },
      {
        width: 300,
        flexGrow: 1,
        title: strings.logcat.colMessage,
        CellComponent: ({ className, rowIndex, ...rest }: GridCellProps) => {
          const item = list[rowIndex];
          return (
            <div className={mergeClasses(className, styles.code)} {...rest}>
              {item?.message ?? ''}
            </div>
          );
        }
      }
    ],
    [list]
  );

  const Header = useMemo(() => {
    const H = ({ className, columnIndex, ...rest }: GridHeaderProps) => {
      const col = columns[columnIndex];
      return (
        <div className={mergeClasses(className, styles.header)} {...rest}>
          {col?.title ?? ''}
        </div>
      );
    };
    return H;
  }, [columns]);

  const Row = useMemo(() => {
    const priorityClass: Record<AndroidLogPriority, string> = {
      [AndroidLogPriority.Default]: styles.rowVerbose ?? '',
      [AndroidLogPriority.Unknown]: styles.rowVerbose ?? '',
      [AndroidLogPriority.Silent]: styles.rowVerbose ?? '',
      [AndroidLogPriority.Verbose]: styles.rowVerbose ?? '',
      [AndroidLogPriority.Debug]: styles.rowDebug ?? '',
      [AndroidLogPriority.Info]: styles.rowInfo ?? '',
      [AndroidLogPriority.Warn]: styles.rowWarn ?? '',
      [AndroidLogPriority.Error]: styles.rowError ?? '',
      [AndroidLogPriority.Fatal]: styles.rowFatal ?? ''
    };
    const R = ({ className, rowIndex, ...rest }: GridRowProps) => {
      const item = list[rowIndex];
      const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
        if (e.shiftKey) {
          e.preventDefault();
        }
        selection.select(rowIndex, isModKey(e), e.shiftKey);
      };
      const pri = item?.priority ?? AndroidLogPriority.Info;
      return (
        <div
          className={mergeClasses(
            className,
            styles.row,
            selection.has(rowIndex) ? styles.selected : '',
            priorityClass[pri] ?? styles.rowInfo
          )}
          onPointerDown={handlePointerDown}
          {...rest}
        />
      );
    };
    return R;
  }, [list, selection]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if ((IS_MAC ? e.metaKey : e.ctrlKey) && e.code === 'KeyA') {
        e.preventDefault();
        e.stopPropagation();
        selection.clear();
        if (list.length > 0) {
          selection.select(list.length - 1, false, true);
        }
        return;
      }
      if (e.code === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        selection.clear();
      }
    },
    [list.length, selection]
  );

  return (
    <PageShell className={styles.page}>
      <div className={styles.toolbar}>
        {running ? (
          <Button onClick={stop}>{strings.logcat.stop}</Button>
        ) : (
          <Button disabled={!adb} onClick={start}>
            {strings.logcat.start}
          </Button>
        )}
        <Button icon={<DeleteRegular />} disabled={empty} onClick={clear}>
          {strings.logcat.clear}
        </Button>
        <Button
          icon={<WandRegular />}
          disabled={empty}
          onClick={() => {
            selection.clear();
            if (list.length > 0) {
              selection.select(list.length - 1, false, true);
            }
          }}
        >
          {strings.logcat.selectAll}
        </Button>
        <Button icon={<CopyRegular />} disabled={selection.size === 0} onClick={handleCopy}>
          {strings.logcat.copySelected}
        </Button>
        <Button icon={<SaveRegular />} disabled={selection.size === 0} onClick={() => void handleSave()}>
          {strings.logcat.saveSelected}
        </Button>

        <label>
          <Text>{strings.logcat.formatMenu}</Text>
          <select
            value={format}
            onChange={(e) => {
              setFormat(Number(e.target.value) as LogcatFormat);
            }}
          >
            {formatOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <input
            type='checkbox'
            checked={modifierUid}
            onChange={(e) => {
              setModifierUid(e.target.checked);
            }}
          />
          <Text>{strings.logcat.modifiersHeader} UID</Text>
        </label>
        <label>
          <input
            type='checkbox'
            checked={modifierTz}
            onChange={(e) => {
              setModifierTz(e.target.checked);
            }}
          />
          <Text>{strings.logcat.modifierTz}</Text>
        </label>

        <label>
          <Text>{strings.logcat.timeHeader}</Text>
          <select
            value={timeMode}
            onChange={(e) => {
              setTimeMode(e.target.value as typeof timeMode);
            }}
          >
            {timeModeOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <Text>{strings.logcat.nanoHeader}</Text>
          <select
            value={nanoMode}
            onChange={(e) => {
              setNanoMode(e.target.value as typeof nanoMode);
            }}
          >
            {nanoOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div onKeyDown={handleKeyDown} tabIndex={-1} role='presentation'>
        <Grid
          className={styles.grid}
          rowCount={list.length}
          rowHeight={LINE_HEIGHT}
          columns={columns}
          HeaderComponent={Header}
          RowComponent={Row}
        />
      </div>
    </PageShell>
  );
};
