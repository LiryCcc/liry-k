export const logArgs = (...args: unknown[]): void => {
  console.dir(...args);
};

logArgs(1, 2, 3);
