import { Grid, type GridCellProps, type GridColumn, type GridHeaderProps, type GridRowProps } from '@/components/grid';
import { HexViewer } from '@/components/hex-viewer';
import { PageShell } from '@/components/page-shell';
import { isModKey, useListSelection } from '@/hooks/use-list-selection';
import styles from '@/pages/packet-log-page.module.css';
import { clearPacketLog, globalAppStore } from '@/store/global-app-store';
import { strings } from '@/strings';
import { toText } from '@/utils/hex-text';
import { Button, mergeClasses } from '@fluentui/react-components';
import { CopyRegular, DeleteRegular, WandRegular } from '@fluentui/react-icons';
import { useStore } from '@tanstack/react-store';
import { AdbCommand, decodeUtf8 } from '@yume-chan/adb';
import type { PointerEvent } from 'react';
import { useCallback, useEffect, useMemo } from 'react';

const LINE_HEIGHT = 32;

const adbCommandName: Record<number, string> = {
  [AdbCommand.Auth]: 'AUTH',
  [AdbCommand.Close]: 'CLSE',
  [AdbCommand.Connect]: 'CNXN',
  [AdbCommand.OK]: 'OKAY',
  [AdbCommand.Open]: 'OPEN',
  [AdbCommand.Write]: 'WRTE'
};

const uint8ArrayToHex = (array: Uint8Array) => {
  return Array.from(array)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join(' ');
};

const commandLabel = (cmd: number) => {
  return adbCommandName[cmd] ?? decodeUtf8(new Uint32Array([cmd]));
};

export const PacketLogPage = () => {
  const logs = useStore(globalAppStore, (s) => s.logs);
  const selection = useListSelection();

  useEffect(() => {
    document.title = strings.packetLog.documentTitle;
  }, []);

  useEffect(() => {
    if (logs.length === 0) {
      selection.clear();
    }
  }, [logs.length, selection]);

  const handleCopy = useCallback(() => {
    const text = [...selection]
      .map((index) => logs[index])
      .filter((entry): entry is NonNullable<(typeof logs)[number]> & { timestamp: Date } => {
        return entry !== undefined && entry.timestamp !== undefined;
      })
      .map((entry) => {
        const cmd = commandLabel(entry.command);
        return `${entry.timestamp.toISOString()}\t${entry.direction === 'in' ? 'IN' : 'OUT'}\t${cmd}\t${entry.arg0.toString(16).padStart(8, '0')}\t${entry.arg1.toString(16).padStart(8, '0')}\t${uint8ArrayToHex(entry.payload)}\n`;
      })
      .join('');
    void navigator.clipboard.writeText(text);
  }, [logs, selection]);

  const columns: GridColumn[] = useMemo(
    () => [
      {
        title: strings.packetLog.colDirection,
        width: 100,
        CellComponent: ({ className, rowIndex, ...rest }: GridCellProps) => {
          const item = logs[rowIndex];
          return (
            <div className={mergeClasses(className, styles.code)} {...rest}>
              {item?.direction ?? ''}
            </div>
          );
        }
      },
      {
        title: strings.packetLog.colCommand,
        width: 100,
        CellComponent: ({ className, rowIndex, ...rest }: GridCellProps) => {
          const item = logs[rowIndex];
          const label = item ? commandLabel(item.command) : '';
          return (
            <div className={mergeClasses(className, styles.code)} {...rest}>
              {label}
            </div>
          );
        }
      },
      {
        title: strings.packetLog.colArg0,
        width: 100,
        CellComponent: ({ className, rowIndex, ...rest }: GridCellProps) => {
          const item = logs[rowIndex];
          const v = item ? item.arg0.toString(16).padStart(8, '0') : '';
          return (
            <div className={mergeClasses(className, styles.code)} {...rest}>
              {v}
            </div>
          );
        }
      },
      {
        title: strings.packetLog.colArg1,
        width: 100,
        CellComponent: ({ className, rowIndex, ...rest }: GridCellProps) => {
          const item = logs[rowIndex];
          const v = item ? item.arg1.toString(16).padStart(8, '0') : '';
          return (
            <div className={mergeClasses(className, styles.code)} {...rest}>
              {v}
            </div>
          );
        }
      },
      {
        title: strings.packetLog.colPayload,
        width: 200,
        flexGrow: 1,
        CellComponent: ({ className, rowIndex, ...rest }: GridCellProps) => {
          const item = logs[rowIndex];
          const v = item ? toText(item.payload.subarray(0, 100)) : '';
          return (
            <div className={mergeClasses(className, styles.code)} {...rest}>
              {v}
            </div>
          );
        }
      }
    ],
    [logs]
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
    const R = ({ className, rowIndex, ...rest }: GridRowProps) => {
      const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
        if (e.shiftKey) {
          e.preventDefault();
        }
        selection.select(rowIndex, isModKey(e), e.shiftKey);
      };
      return (
        <div
          className={mergeClasses(className, styles.row, selection.has(rowIndex) ? styles.selected : '')}
          onPointerDown={handlePointerDown}
          {...rest}
        />
      );
    };
    return R;
  }, [selection]);

  const empty = logs.length === 0;

  const selIdx = selection.selectedIndex;
  const hexPayload =
    selIdx !== null && logs[selIdx] !== undefined && logs[selIdx]!.payload.length > 0 ? logs[selIdx]!.payload : null;

  return (
    <PageShell className={styles.page}>
      <div className={styles.toolbar}>
        <Button
          icon={<DeleteRegular />}
          disabled={empty}
          onClick={() => {
            clearPacketLog();
          }}
        >
          {strings.packetLog.clear}
        </Button>
        <Button
          icon={<WandRegular />}
          disabled={empty}
          onClick={() => {
            selection.clear();
            if (logs.length > 0) {
              selection.select(logs.length - 1, false, true);
            }
          }}
        >
          {strings.packetLog.selectAll}
        </Button>
        <Button icon={<CopyRegular />} disabled={selection.size === 0} onClick={handleCopy}>
          {strings.packetLog.copy}
        </Button>
      </div>

      <Grid
        className={styles.grid}
        rowCount={logs.length}
        rowHeight={LINE_HEIGHT}
        columns={columns}
        HeaderComponent={Header}
        RowComponent={Row}
      />

      {hexPayload ? <HexViewer className={mergeClasses(styles.grow, styles.hex)} data={hexPayload} /> : null}
    </PageShell>
  );
};
