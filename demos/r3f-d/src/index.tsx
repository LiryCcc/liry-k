import { createRoot } from 'react-dom/client';
import App from './app.js';
import './index.css';

const rootDiv = document.createElement('div');
const root = createRoot(rootDiv);
const main = async () => {
  root.render(<App />);
  document.body.appendChild(rootDiv);
};

await main();
