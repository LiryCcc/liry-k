import { ErrorDialogProvider } from '@/components/error-dialog';
import '@/index.css';
import { router } from '@/router';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';

export const App = () => (
  <StrictMode>
    <FluentProvider theme={webLightTheme}>
      <ErrorDialogProvider>
        <RouterProvider router={router} />
      </ErrorDialogProvider>
    </FluentProvider>
  </StrictMode>
);
