export type PromiseResolverState = 'running' | 'resolved' | 'rejected';

export class PromiseResolver<T> {
  #promise: Promise<T>;
  get promise(): Promise<T> {
    return this.#promise;
  }

  #resolve!: (value: T | PromiseLike<T>) => void;
  #reject!: (reason?: unknown) => void;

  #state: PromiseResolverState = 'running';
  get state(): PromiseResolverState {
    return this.#state;
  }

  constructor() {
    this.#promise = new Promise<T>((resolve, reject) => {
      this.#resolve = resolve;
      this.#reject = reject;
    });
  }

  resolve = (value: T | PromiseLike<T>): void => {
    this.#resolve(value);
    this.#state = 'resolved';
  };

  reject = (reason?: unknown): void => {
    this.#reject(reason);
    this.#state = 'rejected';
  };
}
