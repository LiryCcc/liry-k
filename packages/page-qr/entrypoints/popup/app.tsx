import { createResource, Match, Switch } from 'solid-js';
import { renderSVG } from 'uqr';
import { z } from 'zod/v4';

import styles from './app.module.css';

const tabUrlSchema = z.url();

const getActiveTabUrl = async (): Promise<string> => {
  const tabs = await browser['tabs'].query({
    active: true,
    currentWindow: true
  });
  return tabUrlSchema.parse(tabs[0]?.['url']);
};

const App = () => {
  const [url] = createResource(getActiveTabUrl);

  return (
    <div class={styles['app']}>
      <Switch>
        <Match when={url.loading}>
          <p class={styles['status']}>{'Loading…'}</p>
        </Match>
        <Match when={url.error}>
          <p class={styles['status']}>{'Unable to read this page URL.'}</p>
        </Match>
        <Match when={url()}>
          {(currentUrl) => (
            <>
              <div class={styles['qr']} innerHTML={renderSVG(currentUrl())} />
              <p class={styles['url']}>{currentUrl()}</p>
            </>
          )}
        </Match>
      </Switch>
    </div>
  );
};

export default App;
