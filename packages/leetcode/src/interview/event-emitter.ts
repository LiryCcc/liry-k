type EventCallback = (...args: unknown[]) => void;

export class EventEmitter {
  private events: Record<string, EventCallback[]>;

  constructor() {
    this.events = {};
  }

  /** 触发 */
  emit(event: string, ...args: unknown[]): this {
    const cbs = this.events[event];
    if (!cbs) {
      console.log('no this event');
      return this;
    }
    cbs.forEach((cb) => {
      cb(...args);
    });
    return this;
  }

  /** 监听 */
  on(event: string, cb: EventCallback): this {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event]!.push(cb);
    return this;
  }

  /** 移除监听 */
  off(event: string, cb: EventCallback): this {
    if (this.events[event]) {
      this.events[event] = this.events[event]!.filter((it) => it !== cb);
    }
    return this;
  }

  once(event: string, cb: EventCallback): this {
    const func = (...args: unknown[]) => {
      this.off(event, func);
      cb(...args);
    };
    this.on(event, func);
    return this;
  }
}

export default EventEmitter;
