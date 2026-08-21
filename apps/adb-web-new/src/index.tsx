import { createRoot } from 'react-dom/client';
import App from './app.js';
import './index.css';
import { init } from './init.js';

const rootDiv = document.createElement('div');
const main = async () => {
  await init();
  const root = createRoot(rootDiv);
  root.render(<App />);
  document.body.append(rootDiv);
};

await main();
