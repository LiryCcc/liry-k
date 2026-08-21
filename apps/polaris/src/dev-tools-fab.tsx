import s from '@/dev-tools-fab.module.css';
import { useTranslation } from '@/i18n/use-translation.js';
import { invoke } from '@tauri-apps/api/core';

export const DevToolsFab = () => {
  const { t } = useTranslation();

  const onOpen = () => {
    invoke('open_devtools');
  };

  return (
    <button type='button' class={s['fab']} title={t('devTools.openTitle')} onClick={onOpen}>
      {t('devTools.label')}
    </button>
  );
};
