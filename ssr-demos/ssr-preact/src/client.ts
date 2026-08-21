import { h, hydrate } from 'preact';
import { App } from './app.js';
import './index.css';

const root = document.createElement('div');
const nodes = [...document.body.childNodes];
for (const node of nodes) {
  root.append(node);
}
document.body.append(root);

hydrate(h(App, {}), root);
