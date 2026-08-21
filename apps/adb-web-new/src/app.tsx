import { LiryProvider } from '@/provider.js';
import router from '@/routes.js';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';

const App = () => {
  return (
    <StrictMode>
      <LiryProvider>
        <RouterProvider router={router} />
      </LiryProvider>
    </StrictMode>
  );
};

export default App;
