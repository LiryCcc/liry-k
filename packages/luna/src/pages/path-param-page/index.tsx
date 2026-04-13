import { getRouteApi } from '@tanstack/solid-router';
import styles from './index.module.css';

const pathParamRouteApi = getRouteApi('/path-demo/$postId');

export const PathParamPage = () => {
  const params = pathParamRouteApi.useParams();

  return (
    <div class={styles.page}>
      <h2 class={styles.title}>Path Param Demo</h2>
      <p class={styles.desc}>当前路由参数 postId（自动强类型）:</p>
      <code class={styles.code}>{params().postId}</code>
    </div>
  );
};
