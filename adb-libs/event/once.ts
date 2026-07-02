import { PromiseResolver } from '@liry-k/async';

import type { Event } from './src/event.js';

/**
 * Asynchronously waits for the next occurrence of the event and returns its value.
 * @param event The event to wait for.
 * @returns A promise that resolves with the value of the next occurrence of the event.
 */
export const once = async <T>(event: Event<T>): Promise<T> => {
  const resolver = new PromiseResolver<T>();
  const dispose = event((value) => void resolver.resolve(value));
  const result = await resolver.promise;
  dispose();
  return result;
};
