import { z } from 'zod/v4';

export const unarchiveBasicPropSchema = z.object({
  // 压缩包类型
  type: z.enum(['zip', 'gzip', 'rar', '7z']).optional(),
  // 密码
  password: z.string().optional(),
  // 输出路径
  extractPath: z.string().optional()
});

export type UnarchiveBasicProp = z.infer<typeof unarchiveBasicPropSchema>;
