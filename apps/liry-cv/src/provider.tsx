import type { ReactNode } from 'react';
import TProvider from './t-provider.js';

const LiryProvider = ({ children }: { children: ReactNode }) => {
  return <TProvider children={children} />;
};

export default LiryProvider;
