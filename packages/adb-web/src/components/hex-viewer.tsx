import styles from '@/components/hex-viewer.module.css';
import { toText } from '@/utils/hex-text';
import { mergeClasses } from '@fluentui/react-components';
import { type ReactNode, useMemo } from 'react';

const PER_ROW = 16;

export type HexViewerProps = {
  className?: string;
  data: Uint8Array;
};

export const HexViewer = ({ className, data }: HexViewerProps) => {
  const children = useMemo(() => {
    const lineNumbers: ReactNode[] = [];
    const hexRows: ReactNode[] = [];
    const textRows: ReactNode[] = [];
    const rowStarts = Array.from({ length: Math.ceil(data.length / PER_ROW) }, (_, r) => r * PER_ROW);
    for (const i of rowStarts) {
      lineNumbers.push(<div key={i}>{i.toString(16)}</div>);
      const slice = data.subarray(i, i + PER_ROW);
      const hex = Array.from(slice, (b) => `${b.toString(16).padStart(2, '0')} `).join('');
      hexRows.push(<div key={i}>{hex}</div>);
      textRows.push(<div key={i}>{toText(slice)}</div>);
    }

    return { lineNumbers, hexRows, textRows };
  }, [data]);

  return (
    <div className={mergeClasses(styles.root, className)}>
      <div className={styles.flex}>
        <div className={mergeClasses(styles.cell, styles.lineNumber)}>{children.lineNumbers}</div>
        <div className={mergeClasses(styles.cell, styles.hex)}>{children.hexRows}</div>
        <div className={styles.cell}>{children.textRows}</div>
      </div>
    </div>
  );
};
