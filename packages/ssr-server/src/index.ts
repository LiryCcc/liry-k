import { getRequestListener } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { compress } from 'hono/compress';
import { readFile } from 'node:fs/promises';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { ViteDevServer } from 'vite';
import { ssrModuleSchema, ssrRenderResultSchema, type SsrRenderResult } from './ssr-render.schema.js';
import { viteManifestSchema, type ViteManifestChunk } from './vite-manifest.schema.js';

export type { SsrRender, SsrRenderResult } from './ssr-render.schema.js';

const DEFAULT_PORT = 5173;
const DEFAULT_BASE = '/';
const DEFAULT_ABORT_DELAY_MS = 10_000;
const DEFAULT_CLIENT_ENTRY = '/src/client.ts';
const HEAD_CLOSE = '</head>';
const BODY_CLOSE = '</body>';

export type SsrServerOptions = {
  root?: string;
  base?: string;
  port?: number;
  isProduction?: boolean;
  clientEntry?: string;
  serverModule?: string;
  productionServerModule?: string;
  clientDist?: string;
  abortDelayMs?: number;
};

const stripBasePath = (path: string, base: string) => {
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  if (normalizedBase === '') {
    return path;
  }
  if (path === normalizedBase) {
    return '/';
  }
  if (path.startsWith(`${normalizedBase}/`)) {
    return path.slice(normalizedBase.length);
  }
  return path;
};

const toPublicUrl = (file: string, base: string) => {
  const path = file.startsWith('/') ? file : `/${file}`;
  if (base === '/') {
    return path;
  }
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${normalizedBase}${path}`;
};

const injectBefore = (html: string, marker: string, snippet: string) => {
  if (snippet === '') {
    return html;
  }
  const index = html.indexOf(marker);
  if (index === -1) {
    return `${html}${snippet}`;
  }
  return `${html.slice(0, index)}${snippet}${html.slice(index)}`;
};

const splitAtMarker = (html: string, marker: string) => {
  const index = html.indexOf(marker);
  if (index === -1) {
    return { htmlStart: html, htmlEnd: '' };
  }
  return {
    htmlStart: html.slice(0, index),
    htmlEnd: html.slice(index)
  };
};

const concatHtmlStream = (
  htmlStart: string,
  body: ReadableStream<Uint8Array>,
  htmlEnd: string,
  onComplete: () => void
) => {
  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    start: async (controller) => {
      try {
        controller.enqueue(encoder.encode(htmlStart));
        const reader = body.getReader();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          if (value !== undefined) {
            controller.enqueue(value);
          }
        }
        controller.enqueue(encoder.encode(htmlEnd));
        controller.close();
      } catch (error) {
        controller.error(error);
      } finally {
        onComplete();
      }
    }
  });
};

const resolveManifestEntry = (manifest: Record<string, ViteManifestChunk>, clientEntry: string) => {
  const normalized = clientEntry.replace(/^\//, '');
  const direct = manifest[normalized] ?? manifest[clientEntry];
  if (direct !== undefined) {
    return direct;
  }
  const entry = Object.values(manifest).find((chunk) => chunk.isEntry === true);
  if (entry === undefined) {
    throw new Error(`Vite manifest is missing client entry "${clientEntry}"`);
  }
  return entry;
};

const renderProductionHead = (entry: ViteManifestChunk, base: string) => {
  const cssTags = (entry.css ?? []).map((file) => `<link rel="stylesheet" href="${toPublicUrl(file, base)}">`).join('');
  return `${cssTags}<script type="module" src="${toPublicUrl(entry.file, base)}"></script>`;
};

export const startSsrServer = async (options: SsrServerOptions = {}) => {
  const root = options.root ?? process.cwd();
  const base = options.base ?? process.env['BASE'] ?? DEFAULT_BASE;
  const port = options.port ?? Number(process.env['PORT'] ?? DEFAULT_PORT);
  const isProduction =
    options.isProduction ?? (process.argv.includes('--production') || process.env['NODE_ENV'] === 'production');
  const clientEntry = options.clientEntry ?? DEFAULT_CLIENT_ENTRY;
  const serverModule = options.serverModule ?? '/src/server.tsx';
  const productionServerModule = resolve(root, options.productionServerModule ?? 'dist/server/server.js');
  const clientDist = resolve(root, options.clientDist ?? 'dist/client');
  const abortDelayMs = options.abortDelayMs ?? DEFAULT_ABORT_DELAY_MS;

  const app = new Hono();
  let vite: ViteDevServer | undefined;
  let productionHead = '';

  if (isProduction) {
    const manifestJson: unknown = JSON.parse(await readFile(resolve(clientDist, '.vite/manifest.json'), 'utf-8'));
    const manifest = viteManifestSchema.parse(manifestJson);
    productionHead = renderProductionHead(resolveManifestEntry(manifest, clientEntry), base);
    app.use(compress());
    app.use(
      '*',
      serveStatic({
        root: clientDist,
        rewriteRequestPath: (path) => stripBasePath(path, base)
      })
    );
  } else {
    const { createServer: createViteServer } = await import('vite');
    vite = await createViteServer({
      root,
      server: { middlewareMode: true },
      appType: 'custom',
      base
    });
  }

  const loadRender = async () => {
    if (vite !== undefined) {
      const loaded: unknown = await vite.ssrLoadModule(serverModule);
      return ssrModuleSchema.parse(loaded).render;
    }
    const loaded: unknown = await import(pathToFileURL(productionServerModule).href);
    return ssrModuleSchema.parse(loaded).render;
  };

  const prepareTemplate = async (pageUrl: string, document: string, head: string) => {
    let template = document;
    if (vite !== undefined) {
      template = injectBefore(template, HEAD_CLOSE, `<script type="module" src="${clientEntry}"></script>`);
      template = await vite.transformIndexHtml(pageUrl, template);
    } else {
      template = injectBefore(template, HEAD_CLOSE, productionHead);
    }
    return injectBefore(template, HEAD_CLOSE, head);
  };

  const renderPage = (rendered: SsrRenderResult, template: string) => {
    const { htmlStart, htmlEnd } = splitAtMarker(template, BODY_CLOSE);
    const bodyStream = rendered.stream;
    if (bodyStream !== undefined) {
      const timeoutId = setTimeout(() => {
        bodyStream.cancel();
      }, abortDelayMs);
      return new Response(
        concatHtmlStream(htmlStart, bodyStream, htmlEnd, () => clearTimeout(timeoutId)),
        {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        }
      );
    }
    return new Response(`${htmlStart}${rendered.html ?? ''}${htmlEnd}`, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  };

  app.all('*', async (c) => {
    const requestUrl = new URL(c.req.url);
    const pageUrl = `${stripBasePath(requestUrl.pathname, base)}${requestUrl.search}`;
    try {
      const render = await loadRender();
      const rendered = ssrRenderResultSchema.parse(await render(pageUrl));
      const template = await prepareTemplate(pageUrl, rendered.document, rendered.head ?? '');
      return renderPage(rendered, template);
    } catch (error: unknown) {
      if (error instanceof Error) {
        vite?.ssrFixStacktrace(error);
        console.error(error.stack);
        return c.text(error.stack ?? error.message, 500);
      }
      throw error;
    }
  });

  const nodeListener = getRequestListener(app.fetch);
  const handleNodeRequest = (req: IncomingMessage, res: ServerResponse) => {
    if (vite === undefined) {
      nodeListener(req, res);
      return;
    }
    vite.middlewares(req, res, (error?: unknown) => {
      if (error !== undefined) {
        const message = error instanceof Error ? (error.stack ?? error.message) : String(error);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        }
        res.end(message);
        return;
      }
      nodeListener(req, res);
    });
  };

  const server = createServer(handleNodeRequest);
  await new Promise<void>((resolveListen) => {
    server.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
      resolveListen();
    });
  });
  return server;
};
