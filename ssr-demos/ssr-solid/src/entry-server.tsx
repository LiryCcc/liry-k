import { renderToString } from 'solid-js/web';
import App from './app';

export function render(_url: string) {
  const html = renderToString(() => <App />);
  return { html };
}
