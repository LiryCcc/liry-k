type EventCallback = (...args: unknown[]) => void;

export class EventBus {
  private subscribers: Record<string, EventCallback[]>;

  constructor() {
    this.subscribers = {};
  }

  subscribe(event: string, callback: EventCallback): void {
    if (this.subscribers[event]) {
      this.subscribers[event]!.push(callback);
    } else {
      this.subscribers[event] = [callback];
    }
  }

  publish(event: string, ...args: unknown[]): void {
    if (this.subscribers[event]) {
      this.subscribers[event]!.forEach((callback) => callback(...args));
    }
  }

  unsubscribe(event: string, callback: EventCallback): void {
    if (this.subscribers[event]) {
      this.subscribers[event] = this.subscribers[event]!.filter((cb) => cb !== callback);
    }
  }
}

export default EventBus;
