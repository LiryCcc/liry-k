type AnyFn = (...args: unknown[]) => unknown;

export const curry = (fn: AnyFn): AnyFn => {
  if (fn.length === 0) {
    return fn;
  }
  const curried = (...args: unknown[]): unknown => {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...args2: unknown[]) => curried(...args, ...args2);
  };
  return curried;
};

const sum = (a: number, b: number, c: number) => a + b + c;
console.log((curry(sum as AnyFn) as (a: number) => (b: number) => (c: number) => number)(1)(2)(3));

export const curry2 = (fn: AnyFn): AnyFn => {
  if (fn.length === 0) {
    return fn;
  }
  const curried = (...args: unknown[]): unknown => {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...rest: unknown[]) => curried(...args, ...rest);
  };
  return curried;
};
