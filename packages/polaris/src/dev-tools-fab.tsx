import { invoke } from '@tauri-apps/api/core';
import s from './dev-tools-fab.module.css';

const label = 'DevTools';

export const DevToolsFab = () => {
  const onOpen = () => {
    invoke('open_devtools');
  };

  return (
    <button type='button' class={s['fab']} title='打开开发者工具' onClick={onOpen}>
      {label}
    </button>
  );
};
