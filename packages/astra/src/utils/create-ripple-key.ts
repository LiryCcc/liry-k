/** Creates a ripple list key without module-level counters (crypto when available). */
export const createRippleKey = (): string => {
  const c = globalThis.crypto;
  if (c !== undefined && typeof c.randomUUID === 'function') {
    return c.randomUUID();
  }
  return `r-${globalThis.performance?.now?.() ?? Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};
