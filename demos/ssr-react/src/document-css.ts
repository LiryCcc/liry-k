import normalizeCss from 'normalize.css?raw';
import appCss from './index.css?raw';

export const DOCUMENT_CSS = `${normalizeCss}\n${appCss}`;
