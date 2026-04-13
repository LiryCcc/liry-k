import { SignalWatcher } from '@lit-labs/signals';
import { LitElement } from 'lit';

/**
 * SignalWatcher 的返回类型会带上包内未导出的 SignalWatcherApi，直接导出会在生成 .d.ts 时触发 TS4023。
 * 对外标注为 LitElement 构造函数即可保持可继承，且不泄漏内部类型名。
 */
export const LitSignalWatcherElement = SignalWatcher(LitElement) as ReturnType<typeof SignalWatcher>;
/**
 * 组件库组件的基类
 */
export class LiryRigelElement extends LitSignalWatcherElement {
  constructor() {
    super();
  }
  /**
   * 组件名称
   */
  static get LIRY_RIGEL_ELEMENT_NAME(): string {
    throw new Error('you should override this method to set a name for this element');
  }

  /**
   * 注册到customElements上面
   */
  static registerCustomElements(): boolean {
    /**
     * 如果名字或者类已经注册且对不上，则返回false
     * 都没注册过，则尝试注册，成功true，失败false，
     * 如果都注册过且对的上，返回true
     */
    // 由子类覆盖的静态 getter；基类未覆盖时会抛错。
    const name = this.LIRY_RIGEL_ELEMENT_NAME;
    const registry = globalThis.customElements;
    // 当前类若已在 registry 中绑定到其他标签名，与 LIRY_RIGEL_ELEMENT_NAME 不一致则失败。
    const boundName = registry.getName?.(this);
    if (boundName !== undefined && boundName !== name) {
      return false;
    }
    // 已有同名定义：仅当实现类与当前类一致时视为成功。
    const existing = registry.get(name);
    if (existing !== undefined) {
      return existing === this;
    }
    // 首次注册：define 可能因非法名、类已被其他名占用等抛错，统一按失败处理。
    try {
      registry.define(name, this);
      return true;
    } catch {
      return false;
    }
  }
}
