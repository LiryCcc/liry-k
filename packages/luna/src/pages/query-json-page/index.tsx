import { getRouteApi } from '@tanstack/solid-router';
import { createMemo } from 'solid-js';
import styles from './index.module.css';

const queryJsonRouteApi = getRouteApi('/query-json');

export const QueryJsonPage = () => {
  const search = queryJsonRouteApi.useSearch();

  const queryJson = createMemo(() => {
    // 页面展示使用已通过 validateSearch 校验后的强类型结果。
    return JSON.stringify(search(), null, 2);
  });
  console.log(search());

  return (
    <div class={styles.page}>
      <h2 class={styles.title}>Query JSON</h2>
      <p class={styles.desc}>当前 URL 的 query 参数会转换为 JSON 字符串。</p>
      <div>{queryJson()}</div>
    </div>
  );
};
