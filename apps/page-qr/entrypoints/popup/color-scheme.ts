export type ColorScheme = 'light' | 'dark';

const STORAGE_KEY = 'page-qr-color-scheme';

const isColorScheme = (value: string | null): value is ColorScheme => value === 'light' || value === 'dark';

export const getPreferredColorScheme = (): ColorScheme =>
  globalThis.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export const readStoredColorScheme = (): ColorScheme | undefined => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return isColorScheme(stored) ? stored : undefined;
};

export const resolveColorScheme = (): ColorScheme => readStoredColorScheme() ?? getPreferredColorScheme();

export const applyColorScheme = (scheme: ColorScheme): void => {
  document.documentElement.dataset['theme'] = scheme;
};

export const persistColorScheme = (scheme: ColorScheme): void => {
  localStorage.setItem(STORAGE_KEY, scheme);
  applyColorScheme(scheme);
};

export const toggleColorScheme = (scheme: ColorScheme): ColorScheme => (scheme === 'light' ? 'dark' : 'light');
