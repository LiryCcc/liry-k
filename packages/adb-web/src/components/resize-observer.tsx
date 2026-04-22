import styles from '@/components/resize-observer.module.css';
import { useStableCallback } from '@/hooks/use-stable-callback';
import { useEffect, useState } from 'react';

export type Size = {
  width: number;
  height: number;
};

export type ResizeObserverProps = {
  onResize: (size: Size) => void;
};

export const ResizeObserver = (props: ResizeObserverProps) => {
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);

  const handleResize = useStableCallback(() => {
    if (!iframe) {
      return;
    }
    const { width, height } = iframe.getBoundingClientRect();
    props.onResize({ width, height });
  });

  useEffect(() => {
    if (!iframe) {
      return;
    }
    void iframe.offsetLeft;
    iframe.contentWindow?.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      iframe.contentWindow?.removeEventListener('resize', handleResize);
    };
  }, [iframe, handleResize]);

  return <iframe ref={setIframe} className={styles.observer} title='' />;
};
