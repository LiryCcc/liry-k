import { generateHydrationScript, renderToString } from 'solid-js/web';
import App from './app.js';
import HtmlDocument from './html-document.js';

export const render = () => {
  const document = `<!DOCTYPE html>${renderToString(() => <HtmlDocument />)}`;
  const html = renderToString(App);
  return { document, html, head: generateHydrationScript() };
};
