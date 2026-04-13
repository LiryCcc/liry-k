import { useTranslation } from '@/i18n/use-translation.js';
import styles from './index.module.css';

export const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div class={styles['page']}>
      <h2 class={styles['title']}>{t('home.title')}</h2>
      <p class={styles['desc']}>{t('home.desc')}</p>
    </div>
  );
};
