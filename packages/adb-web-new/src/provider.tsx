import { i18n } from '@/i18n/setup-i18n.js';
import type { ThemeName } from '@/store/theme-store.js';
import { themeStore } from '@/store/theme-store.js';
import {
  FluentProvider,
  teamsDarkTheme,
  teamsLightTheme,
  webDarkTheme,
  webLightTheme
} from '@fluentui/react-components';
import { useSelector } from '@tanstack/react-store';
import type { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { DevicesProvider } from './store/devices-context.js';

const themeMap: Record<ThemeName, typeof webLightTheme> = {
  dark: webDarkTheme,
  light: webLightTheme,
  teamsDark: teamsDarkTheme,
  teamsLight: teamsLightTheme
};

/**
 * 各个provider叠加在这里
 */
export const LiryProvider = ({ children }: { children: ReactNode }) => {
  const { theme } = useSelector(themeStore);

  return (
    <FluentProvider theme={themeMap[theme]}>
      <DevicesProvider>
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </DevicesProvider>
    </FluentProvider>
  );
};
