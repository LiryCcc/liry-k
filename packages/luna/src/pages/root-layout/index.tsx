import { useTranslation } from '@/i18n/use-translation.js';
import { Button } from '@liry-k/astra';
import { Link, Outlet } from '@tanstack/solid-router';
import styles from './index.module.css';

export const RootLayout = () => {
  const { changeLanguage, t } = useTranslation();

  return (
    <main class={styles['layout']}>
      <header class={styles['header']}>
        <h1 class={styles['title']}>{t('app.title')}</h1>
        <div class={styles['lang']}>
          <Button class={styles['langButton']} type='button' onClick={() => void changeLanguage('zh')}>
            {t('ui.switchToZh')}
          </Button>
          <Button class={styles['langButton']} type='button' onClick={() => void changeLanguage('en')}>
            {t('ui.switchToEn')}
          </Button>
        </div>
        <nav class={styles['nav']}>
          <Link class={styles['link']} to='/'>
            {t('nav.home')}
          </Link>
          <Link class={styles['link']} to='/about'>
            {t('nav.about')}
          </Link>
          <Link class={styles['link']} to='/query-json' search={{ page: 1, tags: [] }}>
            {t('nav.queryJson')}
          </Link>
          <Link class={styles['link']} to='/path-demo/$postId' params={{ postId: '1' }}>
            {t('nav.pathParam')}
          </Link>
        </nav>
      </header>
      <section class={styles['content']}>
        <Outlet />
      </section>
    </main>
  );
};
