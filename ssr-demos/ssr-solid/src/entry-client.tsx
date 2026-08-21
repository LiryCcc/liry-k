/* @refresh reload */
import { hydrate } from 'solid-js/web';
import App from './app';
import './index.css';

hydrate(() => <App />, document.getElementById('root') as HTMLElement);
