import { ThemeContext, type ThemeMode } from '@/theme/theme-context.js';
import { type PropsWithChildren, useCallback, useMemo, useState } from 'react';

const applyThemeMode = (themeMode: ThemeMode) => {
  if (themeMode === 'system') {
    delete document.documentElement.dataset['theme'];
    return;
  }
  document.documentElement.dataset['theme'] = themeMode;
};

const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const setThemeMode = useCallback((nextThemeMode: ThemeMode) => {
    applyThemeMode(nextThemeMode);
    setThemeModeState(nextThemeMode);
  }, []);
  const value = useMemo(() => ({ setThemeMode, themeMode }), [setThemeMode, themeMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
