import { render } from 'solid-js/web';

import App from './app.js';
import './index.css';

const root = document.createElement('div');

document.body.appendChild(root);
render(App, root);
