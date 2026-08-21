import { z } from 'zod/v4';

export const viteManifestChunkSchema = z.object({
  file: z.string(),
  src: z.string().optional(),
  isEntry: z.boolean().optional(),
  css: z.array(z.string()).optional()
});

export const viteManifestSchema = z.record(z.string(), viteManifestChunkSchema);

export type ViteManifest = z.infer<typeof viteManifestSchema>;
export type ViteManifestChunk = z.infer<typeof viteManifestChunkSchema>;
