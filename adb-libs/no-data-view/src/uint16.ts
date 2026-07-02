export const getUint16LittleEndian = (buffer: Uint8Array, offset: number): number =>
  buffer[offset]! | (buffer[offset + 1]! << 8);

export const getUint16BigEndian = (buffer: Uint8Array, offset: number): number =>
  (buffer[offset]! << 8) | buffer[offset + 1]!;

export const getUint16 = (buffer: Uint8Array, offset: number, littleEndian: boolean) =>
  littleEndian ? buffer[offset]! | (buffer[offset + 1]! << 8) : buffer[offset + 1]! | (buffer[offset]! << 8);

export const setUint16LittleEndian = (buffer: Uint8Array, offset: number, value: number): void => {
  buffer[offset] = value;
  buffer[offset + 1] = value >> 8;
};

export const setUint16BigEndian = (buffer: Uint8Array, offset: number, value: number): void => {
  buffer[offset] = value >> 8;
  buffer[offset + 1] = value;
};

export const setUint16 = (buffer: Uint8Array, offset: number, value: number, littleEndian: boolean): void => {
  if (littleEndian) {
    buffer[offset] = value;
    buffer[offset + 1] = value >> 8;
  } else {
    buffer[offset] = value >> 8;
    buffer[offset + 1] = value;
  }
};
