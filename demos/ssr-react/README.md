# React streaming SSR

A production-oriented React 19 streaming SSR example powered by Vite and the workspace `@liry-k/ssr-server` package.

## Development

```bash
pnpm dev
```

The development server uses Vite in middleware mode, including SSR module loading, transforms, and React Fast Refresh.

## Routes

- `/`: the server-rendered counter example.
- `/about`: an overview of the project and its technology stack.
- `/settings`: light, dark, and system color-theme controls.

TanStack Router owns a shared root layout with the site navigation and an `Outlet` for each page. The server creates a new memory-history router for every request, while the browser creates its own history-backed router before hydration. Direct requests and client-side navigation therefore use the same route tree.

The theme provider lives in the root layout, so the selected mode is preserved while navigating between pages. System mode is implemented with `prefers-color-scheme`, which keeps the initial server HTML deterministic and prevents a hydration mismatch.

## End-to-end tests

Install the Chromium build used by Playwright once, then run the suite:

```bash
pnpm exec playwright install --no-shell chromium
pnpm test:e2e
```

All E2E configuration, tests, TypeScript settings, and ignored test artifacts live under `e2e/`. The suite builds the production client and server, starts the SSR server automatically, and covers server rendering without JavaScript, client-side routing, hydration, theme switching, and HTTP 404 behavior.

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

1. `src/server.tsx` creates a request-scoped router, loads the requested URL, and renders the HTML document and React application stream.
2. `@liry-k/ssr-server` injects the stream at `SSR_OUTLET` inside the stable `#root` element.
3. Development injects the Vite client entry directly; production resolves hashed CSS and JavaScript from the manifest.
4. `src/client.ts` loads the browser router and hydrates the existing `#root` markup.

`normalize.css` and the application stylesheet are injected by `HtmlDocument` as a JSX `<style>` element, so all above-the-fold styling is available before the body is parsed and no client-side style injection is required. Production CSP permits only this exact inline stylesheet through its SHA-256 hash; arbitrary inline styles remain blocked.

Server and client renders must remain deterministic. Request-specific state should be validated, safely serialized into the document, and passed to both renders rather than being recreated independently in the browser.

## Current limitation

React Suspense can stream replacement instructions after the initial shell, but Vite module scripts normally execute after the document stream finishes. Supporting early selective hydration requires ordered async scripts and is outside this example's current scope.
