type EventCallback = (...args: unknown[]) => void;

export class EventEmitter {
  private events: Record<string, EventCallback[]>;

  constructor() {
    this.events = {};
  }

  on(event: string, fn: EventCallback): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event]!.push(fn);
  }

  off(event: string, fn: EventCallback): void {
    if (this.events[event]) {
      this.events[event] = this.events[event]!.filter((f) => f !== fn);
    }
  }

  emit(event: string, ...args: unknown[]): void {
    if (this.events[event]) {
      this.events[event]!.forEach((fn) => fn(...args));
    }
  }

  once(event: string, fn: EventCallback): void {
    this.on(event, (...args: unknown[]) => {
      this.off(event, fn);
      fn(...args);
    });
  }
}

export default EventEmitter;
