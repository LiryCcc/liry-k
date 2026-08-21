import { z } from 'zod/v4';

const readableStreamSchema = z.custom<ReadableStream<Uint8Array>>(
  (value: unknown): value is ReadableStream<Uint8Array> => value instanceof ReadableStream
);

export const ssrRenderResultSchema = z.object({
  document: z.string().min(1),
  html: z.string().optional(),
  head: z.string().optional(),
  stream: readableStreamSchema.optional()
});

export type SsrRenderResult = z.infer<typeof ssrRenderResultSchema>;

export type SsrRender = (url: string) => SsrRenderResult | Promise<SsrRenderResult>;

export const ssrModuleSchema = z.object({
  render: z.custom<SsrRender>((value: unknown): value is SsrRender => typeof value === 'function')
});
