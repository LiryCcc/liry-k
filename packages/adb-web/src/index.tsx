import { App } from '@/app';
import { createRoot } from 'react-dom/client';

const rootEl = document.createElement('div');
document.body.append(rootEl);

createRoot(rootEl).render(<App />);
