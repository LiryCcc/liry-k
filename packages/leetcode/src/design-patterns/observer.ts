type Observer = object;

export class Sub {
  private observers: Observer[];

  constructor() {
    this.observers = [];
  }

  add(observer: Observer): void {
    this.observers.push(observer);
  }

  remove(observer: Observer): void {
    this.observers = this.observers.filter((o) => o !== observer);
  }

  notify(): void {}
}

export default Sub;
