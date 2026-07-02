import { PromiseResolver } from './promise-resolver.js';

export class AsyncOperationManager<T> {
  #nextId: number;

  #pendingResolvers: Map<number, PromiseResolver<T>> = new Map();

  constructor(startId: number = 0) {
    this.#nextId = startId;
  }

  add(): [id: number, promise: Promise<T>] {
    const id = this.#nextId++;
    const resolver = new PromiseResolver<T>();
    this.#pendingResolvers.set(id, resolver);
    return [id, resolver.promise];
  }

  #getResolver(id: number): PromiseResolver<T> | null {
    if (!this.#pendingResolvers.has(id)) {
      return null;
    }

    const resolver = this.#pendingResolvers.get(id)!;
    this.#pendingResolvers.delete(id);
    return resolver;
  }

  resolve(id: number, result: T): boolean {
    const resolver = this.#getResolver(id);
    if (resolver !== null) {
      resolver.resolve(result);
      return true;
    }
    return false;
  }

  reject(id: number, reason: Error): boolean {
    const resolver = this.#getResolver(id);
    if (resolver !== null) {
      resolver.reject(reason);
      return true;
    }
    return false;
  }
}
