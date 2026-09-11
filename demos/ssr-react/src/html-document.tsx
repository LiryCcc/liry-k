import { SSR_OUTLET } from '@liry-k/ssr-server';
import { DOCUMENT_CSS } from './document-css.js';
import { PAGE_TITLE, ROOT_ID } from './ssr-constants.js';

const HtmlDocument = () => (
  <html lang='en'>
    <head>
      <meta charSet='UTF-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      <meta name='description' content='React streaming server-side rendering with Vite' />
      <meta name='theme-color' content='#111827' />
      <title>{PAGE_TITLE}</title>
      <style>{DOCUMENT_CSS}</style>
    </head>
    <body>
      <div id={ROOT_ID}>{SSR_OUTLET}</div>
    </body>
  </html>
);

export default HtmlDocument;
