import router from '@/routes.js';
import { RouterProvider } from '@tanstack/solid-router';

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
