export const getUint32LittleEndian = (buffer: Uint8Array, offset: number): number =>
  (buffer[offset]! | (buffer[offset + 1]! << 8) | (buffer[offset + 2]! << 16) | (buffer[offset + 3]! << 24)) >>> 0;

export const getUint32BigEndian = (buffer: Uint8Array, offset: number): number =>
  ((buffer[offset]! << 24) | (buffer[offset + 1]! << 16) | (buffer[offset + 2]! << 8) | buffer[offset + 3]!) >>> 0;

export const getUint32 = (buffer: Uint8Array, offset: number, littleEndian: boolean) =>
  littleEndian
    ? (buffer[offset]! | (buffer[offset + 1]! << 8) | (buffer[offset + 2]! << 16) | (buffer[offset + 3]! << 24)) >>> 0
    : ((buffer[offset]! << 24) | (buffer[offset + 1]! << 16) | (buffer[offset + 2]! << 8) | buffer[offset + 3]!) >>> 0;

export const setUint32LittleEndian = (buffer: Uint8Array, offset: number, value: number): void => {
  buffer[offset] = value;
  buffer[offset + 1] = value >> 8;
  buffer[offset + 2] = value >> 16;
  buffer[offset + 3] = value >> 24;
};

export const setUint32BigEndian = (buffer: Uint8Array, offset: number, value: number): void => {
  buffer[offset] = value >> 24;
  buffer[offset + 1] = value >> 16;
  buffer[offset + 2] = value >> 8;
  buffer[offset + 3] = value;
};

export const setUint32 = (buffer: Uint8Array, offset: number, value: number, littleEndian: boolean): void => {
  if (littleEndian) {
    buffer[offset] = value;
    buffer[offset + 1] = value >> 8;
    buffer[offset + 2] = value >> 16;
    buffer[offset + 3] = value >> 24;
  } else {
    buffer[offset] = value >> 24;
    buffer[offset + 1] = value >> 16;
    buffer[offset + 2] = value >> 8;
    buffer[offset + 3] = value;
  }
};
