import App from '@/app.js';
import '@/index.css';
import s from '@/index.module.css';
import { render } from 'solid-js/web';
import { init } from './init.js';

const main = async () => {
  await init();
  const root = document.createElement('div');

  render(App, root);
  root.className = s['root'] ?? '';
  document.body.append(root);
};

await main();
