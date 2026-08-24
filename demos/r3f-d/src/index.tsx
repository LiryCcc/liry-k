import App from '@/app/index.js';
import { createRoot } from 'react-dom/client';
import './index.css';
import styles from './index.module.css';

const rootDiv = document.createElement('div');
const rootClassName = styles['root'];
if (rootClassName === undefined) {
  throw new Error('Missing CSS module class: root');
}
rootDiv.className = rootClassName;
const root = createRoot(rootDiv);
const main = async () => {
  root.render(<App />);
  document.body.append(rootDiv);
};

await main();
