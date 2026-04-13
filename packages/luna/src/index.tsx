/* @refresh reload */
import { RouterProvider } from '@tanstack/solid-router';
import { render } from 'solid-js/web';
import './index.css';
import router from './routes.js';

const root = document.createElement('div');

render(() => <RouterProvider router={router} />, root);

document.body.append(root);
