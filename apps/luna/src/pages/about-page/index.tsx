import { useTranslation } from '@/i18n/use-translation.js';
import styles from './index.module.css';

export const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <div class={styles['page']}>
      <h2 class={styles['title']}>{t('about.title')}</h2>
      <p class={styles['desc']}>{t('about.desc')}</p>
    </div>
  );
};
