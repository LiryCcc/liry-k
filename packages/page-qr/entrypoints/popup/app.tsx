import { createEffect, createMemo, createResource, createSignal, Show, untrack } from 'solid-js';
import { encode } from 'uqr';
import { z } from 'zod/v4';

import styles from './app.module.css';

const tabUrlSchema = z.url();

const QR_DISPLAY_SIZE = 200;
const QR_EXPORT_SIZE = 4096;
const QR_COLOR_VALID = '#000000';
const QR_COLOR_INVALID = '#c62828';

const getActiveTabUrl = async (): Promise<string> => {
  const tabs = await browser['tabs'].query({
    active: true,
    currentWindow: true
  });
  return tabUrlSchema.parse(tabs[0]?.['url']);
};

/**
 * Encode text as a high-resolution QR PNG (export size), shown smaller in the UI.
 */
const renderQrPngDataUrl = (text: string, foreground: string): string => {
  const { data, size } = encode(text, { border: 2 });
  const moduleSize = Math.max(1, Math.floor(QR_EXPORT_SIZE / size));
  const drawnSize = moduleSize * size;
  const offset = Math.floor((QR_EXPORT_SIZE - drawnSize) / 2);

  const canvas = document.createElement('canvas');
  canvas.width = QR_EXPORT_SIZE;
  canvas.height = QR_EXPORT_SIZE;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas 2D context unavailable');
  }

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, QR_EXPORT_SIZE, QR_EXPORT_SIZE);
  context.fillStyle = foreground;

  for (let y = 0; y < size; y += 1) {
    const row = data[y];
    if (!row) {
      continue;
    }
    for (let x = 0; x < size; x += 1) {
      if (row[x]) {
        context.fillRect(offset + x * moduleSize, offset + y * moduleSize, moduleSize, moduleSize);
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
  const [pageUrl] = createResource(getActiveTabUrl);
  const [draftUrl, setDraftUrl] = createSignal('');

  createEffect(() => {
    const loaded = pageUrl();
    if (loaded === undefined) {
      return;
    }
    untrack(() => {
      if (draftUrl() === '') {
        setDraftUrl(loaded);
      }
    });
  });

  const trimmedDraftUrl = createMemo(() => draftUrl().trim());

  const isUrlValid = createMemo(() => {
    const text = trimmedDraftUrl();
    if (text === '') {
      return false;
    }
    return tabUrlSchema.safeParse(text).success;
  });

  /**
   * Always derived from the current draft so the QR matches the latest text.
   * Invalid URLs still encode; only the module color changes.
   */
  const qrPngDataUrl = createMemo(() => {
    const text = trimmedDraftUrl();
    if (text === '') {
      return undefined;
    }
    const foreground = isUrlValid() ? QR_COLOR_VALID : QR_COLOR_INVALID;
    return renderQrPngDataUrl(text, foreground);
  });

  const canReset = createMemo(() => {
    const loaded = pageUrl();
    return loaded !== undefined && draftUrl() !== loaded;
  });

  const copyLink = () => {
    const text = trimmedDraftUrl();
    if (text === '') {
      return;
    }
    copyText(text);
  };

  const copyImage = () => {
    const dataUrl = qrPngDataUrl();
    if (dataUrl === undefined) {
      return;
    }
    copyPngDataUrl(dataUrl);
  };

  const resetUrl = () => {
    const loaded = pageUrl();
    if (loaded === undefined) {
      return;
    }
    setDraftUrl(loaded);
  };

  return (
    <div class={styles['app']}>
      <div
        class={styles['qr-frame']}
        style={{
          width: `${QR_DISPLAY_SIZE}px`,
          height: `${QR_DISPLAY_SIZE}px`
        }}
      >
        <Show when={qrPngDataUrl()} fallback={<div class={styles['qr-placeholder']} aria-hidden='true' />}>
          {(src) => (
            <img class={styles['qr']} src={src()} alt={draftUrl()} width={QR_DISPLAY_SIZE} height={QR_DISPLAY_SIZE} />
          )}
        </Show>
      </div>

      <Show when={pageUrl.error}>
        <p class={styles['status']}>{'Unable to read this page URL.'}</p>
      </Show>

      <p
        class={`${styles['url-hint']} ${
          trimmedDraftUrl() === '' ? '' : isUrlValid() ? styles['url-hint-valid'] : styles['url-hint-invalid']
        }`}
      >
        {trimmedDraftUrl() === '' ? '\u00a0' : isUrlValid() ? 'URL 合法' : 'URL 不合法'}
      </p>

      <div class={styles['url-row']}>
        <input
          class={`${styles['url-input']} ${
            trimmedDraftUrl() !== '' && !isUrlValid() ? styles['url-input-invalid'] : ''
          }`}
          type='text'
          value={draftUrl()}
          placeholder={pageUrl.loading ? 'Loading…' : 'https://'}
          onInput={(event) => {
            setDraftUrl(event.currentTarget.value);
          }}
        />
        <button type='button' class={styles['button']} disabled={!canReset()} onClick={resetUrl}>
          {'重置'}
        </button>
      </div>

      <div class={styles['actions']}>
        <button type='button' class={styles['button']} disabled={trimmedDraftUrl() === ''} onClick={copyLink}>
          {'复制链接'}
        </button>
        <button type='button' class={styles['button']} disabled={qrPngDataUrl() === undefined} onClick={copyImage}>
          {'复制图片'}
        </button>
      </div>
    </div>
  );
};

export default App;
