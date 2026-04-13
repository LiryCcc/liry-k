/** Joins truthy class fragments for consumer overrides (e.g. CSS modules). */
export const cn = (...parts: (string | undefined | false)[]): string => parts.filter(Boolean).join(' ');
