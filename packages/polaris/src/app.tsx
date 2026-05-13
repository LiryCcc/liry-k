import { TauriDragTitleArea } from '@/components/tauri-drag-title-area/index.js';
import { IS_TAURI, LAYOUT_CONSTANTS } from '@/constant.js';
import { DevToolsFab } from '@/dev-tools-fab.js';
import { setupI18n } from '@/i18n/setup-i18n.js';
import { useTranslation } from '@/i18n/use-translation.js';
import s from '@/index.module.css';
import { Show, createSignal, onMount } from 'solid-js';

const AppContent = () => {
  const { t } = useTranslation();
  const [demoUserName, setDemoUserName] = createSignal('Solid');
  const dragTopPx = IS_TAURI ? LAYOUT_CONSTANTS.DRAG_TITLE_HEIGHT : 0;

  return (
    <>
      <TauriDragTitleArea />
      <div class={s['app-shell']} style={dragTopPx > 0 ? { 'padding-top': `${dragTopPx}px` } : undefined}>
        <div>{t('app.greeting')}</div>
        <section class={s['interpolation-demo']}>
          <strong>{t('app.demoInterpolationTitle')}</strong>
          <label>
            {t('app.demoNameHint')}
            <input
              type='text'
              value={demoUserName()}
              onInput={(e) => setDemoUserName(e.currentTarget.value)}
              autocomplete='off'
            />
          </label>
          <div>
            {t('app.welcome', {
              userName: demoUserName()
            })}
          </div>
        </section>
        {IS_TAURI && <DevToolsFab />}
      </div>
    </>
  );
};

const App = () => {
  const [i18nReady, setI18nReady] = createSignal(false);

  onMount(() => {
    void setupI18n().then(() => {
      setI18nReady(true);
    });
  });

  return (
    <Show when={i18nReady()}>
      <AppContent />
    </Show>
  );
};

export default App;
