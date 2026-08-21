/* @refresh reload */
import App from '@/app.js';
import '@/index.css';
import { init } from '@/init.js';
import { render } from 'solid-js/web';
import s from './index.module.css';

const root = document.createElement('div');
root.className = s['root'] ?? '';

const main = async () => {
  await init();
  render(App, root);
  document.body.append(root);
};

await main();
