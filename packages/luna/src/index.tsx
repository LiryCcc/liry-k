/* @refresh reload */
import { render } from 'solid-js/web';
import App from './app.jsx';
import './index.css';

const root = document.createElement('div');

render(() => <App />, root);

document.body.append(root);
