export const getInt16LittleEndian = (buffer: Uint8Array, offset: number): number =>
  ((buffer[offset]! | (buffer[offset + 1]! << 8)) << 16) >> 16;

export const getInt16BigEndian = (buffer: Uint8Array, offset: number): number =>
  (((buffer[offset]! << 8) | buffer[offset + 1]!) << 16) >> 16;

export const getInt16 = (buffer: Uint8Array, offset: number, littleEndian: boolean) =>
  littleEndian
    ? ((buffer[offset]! | (buffer[offset + 1]! << 8)) << 16) >> 16
    : (((buffer[offset]! << 8) | buffer[offset + 1]!) << 16) >> 16;

export const setInt16LittleEndian = (buffer: Uint8Array, offset: number, value: number): void => {
  buffer[offset] = value;
  buffer[offset + 1] = value >> 8;
};

export const setInt16BigEndian = (buffer: Uint8Array, offset: number, value: number): void => {
  buffer[offset] = value >> 8;
  buffer[offset + 1] = value;
};

export const setInt16 = (buffer: Uint8Array, offset: number, value: number, littleEndian: boolean): void => {
  if (littleEndian) {
    buffer[offset] = value;
    buffer[offset + 1] = value >> 8;
  } else {
    buffer[offset] = value >> 8;
    buffer[offset + 1] = value;
  }
};
