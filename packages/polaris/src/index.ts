import { render } from 'solid-js/web';
import App from './app.js';
import './index.css';
import s from './index.module.css';

const main = async () => {
  const root = document.createElement('div');
  render(App, root);
  root.className = s['root'] ?? '';
  document.body.append(root);
};

await main();
