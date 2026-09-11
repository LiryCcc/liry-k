import { ThemeContext } from '@/theme/theme-context.js';
import { use } from 'react';

export const useTheme = () => {
  const context = use(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
