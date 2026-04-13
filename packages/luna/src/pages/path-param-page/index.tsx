import { useTranslation } from '@/i18n/use-translation.js';
import { getRouteApi } from '@tanstack/solid-router';
import styles from './index.module.css';

const pathParamRouteApi = getRouteApi('/path-demo/$postId');

export const PathParamPage = () => {
  const { t } = useTranslation();
  const params = pathParamRouteApi.useParams();

  return (
    <div class={styles['page']}>
      <h2 class={styles['title']}>{t('pathParam.title')}</h2>
      <p class={styles['desc']}>{t('pathParam.desc')}</p>
      <code class={styles['code']}>{params().postId}</code>
    </div>
  );
};
