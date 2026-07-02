export const getInt32LittleEndian = (buffer: Uint8Array, offset: number): number =>
  buffer[offset]! | (buffer[offset + 1]! << 8) | (buffer[offset + 2]! << 16) | (buffer[offset + 3]! << 24);

export const getInt32BigEndian = (buffer: Uint8Array, offset: number): number =>
  (buffer[offset]! << 24) | (buffer[offset + 1]! << 16) | (buffer[offset + 2]! << 8) | buffer[offset + 3]!;

export const getInt32 = (buffer: Uint8Array, offset: number, littleEndian: boolean) =>
  littleEndian
    ? buffer[offset]! | (buffer[offset + 1]! << 8) | (buffer[offset + 2]! << 16) | (buffer[offset + 3]! << 24)
    : (buffer[offset]! << 24) | (buffer[offset + 1]! << 16) | (buffer[offset + 2]! << 8) | buffer[offset + 3]!;

export const setInt32LittleEndian = (buffer: Uint8Array, offset: number, value: number) => {
  buffer[offset] = value;
  buffer[offset + 1] = value >> 8;
  buffer[offset + 2] = value >> 16;
  buffer[offset + 3] = value >> 24;
};

export const setInt32BigEndian = (buffer: Uint8Array, offset: number, value: number) => {
  buffer[offset] = value >> 24;
  buffer[offset + 1] = value >> 16;
  buffer[offset + 2] = value >> 8;
  buffer[offset + 3] = value;
};

export const setInt32 = (buffer: Uint8Array, offset: number, value: number, littleEndian: boolean) => {
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
