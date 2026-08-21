import { type MutableRefObject, useCallback, useLayoutEffect, useRef } from 'react';

export const useLatestRef = <T>(value: T): MutableRefObject<T> => {
  const ref = useRef(value);
  useLayoutEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
};

export const useStableCallback = <TArgs extends unknown[], R>(
  callback: (...args: TArgs) => R
): ((...args: TArgs) => R) => {
  const ref = useLatestRef(callback);
  return useCallback((...args: TArgs) => ref.current(...args), [ref]);
};
