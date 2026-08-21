import { StrictMode } from 'react';
import { renderToReadableStream, renderToString } from 'react-dom/server';
import App from './app.js';
import HtmlDocument from './html-document.js';

export const render = async () => {
  const document = `<!DOCTYPE html>${renderToString(<HtmlDocument />)}`;
  const stream = await renderToReadableStream(
    <StrictMode>
      <App />
    </StrictMode>
  );
  return { document, stream };
};
