export const fromBufferLikeToStandardUint8Array = (
  input: ArrayBuffer | ArrayBufferLike | Buffer | Uint8Array
): Uint8Array => {
  // if input is u8 return original
  if (input instanceof Uint8Array) {
    return input;
  } else {
    return new Uint8Array(input);
  }
};
