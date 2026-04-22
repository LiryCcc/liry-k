import styles from '@/components/grid.module.css';
import { ResizeObserver, type Size } from '@/components/resize-observer';
import { useStableCallback } from '@/hooks/use-stable-callback';
import { mergeClasses } from '@fluentui/react-components';
import {
  type CSSProperties,
  type ComponentType,
  type HTMLAttributes,
  type ReactNode,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';

export type GridCellProps = {
  className?: string;
  style: CSSProperties;
  rowIndex: number;
  columnIndex: number;
};

export type GridCellWrapperProps = {
  CellComponent: ComponentType<GridCellProps>;
  rowIndex: number;
  rowHeight: number;
  columnIndex: number;
  columnWidth: number;
  columnOffset: number;
};

const GridCellWrapper = ({
  CellComponent,
  rowIndex,
  rowHeight,
  columnIndex,
  columnWidth,
  columnOffset
}: GridCellWrapperProps) => {
  const cellStyles = useMemo(
    () => ({
      width: columnWidth,
      height: rowHeight,
      transform: `translateX(${columnOffset}px)`
    }),
    [rowHeight, columnWidth, columnOffset]
  );

  return <CellComponent className={styles.cell} style={cellStyles} rowIndex={rowIndex} columnIndex={columnIndex} />;
};

export type GridRowProps = {
  className?: string;
  style: CSSProperties;
  rowIndex: number;
  children: ReactNode;
};

export type GridColumn = {
  title?: string;
  width: number;
  minWidth?: number;
  maxWidth?: number;
  flexGrow?: number;
  flexShrink?: number;
  CellComponent: ComponentType<GridCellProps>;
};

type GridRowWrapperProps = {
  RowComponent: ComponentType<GridRowProps>;
  rowIndex: number;
  rowHeight: number;
  columns: (GridColumn & { offset: number })[];
};

const GridRowWrapper = ({ RowComponent, rowIndex, rowHeight, columns }: GridRowWrapperProps) => {
  const rowStyles = useMemo(
    () => ({
      height: rowHeight,
      transform: `translateY(${rowIndex * rowHeight}px)`
    }),
    [rowIndex, rowHeight]
  );

  return (
    <RowComponent className={styles.row} style={rowStyles} rowIndex={rowIndex}>
      {columns.map((column, columnIndex) => (
        <GridCellWrapper
          key={columnIndex}
          rowIndex={rowIndex}
          rowHeight={rowHeight}
          columnIndex={columnIndex}
          columnWidth={column.width}
          columnOffset={column.offset}
          CellComponent={column.CellComponent}
        />
      ))}
    </RowComponent>
  );
};

export type GridHeaderProps = {
  className?: string;
  columnIndex: number;
  style: CSSProperties;
};

export type GridProps = HTMLAttributes<HTMLDivElement> & {
  rowCount: number;
  rowHeight: number;
  columns: GridColumn[];
  HeaderComponent: ComponentType<GridHeaderProps>;
  RowComponent: ComponentType<GridRowProps>;
};

export const Grid = ({
  className,
  rowCount,
  rowHeight,
  columns,
  HeaderComponent,
  RowComponent,
  ...props
}: GridProps) => {
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const bodyRef = useRef<HTMLDivElement | null>(null);
  const [bodySize, setBodySize] = useState<Size>({ width: 0, height: 0 });

  const [autoScroll, setAutoScroll] = useState(true);

  const handleScroll = useStableCallback(() => {
    const el = bodyRef.current;
    if (el && el.scrollTop !== scrollTop) {
      if (autoScroll) {
        if (scrollTop < el.scrollHeight - el.clientHeight && el.scrollTop < scrollTop) {
          setAutoScroll(false);
        }
      } else if (el.scrollTop + el.offsetHeight >= el.scrollHeight - 10) {
        setAutoScroll(true);
      }

      setScrollLeft(el.scrollLeft);
      setScrollTop(el.scrollTop);
    }
  });

  const rowRange = useMemo(() => {
    const start = Math.min(rowCount, Math.floor(scrollTop / rowHeight));
    const end = Math.min(rowCount, Math.ceil((scrollTop + bodySize.height) / rowHeight));
    return { start, end, offset: scrollTop - start * rowHeight };
  }, [scrollTop, bodySize.height, rowCount, rowHeight]);

  const columnMetadata = useMemo(() => {
    if (bodySize.width === 0) {
      return {
        columns: [] as (GridColumn & { offset: number })[],
        totalWidth: 0
      };
    }

    const result: (GridColumn & { offset: number })[] = columns.map((column) => {
      const copy: GridColumn & { offset: number } = { ...column, offset: 0 };
      if (copy.flexShrink !== 0) {
        if (copy.flexShrink === undefined) {
          copy.flexShrink = 1;
        }
        if (copy.minWidth === undefined) {
          copy.minWidth = 0;
        }
      }
      return copy;
    });

    const requestedWidth = result.reduce((sum, c) => sum + c.width, 0);

    const flex = {
      extraWidth: bodySize.width - requestedWidth,
      columnsCanGrow: result.filter((c) => c.flexGrow !== undefined),
      columnsCanShrink: result.filter((c) => c.flexShrink !== 0)
    };

    const totalFlexGrow = () => flex.columnsCanGrow.reduce((s, c) => s + (c.flexGrow ?? 0), 0);
    const totalFlexShrink = () => flex.columnsCanShrink.reduce((s, c) => s + (c.flexShrink ?? 0), 0);

    while (flex.extraWidth > 1 && flex.columnsCanGrow.length > 0) {
      const tg = totalFlexGrow();
      if (tg === 0) {
        break;
      }
      const growPerRatio = flex.extraWidth / tg;
      flex.columnsCanGrow = flex.columnsCanGrow.filter((column) => {
        const initialWidth = column.width;
        column.width += column.flexGrow! * growPerRatio;
        if (column.maxWidth !== undefined && column.width > column.maxWidth) {
          column.width = column.maxWidth;
        }
        flex.extraWidth -= column.width - initialWidth;
        return column.maxWidth === undefined || column.width < column.maxWidth;
      });
    }

    while (flex.extraWidth < -1 && flex.columnsCanShrink.length > 0) {
      const ts = totalFlexShrink();
      if (ts === 0) {
        break;
      }
      const shrinkPerRatio = -flex.extraWidth / ts;
      flex.columnsCanShrink = flex.columnsCanShrink.filter((column) => {
        const initialWidth = column.width;
        column.width -= column.flexShrink! * shrinkPerRatio;
        const clamped = column.width < column.minWidth!;
        if (clamped) {
          column.width = column.minWidth!;
        }
        flex.extraWidth += initialWidth - column.width;
        return !clamped;
      });
    }

    const totalWidth = result.reduce((offset, column) => {
      column.offset = offset;
      return offset + column.width;
    }, 0);

    return {
      columns: result,
      totalWidth
    };
  }, [columns, bodySize.width]);

  useLayoutEffect(() => {
    const el = bodyRef.current;
    if (autoScroll && el) {
      void el.offsetLeft;
      el.scrollTop = el.scrollHeight;
    }
  });

  const headers = useMemo(
    () =>
      columnMetadata.columns.map((column, index) => (
        <HeaderComponent
          key={index}
          columnIndex={index}
          className={styles.cell}
          style={{
            width: column.width,
            height: rowHeight,
            transform: `translateX(${column.offset}px)`
          }}
        />
      )),
    [columnMetadata, HeaderComponent, rowHeight]
  );

  const headerStyle = useMemo(
    () => ({
      height: rowHeight,
      transform: `translateX(-${scrollLeft}px)`
    }),
    [rowHeight, scrollLeft]
  );

  const placeholder = useMemo(
    () => (
      <div
        className={styles.placeholder}
        style={{
          width: columnMetadata.totalWidth,
          height: rowCount * rowHeight
        }}
      />
    ),
    [columnMetadata, rowCount, rowHeight]
  );

  return (
    <div className={mergeClasses(styles.container, className)} tabIndex={-1} {...props}>
      <div className={styles.header} style={headerStyle}>
        {headers}
      </div>
      <div ref={bodyRef} className={styles.body} onScroll={handleScroll}>
        <ResizeObserver onResize={setBodySize} />
        {placeholder}
        {Array.from({ length: rowRange.end - rowRange.start }, (_, rowIndex) => (
          <GridRowWrapper
            key={rowRange.start + rowIndex}
            RowComponent={RowComponent}
            rowIndex={rowRange.start + rowIndex}
            rowHeight={rowHeight}
            columns={columnMetadata.columns}
          />
        ))}
      </div>
    </div>
  );
};
