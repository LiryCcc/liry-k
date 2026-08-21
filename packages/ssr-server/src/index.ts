import { getRequestListener } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { compress } from 'hono/compress';
import { readFile } from 'node:fs/promises';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { resolve } from 'node:path';
import type { InlineConfig, ViteDevServer } from 'vite';
import { ssrModuleSchema, ssrRenderResultSchema, type SsrRender, type SsrRenderResult } from './ssr-render.schema.js';
import { viteManifestSchema, type ViteManifestChunk } from './vite-manifest.schema.js';

export type { SsrRender, SsrRenderResult } from './ssr-render.schema.js';

const DEFAULT_PORT = 5173;
const DEFAULT_BASE = '/';
const DEFAULT_ABORT_DELAY_MS = 10_000;
const DEFAULT_CLIENT_ENTRY = '/src/client.ts';
const DEFAULT_SERVER_MODULE = '/src/server.tsx';
const HEAD_CLOSE = '</head>';
const BODY_CLOSE = '</body>';

export type CreateViteServer = (config?: InlineConfig) => Promise<ViteDevServer>;

export type SsrServerOptions = {
  readonly root?: string;
  readonly base?: string;
  readonly port?: number;
  readonly isProduction?: boolean;
  readonly clientEntry?: string;
  readonly serverModule?: string;
  readonly clientDist?: string;
  readonly abortDelayMs?: number;
  readonly render?: SsrRender;
  readonly createViteServer?: CreateViteServer;
};

type DevRuntime = {
  readonly mode: 'development';
  readonly vite: ViteDevServer;
  readonly clientEntry: string;
  readonly serverModule: string;
};

type ProdRuntime = {
  readonly mode: 'production';
  readonly head: string;
  readonly render: SsrRender;
};

type SsrRuntime = DevRuntime | ProdRuntime;

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
    return { htmlStart: html, htmlEnd: '' } as const;
  }
  return {
    htmlStart: html.slice(0, index),
    htmlEnd: html.slice(index)
  } as const;
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

const resolveManifestEntry = (manifest: Readonly<Record<string, ViteManifestChunk>>, clientEntry: string) => {
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

const createDevRuntime = async (options: {
  readonly root: string;
  readonly base: string;
  readonly clientEntry: string;
  readonly serverModule: string;
  readonly createViteServer: CreateViteServer;
}): Promise<DevRuntime> => {
  const vite = await options.createViteServer({
    root: options.root,
    server: { middlewareMode: true },
    appType: 'custom',
    base: options.base
  });
  return {
    mode: 'development',
    vite,
    clientEntry: options.clientEntry,
    serverModule: options.serverModule
  };
};

const createProdRuntime = async (options: {
  readonly base: string;
  readonly clientEntry: string;
  readonly clientDist: string;
  readonly render: SsrRender;
}): Promise<ProdRuntime> => {
  const manifestJson: unknown = JSON.parse(await readFile(resolve(options.clientDist, '.vite/manifest.json'), 'utf-8'));
  const manifest = viteManifestSchema.parse(manifestJson);
  return {
    mode: 'production',
    head: renderProductionHead(resolveManifestEntry(manifest, options.clientEntry), options.base),
    render: options.render
  };
};

const createRuntime = async (options: {
  readonly root: string;
  readonly base: string;
  readonly isProduction: boolean;
  readonly clientEntry: string;
  readonly serverModule: string;
  readonly clientDist: string;
  readonly render: SsrRender | undefined;
  readonly createViteServer: CreateViteServer | undefined;
}): Promise<SsrRuntime> => {
  if (options.isProduction) {
    if (options.render === undefined) {
      throw new Error('Production SSR requires a static `render` option');
    }
    return createProdRuntime({
      base: options.base,
      clientEntry: options.clientEntry,
      clientDist: options.clientDist,
      render: options.render
    });
  }
  if (options.createViteServer === undefined) {
    throw new Error('Development SSR requires a static `createViteServer` option');
  }
  return createDevRuntime({
    root: options.root,
    base: options.base,
    clientEntry: options.clientEntry,
    serverModule: options.serverModule,
    createViteServer: options.createViteServer
  });
};

const loadRender = async (runtime: SsrRuntime) => {
  if (runtime.mode === 'production') {
    return runtime.render;
  }
  const loaded: unknown = await runtime.vite.ssrLoadModule(runtime.serverModule);
  return ssrModuleSchema.parse(loaded).render;
};

const prepareTemplate = async (runtime: SsrRuntime, pageUrl: string, document: string, head: string) => {
  if (runtime.mode === 'development') {
    const withClient = injectBefore(
      document,
      HEAD_CLOSE,
      `<script type="module" src="${runtime.clientEntry}"></script>`
    );
    const transformed = await runtime.vite.transformIndexHtml(pageUrl, withClient);
    return injectBefore(transformed, HEAD_CLOSE, head);
  }
  return injectBefore(injectBefore(document, HEAD_CLOSE, runtime.head), HEAD_CLOSE, head);
};

const renderPage = (rendered: SsrRenderResult, template: string, abortDelayMs: number) => {
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

const createApp = (
  runtime: SsrRuntime,
  options: { readonly base: string; readonly clientDist: string; readonly abortDelayMs: number }
) => {
  const app = new Hono();
  if (runtime.mode === 'production') {
    app.use(compress());
    app.use(
      '*',
      serveStatic({
        root: options.clientDist,
        rewriteRequestPath: (path) => stripBasePath(path, options.base)
      })
    );
  }

  app.all('*', async (c) => {
    const requestUrl = new URL(c.req.url);
    const pageUrl = `${stripBasePath(requestUrl.pathname, options.base)}${requestUrl.search}`;
    try {
      const render = await loadRender(runtime);
      const rendered = ssrRenderResultSchema.parse(await render(pageUrl));
      const template = await prepareTemplate(runtime, pageUrl, rendered.document, rendered.head ?? '');
      return renderPage(rendered, template, options.abortDelayMs);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (runtime.mode === 'development') {
          runtime.vite.ssrFixStacktrace(error);
        }
        console.error(error.stack);
        return c.text(error.stack ?? error.message, 500);
      }
      throw error;
    }
  });

  return app;
};

const createNodeHandler = (runtime: SsrRuntime, app: Hono) => {
  const nodeListener = getRequestListener(app.fetch);
  if (runtime.mode === 'production') {
    return nodeListener;
  }
  return (req: IncomingMessage, res: ServerResponse) => {
    runtime.vite.middlewares(req, res, (error?: unknown) => {
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
};

export const startSsrServer = async (options: SsrServerOptions = {}) => {
  const root = options.root ?? process.cwd();
  const base = options.base ?? process.env['BASE'] ?? DEFAULT_BASE;
  const port = options.port ?? Number(process.env['PORT'] ?? DEFAULT_PORT);
  const isProduction =
    options.isProduction ?? (process.argv.includes('--production') || process.env['NODE_ENV'] === 'production');
  const clientEntry = options.clientEntry ?? DEFAULT_CLIENT_ENTRY;
  const serverModule = options.serverModule ?? DEFAULT_SERVER_MODULE;
  const clientDist = resolve(root, options.clientDist ?? 'dist/client');
  const abortDelayMs = options.abortDelayMs ?? DEFAULT_ABORT_DELAY_MS;

  const runtime = await createRuntime({
    root,
    base,
    isProduction,
    clientEntry,
    serverModule,
    clientDist,
    render: options.render,
    createViteServer: options.createViteServer
  });
  const app = createApp(runtime, { base, clientDist, abortDelayMs });
  const handleNodeRequest = createNodeHandler(runtime, app);
  const server = createServer(handleNodeRequest);

  await new Promise<void>((resolveListen) => {
    server.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
      resolveListen();
    });
  });
  return server;
};
