import { invoke } from '@tauri-apps/api/core';
import s from './dev-tools-fab.module.css';

const label = 'DevTools';

export const DevToolsFab = () => {
  const onOpen = () => {
    void invoke('open_devtools').catch((err: unknown) => {
      console.error(err);
    });
  };

  return (
    <button type='button' class={s['fab']} title='打开开发者工具' onClick={onOpen}>
      {label}
    </button>
  );
};
