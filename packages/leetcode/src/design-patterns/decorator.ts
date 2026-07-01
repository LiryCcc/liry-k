declare global {
  interface Function {
    before(beforeFn: (...args: unknown[]) => void): (...args: unknown[]) => unknown;
    after(afterFn: (...args: unknown[]) => void): (...args: unknown[]) => unknown;
  }
}

Function.prototype.before = function (beforeFn) {
  return (...args: unknown[]) => {
    beforeFn(...args);
    return (this as (...a: unknown[]) => unknown)(...args);
  };
};

Function.prototype.after = function (afterFn) {
  return (...args: unknown[]) => {
    const ret = (this as (...a: unknown[]) => unknown)(...args);
    afterFn(...args);
    return ret;
  };
};

function test(): void {
  console.log('11111');
}

export const test1 = test
  .before(() => {
    console.log('00000');
  })
  .after(() => {
    console.log('22222');
  });

test1();
