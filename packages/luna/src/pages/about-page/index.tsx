import styles from './index.module.css';

export const AboutPage = () => {
  return (
    <div class={styles['page']}>
      <h2 class={styles['title']}>About</h2>
      <p class={styles['desc']}>这里是 luna 的关于页面。</p>
    </div>
  );
};
