import { createAppRouter } from '@/routes.js';
import { ROOT_ID } from '@/ssr-constants.js';
import { RouterProvider } from '@tanstack/react-router';
import { createElement, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';

const root = document.getElementById(ROOT_ID);
if (root === null) {
  throw new Error(`SSR root element "#${ROOT_ID}" was not found`);
}

const router = createAppRouter();
await router.load();

hydrateRoot(root, createElement(StrictMode, null, createElement(RouterProvider, { router })));
