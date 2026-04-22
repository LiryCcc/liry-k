import styles from '@/components/device-view.module.css';
import { ResizeObserver, type Size } from '@/components/resize-observer';
import {
  type CSSProperties,
  type ComponentType,
  type HTMLAttributes,
  type ReactNode,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react';

export type DeviceViewProps = HTMLAttributes<HTMLDivElement> & {
  width: number;
  height: number;
  BottomElement?: ComponentType<{
    className?: string;
    style: CSSProperties;
    children: ReactNode;
  }>;
  children?: ReactNode;
};

export type DeviceViewRef = {
  enterFullscreen: () => void;
};

export const DeviceView = forwardRef<DeviceViewRef, DeviceViewProps>(
  ({ width, height, BottomElement, children, ...props }, ref) => {
    const [containerSize, setContainerSize] = useState<Size>({ width: 0, height: 0 });
    const [bottomSize, setBottomSize] = useState<Size>({ width: 0, height: 0 });

    const usableSize = useMemo(
      () => ({
        width: containerSize.width,
        height: containerSize.height - bottomSize.height
      }),
      [containerSize, bottomSize]
    );

    const childrenStyle = useMemo(() => {
      if (width === 0 || usableSize.width === 0) {
        return { scale: 1, width: 0, height: 0, top: 0, left: 0 };
      }
      const videoRatio = width / height;
      const containerRatio = usableSize.width / usableSize.height;

      if (videoRatio > containerRatio) {
        const scale = usableSize.width / width;
        const childrenWidth = usableSize.width;
        const childrenHeight = height * scale;
        return {
          scale,
          width: childrenWidth,
          height: childrenHeight,
          top: (usableSize.height - childrenHeight) / 2,
          left: 0
        };
      }
      const scale = usableSize.height / height;
      const childrenWidth = width * scale;
      const childrenHeight = usableSize.height;
      return {
        scale,
        width: childrenWidth,
        height: childrenHeight,
        top: 0,
        left: (usableSize.width - childrenWidth) / 2
      };
    }, [width, height, usableSize]);

    const containerRef = useRef<HTMLDivElement | null>(null);
    useImperativeHandle(
      ref,
      () => ({
        enterFullscreen: () => {
          void containerRef.current?.requestFullscreen();
        }
      }),
      []
    );

    return (
      <div className={styles.grow}>
        <div ref={containerRef} className={styles.outer} {...props}>
          <ResizeObserver onResize={setContainerSize} />

          <div
            className={styles.inner}
            style={{
              top: childrenStyle.top,
              left: childrenStyle.left,
              width,
              height,
              transform: `scale(${childrenStyle.scale})`
            }}
          >
            {children}
          </div>

          {!!width && BottomElement ? (
            <BottomElement
              className={styles.bottom}
              style={{
                top: childrenStyle.top + childrenStyle.height,
                left: childrenStyle.left,
                width: childrenStyle.width
              }}
            >
              <ResizeObserver onResize={setBottomSize} />
            </BottomElement>
          ) : null}
        </div>
      </div>
    );
  }
);
