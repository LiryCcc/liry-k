import { useTranslation } from '@/i18n/use-translation.js';
import { Link } from '@tanstack/solid-router';
import styles from './index.module.css';

export const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div class={styles['page']}>
      <h2 class={styles['title']}>{t('notFound.title')}</h2>
      <p class={styles['desc']}>{t('notFound.desc')}</p>
      <Link class={styles['link']} to='/'>
        {t('notFound.backHome')}
      </Link>
    </div>
  );
};
