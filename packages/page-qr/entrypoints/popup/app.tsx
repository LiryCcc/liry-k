import { createEffect, createMemo, createResource, createSignal, Index, Show, untrack } from 'solid-js';
import { encode } from 'uqr';
import { z } from 'zod/v4';

import styles from './app.module.css';
import { persistColorScheme, resolveColorScheme, toggleColorScheme, type ColorScheme } from './color-scheme.js';

const tabUrlSchema = z.url();

const QR_EXPORT_SIZE = 4096;
const QR_COLOR_VALID = '#000000';
const TOAST_DURATION_MS = 3200;
const TOAST_TRANSITION_MS = 1200;

type ToastKind = 'success' | 'error';

type ToastItem = {
  id: number;
  message: string;
  kind: ToastKind;
  open: boolean;
};

const MoonIcon = () => (
  <svg class={styles['theme-icon']} viewBox='0 0 24 24' aria-hidden='true'>
    <path fill='currentColor' d='M12 3.1A9 9 0 1 0 20.9 12 7.2 7.2 0 0 1 12 3.1Z' />
  </svg>
);

const SunIcon = () => (
  <svg class={styles['theme-icon']} viewBox='0 0 24 24' aria-hidden='true'>
    <circle cx='12' cy='12' r='4' fill='currentColor' />
    <g fill='currentColor'>
      <rect x='11' y='1.5' width='2' height='3' rx='1' />
      <rect x='11' y='19.5' width='2' height='3' rx='1' />
      <rect x='1.5' y='11' width='3' height='2' rx='1' />
      <rect x='19.5' y='11' width='3' height='2' rx='1' />
      <rect x='11' y='1.5' width='2' height='3' rx='1' transform='rotate(45 12 12)' />
      <rect x='11' y='1.5' width='2' height='3' rx='1' transform='rotate(135 12 12)' />
      <rect x='11' y='1.5' width='2' height='3' rx='1' transform='rotate(225 12 12)' />
      <rect x='11' y='1.5' width='2' height='3' rx='1' transform='rotate(315 12 12)' />
    </g>
  </svg>
);

const getActiveTabUrl = async (): Promise<string> => {
  const tabs = await browser['tabs'].query({
    active: true,
    currentWindow: true
  });
  return tabUrlSchema.parse(tabs[0]?.['url']);
};

const readCssColor = (token: string, fallback: string): string => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  return value === '' ? fallback : value;
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
  const [colorScheme, setColorScheme] = createSignal<ColorScheme>(resolveColorScheme());
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

  const urlFieldInvalid = createMemo(() => trimmedDraftUrl() !== '' && !isUrlValid());

  /**
   * Always derived from the current draft so the QR matches the latest text.
   * Invalid URLs still encode; only the module color changes.
   */
  const qrPngDataUrl = createMemo(() => {
    colorScheme();
    const text = trimmedDraftUrl();
    if (text === '') {
      return undefined;
    }
    const foreground = isUrlValid() ? QR_COLOR_VALID : readCssColor('--md-sys-color-error', '#b3261e');
    return renderQrPngDataUrl(text, foreground);
  });

  const canReset = createMemo(() => {
    const loaded = pageUrl();
    return loaded !== undefined && draftUrl() !== loaded;
  });

  const onToggleColorScheme = () => {
    const next = toggleColorScheme(colorScheme());
    persistColorScheme(next);
    setColorScheme(next);
  };

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
      <md-icon-button
        class={styles['theme-toggle']}
        aria-label={colorScheme() === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
        onClick={onToggleColorScheme}
      >
        <Show when={colorScheme() === 'dark'} fallback={<SunIcon />}>
          <MoonIcon />
        </Show>
      </md-icon-button>

      <div class={styles['toast-stack']} aria-live='polite'>
        <Index each={toasts()}>
          {(toast) => (
            <div
              class={`${styles['snackbar']} ${
                toast().kind === 'success' ? styles['snackbar-success'] : styles['snackbar-error']
              } ${toast().open ? styles['snackbar-open'] : ''}`}
            >
              {toast().message}
            </div>
          )}
        </Index>
      </div>

      <md-outlined-card class={styles['qr-card']}>
        <Show when={qrPngDataUrl()} fallback={<div class={styles['qr-placeholder']} aria-hidden='true' />}>
          {(src) => <img class={styles['qr']} src={src()} alt={draftUrl()} />}
        </Show>
      </md-outlined-card>

      <Show when={pageUrl.error}>
        <p class={styles['status']}>{'Unable to read this page URL.'}</p>
      </Show>

      <div class={styles['url-row']}>
        <md-outlined-text-field
          class={styles['url-field']}
          label='页面 URL'
          type='url'
          value={draftUrl()}
          placeholder={pageUrl.loading ? 'Loading…' : 'https://'}
          error={urlFieldInvalid()}
          errorText={urlFieldInvalid() ? 'URL 不合法' : ''}
          supportingText={trimmedDraftUrl() === '' ? '\u00a0' : isUrlValid() ? 'URL 合法' : ''}
          onInput={(event) => {
            setDraftUrl(event.currentTarget.value);
          }}
        />
        <md-outlined-button disabled={!canReset()} onClick={resetUrl}>
          {'重置'}
        </md-outlined-button>
      </div>

      <div class={styles['actions']}>
        <md-filled-tonal-button disabled={trimmedDraftUrl() === ''} onClick={copyLink}>
          {'复制链接'}
        </md-filled-tonal-button>
        <md-filled-button disabled={qrPngDataUrl() === undefined} onClick={copyImage}>
          {'复制图片'}
        </md-filled-button>
        <md-filled-button disabled={qrPngDataUrl() === undefined} onClick={downloadImage}>
          {'下载'}
        </md-filled-button>
      </div>
    </div>
  );
};

export default App;
