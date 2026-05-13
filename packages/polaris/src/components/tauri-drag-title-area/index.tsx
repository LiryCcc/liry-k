import styles from '@/components/tauri-drag-title-area/index.module.css';
import { IS_TAURI, LAYOUT_CONSTANTS, POLARIS_PLATFORM } from '@/constant.js';
import type { LocaleCode } from '@/i18n/translation-tree.js';
import { useTranslation } from '@/i18n/use-translation.js';

/**
 * macOS Overlay 标题栏场景下的可拖拽顶栏：左侧为红绿灯留白，中间为拖拽区，右侧为语言下拉（不参与拖拽）。
 * 非 Tauri 或无需顶栏的平台返回 null。
 */
export const TauriDragTitleArea = () => {
  const { changeLanguage, language, t } = useTranslation();

  if (!IS_TAURI) {
    return null;
  }

  const heightPx = LAYOUT_CONSTANTS.DRAG_TITLE_HEIGHT;
  if (heightPx <= 0) {
    return null;
  }

  const reserve = LAYOUT_CONSTANTS.MACOS_TRAFFIC_LIGHT_RESERVE;

  const localeValue = (): LocaleCode => (language().startsWith('zh') ? 'zh' : 'en');

  return (
    <header class={styles['bar']} style={{ height: `${heightPx}px` }}>
      {POLARIS_PLATFORM === 'macos' ? (
        <div class={styles['traffic-spacer']} style={{ width: `${reserve}px` }} aria-hidden='true' />
      ) : null}
      <div class={styles['drag-region']} {...{ 'data-tauri-drag-region': true }} />
      <div class={styles['lang-actions']}>
        <select
          class={styles['lang-select']}
          aria-label={t('titleBar.languageSelectLabel')}
          value={localeValue()}
          onChange={(e) => {
            const next = e.currentTarget.value;
            if (next === 'en' || next === 'zh') {
              changeLanguage(next);
            }
          }}
        >
          <option value='en'>{t('titleBar.switchToEn')}</option>
          <option value='zh'>{t('titleBar.switchToZh')}</option>
        </select>
      </div>
    </header>
  );
};
