export type MayBePromise<T> = T | Promise<T> | PromiseLike<T>;
export type OneOrMany<T> = T | T[];
export type ToStringAble = { toString: () => string };
