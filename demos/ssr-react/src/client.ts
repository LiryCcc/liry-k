import { createElement, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './app.js';
import './index.css';

const root = document.createElement('div');
const nodes = [...document.body.childNodes];
for (const node of nodes) {
  root.append(node);
}
document.body.append(root);

hydrateRoot(root, createElement(StrictMode, null, createElement(App)));
