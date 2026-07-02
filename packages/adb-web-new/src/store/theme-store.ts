import { info } from '@/utils/observability.js';
import { Store } from '@tanstack/react-store';

export const themeNames = ['light', 'dark', 'teamsLight', 'teamsDark'] as const;

export type ThemeName = (typeof themeNames)[number];

export type ThemeState = {
  theme: ThemeName;
};

const storageKey = 'adb-web-new-theme';

const getInitialTheme = (): ThemeName => {
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored && themeNames.includes(stored as ThemeName)) {
      return stored as ThemeName;
    }
  } catch {
    /* 无 localStorage 或不支持 */
  }
  return typeof globalThis !== 'undefined' && globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

export const themeStore = new Store<ThemeState>({
  theme: getInitialTheme()
});

themeStore.subscribe(() => {
  try {
    localStorage.setItem(storageKey, themeStore.state.theme);
  } catch {
    /* 忽略写入失败 */
  }
});

export const setTheme = (theme: ThemeName): void => {
  info('theme.setTheme', theme);
  themeStore.setState(() => ({ theme }));
};

export const toggleTheme = (): void => {
  const current = themeStore.state.theme;
  const idx = themeNames.indexOf(current);
  const next = themeNames[(idx + 1) % themeNames.length]!;
  info('theme.toggleTheme', current, '->', next);
  setTheme(next);
};
