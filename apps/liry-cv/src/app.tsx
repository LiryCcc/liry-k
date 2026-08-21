import { StrictMode } from 'react';
import LiryProvider from './provider.js';

const App = () => {
  return (
    <StrictMode>
      <LiryProvider>{null}</LiryProvider>
    </StrictMode>
  );
};

export default App;
