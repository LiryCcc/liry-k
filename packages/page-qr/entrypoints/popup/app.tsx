import { createEffect, createMemo, createResource, createSignal, Index, Show, untrack } from 'solid-js';
import { encode } from 'uqr';
import { z } from 'zod/v4';

import styles from './app.module.css';

const tabUrlSchema = z.url();

const QR_EXPORT_SIZE = 4096;
const QR_COLOR_VALID = '#000000';
const QR_COLOR_INVALID = '#c62828';
const TOAST_DURATION_MS = 3200;
const TOAST_TRANSITION_MS = 1200;

type ToastKind = 'success' | 'error';

type ToastItem = {
  id: number;
  message: string;
  kind: ToastKind;
  open: boolean;
};

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

const downloadPngDataUrl = (dataUrl: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.rel = 'noopener';
  link.click();
};

const App = () => {
  const [pageUrl] = createResource(getActiveTabUrl);
  const [draftUrl, setDraftUrl] = createSignal('');
  const [toasts, setToasts] = createSignal<ToastItem[]>([]);
  let nextToastId = 0;

  const showToast = (message: string, kind: ToastKind) => {
    nextToastId += 1;
    const id = nextToastId;
    setToasts((current) => [...current, { id, message, kind, open: false }]);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setToasts((current) => current.map((toast) => (toast.id === id ? { ...toast, open: true } : toast)));
      });
    });

    window.setTimeout(() => {
      setToasts((current) => current.map((toast) => (toast.id === id ? { ...toast, open: false } : toast)));
      window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
      }, TOAST_TRANSITION_MS);
    }, TOAST_DURATION_MS);
  };

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

  const copyLink = async () => {
    const text = trimmedDraftUrl();
    if (text === '') {
      return;
    }
    try {
      await copyText(text);
      showToast('链接已复制', 'success');
    } catch {
      showToast('复制链接失败', 'error');
    }
  };

  const copyImage = async () => {
    const dataUrl = qrPngDataUrl();
    if (dataUrl === undefined) {
      return;
    }
    try {
      await copyPngDataUrl(dataUrl);
      showToast('图片已复制', 'success');
    } catch {
      showToast('复制图片失败', 'error');
    }
  };

  const downloadImage = () => {
    const dataUrl = qrPngDataUrl();
    if (dataUrl === undefined) {
      return;
    }
    try {
      downloadPngDataUrl(dataUrl, 'page-qr.png');
      showToast('图片已下载', 'success');
    } catch {
      showToast('下载图片失败', 'error');
    }
  };

  const resetUrl = () => {
    const loaded = pageUrl();
    if (loaded === undefined) {
      showToast('重置失败', 'error');
      return;
    }
    setDraftUrl(loaded);
    showToast('已重置为当前页面 URL', 'success');
  };

  return (
    <div class={styles['app']}>
      <div class={styles['toast-stack']} aria-live='polite'>
        <Index each={toasts()}>
          {(toast) => (
            <div
              class={`${styles['toast']} ${
                toast().kind === 'success' ? styles['toast-success'] : styles['toast-error']
              } ${toast().open ? styles['toast-open'] : ''}`}
            >
              {toast().message}
            </div>
          )}
        </Index>
      </div>

      <div class={styles['qr-frame']}>
        <Show when={qrPngDataUrl()} fallback={<div class={styles['qr-placeholder']} aria-hidden='true' />}>
          {(src) => <img class={styles['qr']} src={src()} alt={draftUrl()} />}
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
        <button type='button' class={styles['button']} disabled={qrPngDataUrl() === undefined} onClick={downloadImage}>
          {'下载'}
        </button>
      </div>
    </div>
  );
};

export default App;
