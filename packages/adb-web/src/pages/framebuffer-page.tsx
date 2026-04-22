import { DemoModePanel } from '@/components/demo-mode-panel';
import { DeviceView } from '@/components/device-view';
import { PageShell } from '@/components/page-shell';
import styles from '@/pages/framebuffer-page.module.css';
import { globalAppStore, showGlobalError } from '@/store/global-app-store';
import { strings } from '@/strings';
import { Button, Tooltip } from '@fluentui/react-components';
import { CameraRegular, InfoRegular, SaveRegular, WandRegular } from '@fluentui/react-icons';
import { useStore } from '@tanstack/react-store';
import type { AdbFrameBuffer } from '@yume-chan/adb';
import { AdbFrameBufferV2 } from '@yume-chan/adb';
import { useCallback, useEffect, useRef, useState } from 'react';

export const FramebufferPage = () => {
  const adb = useStore(globalAppStore, (s) => s.adb);
  const device = useStore(globalAppStore, (s) => s.device);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [imageData, setImageData] = useState<ImageData | undefined>();
  const [demoVisible, setDemoVisible] = useState(false);

  useEffect(() => {
    document.title = strings.framebuffer.documentTitle;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageData) {
      return;
    }
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.putImageData(imageData, 0, 0);
  }, [width, height, imageData]);

  const setImage = useCallback((image: AdbFrameBuffer) => {
    setWidth(image.width);
    setHeight(image.height);
    setImageData(new ImageData(new Uint8ClampedArray(image.data), image.width, image.height));
  }, []);

  const capture = useCallback(async () => {
    if (!adb) {
      return;
    }
    try {
      const start = Date.now();
      const framebuffer = await adb.framebuffer();
      console.log(
        'Framebuffer speed',
        ((((AdbFrameBufferV2.size + framebuffer.size) / (Date.now() - start)) * 1000) / 1024 / 1024).toFixed(2),
        'MB/s'
      );
      setImage(framebuffer);
    } catch (e) {
      showGlobalError(e instanceof Error ? e : String(e));
    }
  }, [adb, setImage]);

  const savePng = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !device) {
      return;
    }
    const url = canvas.toDataURL();
    const a = document.createElement('a');
    a.href = url;
    a.download = `Screenshot ${device.name ?? device.serial}.png`;
    a.click();
  }, [device]);

  return (
    <PageShell className={styles.page}>
      <div className={styles.toolbar}>
        <Button icon={<CameraRegular />} disabled={!adb} onClick={() => void capture()}>
          {strings.framebuffer.capture}
        </Button>
        <Button icon={<SaveRegular />} disabled={!imageData} onClick={savePng}>
          {strings.framebuffer.save}
        </Button>
        <Button icon={<WandRegular />} aria-pressed={demoVisible} onClick={() => setDemoVisible((v) => !v)}>
          {strings.framebuffer.demoMode}
        </Button>
        <Tooltip content={strings.framebuffer.infoTooltip} relationship='label'>
          <InfoRegular style={{ fontSize: 20 }} />
        </Tooltip>
      </div>

      <div className={styles.body}>
        <DeviceView width={width} height={height}>
          <canvas ref={canvasRef} className={styles.canvas} />
        </DeviceView>

        <div className={demoVisible ? undefined : styles.demoHidden} style={{ width: 320, flexShrink: 0 }}>
          <DemoModePanel />
        </div>
      </div>
    </PageShell>
  );
};
