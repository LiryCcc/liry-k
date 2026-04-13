import { Link, Outlet } from '@tanstack/solid-router';
import styles from './index.module.css';

export const RootLayout = () => {
  return (
    <main class={styles.layout}>
      <header class={styles.header}>
        <h1 class={styles.title}>Luna</h1>
        <nav class={styles.nav}>
          <Link class={styles.link} to='/'>
            Home
          </Link>
          <Link class={styles.link} to='/about'>
            About
          </Link>
          <Link class={styles.link} to='/query-json' search={{ page: 1, tags: [] }}>
            Query JSON
          </Link>
          <Link class={styles.link} to='/path-demo/$postId' params={{ postId: '1' }}>
            Path Param
          </Link>
        </nav>
      </header>
      <section class={styles.content}>
        <Outlet />
      </section>
    </main>
  );
};
