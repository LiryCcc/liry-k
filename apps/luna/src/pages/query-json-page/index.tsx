import { useTranslation } from '@/i18n/use-translation.js';
import { getRouteApi } from '@tanstack/solid-router';
import { createMemo } from 'solid-js';
import styles from './index.module.css';

const queryJsonRouteApi = getRouteApi('/query-json');

export const QueryJsonPage = () => {
  const { t } = useTranslation();
  const search = queryJsonRouteApi.useSearch();

  const queryJson = createMemo(() => {
    return JSON.stringify(search(), null, 2);
  });

  return (
    <div class={styles['page']}>
      <h2 class={styles['title']}>{t('queryJson.title')}</h2>
      <p class={styles['desc']}>{t('queryJson.desc')}</p>
      <div>{queryJson()}</div>
    </div>
  );
};
