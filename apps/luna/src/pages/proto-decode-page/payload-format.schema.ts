import { z } from 'zod/v4';

export const payloadFormatSchema = z.enum(['hex', 'base64']);

export type PayloadFormat = z.infer<typeof payloadFormatSchema>;

const hexPayloadSchema = z
  .string()
  .transform((value) => value.replace(/\s/g, ''))
  .refine((value) => value.length > 0, { message: 'empty' })
  .refine((value) => value.length % 2 === 0, { message: 'odd_length' })
  .refine((value) => /^[0-9a-fA-F]+$/.test(value), { message: 'invalid_chars' })
  .transform((value) => {
    const bytes = new Uint8Array(value.length / 2);
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Number.parseInt(value.slice(index * 2, index * 2 + 2), 16);
    }
    return bytes;
  });

const base64PayloadSchema = z
  .string()
  .transform((value) => value.replace(/\s/g, ''))
  .refine((value) => value.length > 0, { message: 'empty' })
  .transform((value) => {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return bytes;
  });

/** 将用户输入的十六进制或 Base64 文本解析为二进制载荷。 */
export const parsePayloadText = (text: string, format: PayloadFormat) => {
  const schema = format === 'hex' ? hexPayloadSchema : base64PayloadSchema;
  return schema.safeParse(text);
};

/** 将二进制载荷格式化为十六进制或 Base64 文本。 */
export const formatPayloadBytes = (bytes: Uint8Array, format: PayloadFormat): string => {
  if (format === 'hex') {
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
};
