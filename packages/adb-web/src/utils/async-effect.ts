export const asyncEffect = <Args extends unknown[]>(
  effect: (signal: AbortSignal, ...args: Args) => Promise<void | (() => void)>
) => {
  const cancelChain = { dispose: () => {} };

  return async (...args: Args) => {
    cancelChain.dispose();

    const abortController = new AbortController();
    const cleanupSlot: { current: void | (() => void) } = { current: undefined };

    cancelChain.dispose = () => {
      const c = cleanupSlot.current;
      if (typeof c === 'function') {
        c();
      }
      abortController.abort();
    };

    try {
      cleanupSlot.current = await effect(abortController.signal, ...args);

      if (abortController.signal.aborted) {
        const c = cleanupSlot.current;
        if (typeof c === 'function') {
          c();
        }
      }
    } catch (e) {
      if (e instanceof DOMException) {
        if (e.name === 'AbortError') {
          return;
        }
      }

      console.error(e);
    }
  };
};
