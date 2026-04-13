import styles from './index.module.css';

export const HomePage = () => {
  return (
    <div class={styles['page']}>
      <h2 class={styles['title']}>Home</h2>
      <p class={styles['desc']}>欢迎来到 luna 首页。</p>
    </div>
  );
};
