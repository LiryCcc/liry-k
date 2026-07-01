import { createRoot } from 'react-dom/client';
import App from './app.js';
import './index.css';

const rootDiv = document.createElement('div');
const main = async () => {
  const root = createRoot(rootDiv);
  root.render(<App />);
  document.body.append(rootDiv);
};

await main();
