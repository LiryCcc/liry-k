import { createContext } from 'react';

export type ThemeMode = 'dark' | 'light' | 'system';

export type ThemeContextValue = {
  readonly setThemeMode: (themeMode: ThemeMode) => void;
  readonly themeMode: ThemeMode;
};

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
