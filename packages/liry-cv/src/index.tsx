import { createRoot } from 'react-dom/client';
import App from './app.js';
import './index.css';

const main = async () => {
  const rootDiv = document.createElement('div');
  const reactRoot = createRoot(rootDiv);
  reactRoot.render(<App />);
  document.body.appendChild(rootDiv);
};

await main();
