import { IS_TAURI } from '@/constant.js';
import { DevToolsFab } from '@/dev-tools-fab.js';
import { setupI18n } from '@/i18n/setup-i18n.js';
import { useTranslation } from '@/i18n/use-translation.js';
import s from '@/index.module.css';
import { Show, createSignal, onMount } from 'solid-js';

const AppContent = () => {
  const { t } = useTranslation();
  const [demoUserName, setDemoUserName] = createSignal('Solid');

  return (
    <>
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
