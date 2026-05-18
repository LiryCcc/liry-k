import type { Nullable, OneOrMany, ToStringAble } from '@liry-k/stellar';

type QueryValue = Nullable<OneOrMany<ToStringAble>>;

export const stringify = (obj: Record<string, QueryValue>): string => {
  const searchParams = new URLSearchParams();
  for (const k of Object.keys(obj)) {
    const v: QueryValue = obj[k]!;
    if (v == null) {
      searchParams.append(k, '');
      continue;
    }
    if (Array.isArray(v)) {
      for (const e of v) {
        searchParams.append(k, e == null ? '' : e.toString());
      }
      continue;
    }
    searchParams.append(k, v.toString());
  }
  return searchParams.toString();
};
