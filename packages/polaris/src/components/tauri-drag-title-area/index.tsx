import styles from '@/components/tauri-drag-title-area/index.module.css';
import { IS_TAURI, LAYOUT_CONSTANTS, POLARIS_PLATFORM } from '@/constant.js';

/**
 * macOS Overlay 标题栏场景下的可拖拽顶栏：左侧为红绿灯留白，右侧带 `data-tauri-drag-region`。
 * 非 Tauri 或无需顶栏的平台返回 null。
 */
export const TauriDragTitleArea = () => {
  if (!IS_TAURI) {
    return null;
  }

  const heightPx = LAYOUT_CONSTANTS.DRAG_TITLE_HEIGHT;
  if (heightPx <= 0) {
    return null;
  }

  const reserve = LAYOUT_CONSTANTS.MACOS_TRAFFIC_LIGHT_RESERVE;

  return (
    <header class={styles['bar']} style={{ height: `${heightPx}px` }}>
      {POLARIS_PLATFORM === 'macos' ? (
        <div class={styles['traffic-spacer']} style={{ width: `${reserve}px` }} aria-hidden='true' />
      ) : null}
      <div class={styles['drag-region']} {...{ 'data-tauri-drag-region': true }} />
    </header>
  );
};
