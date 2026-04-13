import { Link } from '@tanstack/solid-router';
import styles from './index.module.css';

export const NotFoundPage = () => {
  return (
    <div class={styles.page}>
      <h2 class={styles.title}>404</h2>
      <p class={styles.desc}>页面不存在。</p>
      <Link class={styles.link} to='/'>
        返回首页
      </Link>
    </div>
  );
};
