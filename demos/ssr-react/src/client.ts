import { createElement, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './app.js';
import './index.css';
import { ROOT_ID } from './ssr-constants.js';

const root = document.getElementById(ROOT_ID);
if (root === null) {
  throw new Error(`SSR root element "#${ROOT_ID}" was not found`);
}

hydrateRoot(root, createElement(StrictMode, null, createElement(App)));
