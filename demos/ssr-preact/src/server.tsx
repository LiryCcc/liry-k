import { render as renderToString } from 'preact-render-to-string';
import { App } from './app.js';
import HtmlDocument from './html-document.js';

export const render = () => {
  const document = `<!DOCTYPE html>${renderToString(<HtmlDocument />)}`;
  const html = renderToString(<App />);
  return { document, html };
};
