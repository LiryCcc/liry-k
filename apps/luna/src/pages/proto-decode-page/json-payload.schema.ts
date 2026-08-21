import { z } from 'zod/v4';

const jsonPayloadSchema = z
  .string()
  .transform((value) => value.trim())
  .refine((value) => value.length > 0, { message: 'empty' })
  .transform((value, ctx): Record<string, unknown> => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(value);
    } catch {
      ctx.addIssue({ code: 'custom', message: 'invalid_json' });
      return z.NEVER;
    }
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      ctx.addIssue({ code: 'custom', message: 'not_object' });
      return z.NEVER;
    }
    return parsed as Record<string, unknown>;
  });

/** 将用户输入的 JSON 文本解析为对象，供 Protobuf 编码使用。 */
export const parseJsonPayload = (text: string) => {
  return jsonPayloadSchema.safeParse(text);
};
