# React streaming SSR

A production-oriented React 19 streaming SSR example powered by Vite and the workspace `@liry-k/ssr-server` package.

## Development

```bash
pnpm dev
```

The development server uses Vite in middleware mode, including SSR module loading, transforms, and React Fast Refresh.

## Production

```bash
pnpm build
PORT=5173 pnpm start
```

The build creates separate outputs:

- `dist/client`: hashed browser assets and the Vite manifest.
- `dist/server`: the executable Node.js SSR server.

Configure `PORT` to change the listening port and `BASE` when the application is served from a path other than `/`. The process handles `SIGINT` and `SIGTERM` by stopping the HTTP server gracefully. `GET /healthz` is available for health checks.

Deploy the server behind a TLS-terminating reverse proxy or platform load balancer. HTML responses are revalidated, while hashed files under `assets/` are served with immutable one-year caching.

## Rendering flow

1. `src/server.tsx` renders the HTML document and the React application stream.
2. `@liry-k/ssr-server` injects the stream at `SSR_OUTLET` inside the stable `#root` element.
3. Development injects the Vite client entry directly; production resolves hashed CSS and JavaScript from the manifest.
4. `src/client.ts` hydrates the existing `#root` markup.

`normalize.css` is injected by `HtmlDocument` as a JSX `<style>` element so that normalization is present in the initial HTML before client assets load. Production CSP permits only this exact inline stylesheet through its SHA-256 hash; arbitrary inline styles remain blocked.

Server and client renders must remain deterministic. Request-specific state should be validated, safely serialized into the document, and passed to both renders rather than being recreated independently in the browser.

## Current limitation

React Suspense can stream replacement instructions after the initial shell, but Vite module scripts normally execute after the document stream finishes. Supporting early selective hydration requires ordered async scripts and is outside this example's current scope.
