const PRINTABLE: [number, number][] = [
  [33, 126],
  [161, 172],
  [174, 255]
];

export const isPrintableCharacter = (code: number) => {
  return PRINTABLE.some(([start, end]) => code >= start && code <= end);
};

export const toCharacter = (code: number) => {
  if (isPrintableCharacter(code)) {
    return String.fromCharCode(code);
  }
  return '.';
};

export const toText = (data: Uint8Array) => {
  return Array.from(data, toCharacter).join('');
};

export const stripNullChars = (text: string) => {
  return text.split('\0').join('');
};
