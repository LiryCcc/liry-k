import { render } from 'solid-js/web';

import App from './app.js';
import { applyColorScheme, resolveColorScheme } from './color-scheme.js';
import './index.css';
import './setup-material-web.js';

applyColorScheme(resolveColorScheme());

const root = document.createElement('div');

document.body.appendChild(root);
render(App, root);
