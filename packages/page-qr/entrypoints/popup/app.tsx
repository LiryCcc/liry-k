import { createMemo, createResource, Match, Switch } from 'solid-js';
import { encode } from 'uqr';
import { z } from 'zod/v4';

import styles from './app.module.css';

const tabUrlSchema = z.url();

const QR_DISPLAY_SIZE = 200;

const getActiveTabUrl = async (): Promise<string> => {
  const tabs = await browser['tabs'].query({
    active: true,
    currentWindow: true
  });
  return tabUrlSchema.parse(tabs[0]?.['url']);
};

/**
 * Encode text as a QR matrix and rasterize it to a PNG data URL.
 */
const renderQrPngDataUrl = (text: string): string => {
  const { data, size } = encode(text, { border: 2 });
  const scale = Math.max(1, Math.floor(QR_DISPLAY_SIZE / size));
  const canvas = document.createElement('canvas');
  canvas.width = size * scale;
  canvas.height = size * scale;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas 2D context unavailable');
  }

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#000000';

  for (let y = 0; y < size; y += 1) {
    const row = data[y];
    if (!row) {
      continue;
    }
    for (let x = 0; x < size; x += 1) {
      if (row[x]) {
        context.fillRect(x * scale, y * scale, scale, scale);
      }
    }
  }

  return canvas.toDataURL('image/png');
};

const copyText = async (text: string): Promise<void> => {
  await navigator.clipboard.writeText(text);
};

const copyPngDataUrl = async (dataUrl: string): Promise<void> => {
  const blob = await (await fetch(dataUrl)).blob();
  await navigator.clipboard.write([
    new ClipboardItem({
      'image/png': blob
    })
  ]);
};

const App = () => {
  const [url] = createResource(getActiveTabUrl);
  const pngDataUrl = createMemo(() => {
    const currentUrl = url();
    return currentUrl === undefined ? undefined : renderQrPngDataUrl(currentUrl);
  });

  const copyLink = () => {
    const currentUrl = url();
    if (currentUrl === undefined) {
      return;
    }
    copyText(currentUrl);
  };

  const copyImage = () => {
    const dataUrl = pngDataUrl();
    if (dataUrl === undefined) {
      return;
    }
    copyPngDataUrl(dataUrl);
  };

  return (
    <div class={styles['app']}>
      <Switch>
        <Match when={url.loading}>
          <p class={styles['status']}>{'Loading…'}</p>
        </Match>
        <Match when={url.error}>
          <p class={styles['status']}>{'Unable to read this page URL.'}</p>
        </Match>
        <Match when={pngDataUrl()}>
          {(src) => (
            <>
              <img
                class={styles['qr']}
                src={src()}
                alt={url() ?? ''}
                width={QR_DISPLAY_SIZE}
                height={QR_DISPLAY_SIZE}
              />
              <p class={styles['url']}>{url()}</p>
            </>
          )}
        </Match>
      </Switch>
      <div class={styles['actions']}>
        <button type='button' class={styles['button']} disabled={url() === undefined} onClick={copyLink}>
          {'复制链接'}
        </button>
        <button type='button' class={styles['button']} disabled={pngDataUrl() === undefined} onClick={copyImage}>
          {'复制图片'}
        </button>
      </div>
    </div>
  );
};

export default App;
