/* @refresh reload */
import App from '@/app.js';
import '@/index.css';
import { init } from '@/init.js';
import { render } from 'solid-js/web';

const root = document.createElement('div');

const main = async () => {
  await init();
  render(App, root);
  document.body.append(root);
};

await main();
