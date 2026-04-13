/**
 * Solid allows delegated / bound handler shapes; we only forward plain functions.
 * This keeps strict typing while still composing with consumer-provided listeners.
 */
export const tryCallEventHandler = <E extends Event>(
  handler: unknown,
  e: E & { currentTarget: HTMLButtonElement }
): void => {
  if (typeof handler === 'function') {
    (handler as (ev: typeof e) => void)(e);
  }
};
