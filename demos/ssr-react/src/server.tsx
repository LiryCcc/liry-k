import { createHash } from 'node:crypto';
import { StrictMode } from 'react';
import { renderToReadableStream, renderToString } from 'react-dom/server';
import App from './app.js';
import HtmlDocument from './html-document.js';
import { NORMALIZE_CSS } from './normalize-css.js';

const NORMALIZE_CSS_HASH = createHash('sha256').update(NORMALIZE_CSS).digest('base64');

const HTML_HEADERS = {
  'Cache-Control': 'no-cache',
  ...(import.meta.env.PROD
    ? {
        'Content-Security-Policy': `default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; img-src 'self' data:; style-src 'self' 'sha256-${NORMALIZE_CSS_HASH}'; script-src 'self'; connect-src 'self'`,
        'Permissions-Policy': 'camera=(), geolocation=(), microphone=()',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY'
      }
    : {})
};

export const render = async () => {
  const document = `<!DOCTYPE html>${renderToString(<HtmlDocument />)}`;
  const stream = await renderToReadableStream(
    <StrictMode>
      <App />
    </StrictMode>
  );
  return {
    document,
    headers: HTML_HEADERS,
    stream
  };
};
