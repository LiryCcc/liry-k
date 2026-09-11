import { useTheme } from '@/theme/use-theme.js';

const DARK_LABEL = 'Dark';
const GROUP_LABEL = 'Color theme';
const LIGHT_LABEL = 'Light';
const PAGE_DESCRIPTION = 'Choose how this application should render its color palette.';
const PAGE_SECTION = 'Settings';
const PAGE_TITLE = 'Appearance settings';
const SYSTEM_LABEL = 'Follow system';

const SettingsPage = () => {
  const { setThemeMode, themeMode } = useTheme();

  return (
    <section className='page-card'>
      <span className='eyebrow'>{PAGE_SECTION}</span>
      <h1>{PAGE_TITLE}</h1>
      <p>{PAGE_DESCRIPTION}</p>
      <div aria-label={GROUP_LABEL} className='theme-options' role='group'>
        <button
          aria-pressed={themeMode === 'light'}
          className='theme-option'
          onClick={() => setThemeMode('light')}
          type='button'
        >
          {LIGHT_LABEL}
        </button>
        <button
          aria-pressed={themeMode === 'dark'}
          className='theme-option'
          onClick={() => setThemeMode('dark')}
          type='button'
        >
          {DARK_LABEL}
        </button>
        <button
          aria-pressed={themeMode === 'system'}
          className='theme-option'
          onClick={() => setThemeMode('system')}
          type='button'
        >
          {SYSTEM_LABEL}
        </button>
      </div>
    </section>
  );
};

export default SettingsPage;
