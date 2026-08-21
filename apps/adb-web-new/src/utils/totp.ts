const hexToBytes = (hex: string): Uint8Array => {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
};

const generateTOTP = async (secretHex: string, counter: number): Promise<string> => {
  const counterBuf = new ArrayBuffer(8);
  const view = new DataView(counterBuf);
  view.setBigUint64(0, BigInt(counter), false);

  const key = await crypto.subtle.importKey(
    'raw',
    hexToBytes(secretHex) as BufferSource,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );

  const hmac = new Uint8Array(await crypto.subtle.sign('HMAC', key, counterBuf));
  const offset = hmac[hmac.length - 1]! & 0x0f;
  const code =
    ((hmac[offset]! & 0x7f) << 24) | ((hmac[offset + 1]! << 16) >>> 0) | (hmac[offset + 2]! << 8) | hmac[offset + 3]!;
  return String(code % 1000000).padStart(6, '0');
};

const WINDOW = 1;
const STEP = 30;

export const getCurrentTOTPCode = async (secretHex: string): Promise<string> => {
  const now = Math.floor(Date.now() / 1000);
  const counter = Math.floor(now / STEP);
  return generateTOTP(secretHex, counter);
};

export const verifyTOTP = async (secretHex: string, token: string): Promise<boolean> => {
  const now = Math.floor(Date.now() / 1000);
  const counter = Math.floor(now / STEP);
  for (let i = -WINDOW; i <= WINDOW; i++) {
    const expected = await generateTOTP(secretHex, counter + i);
    if (expected === token) return true;
  }
  return false;
};
