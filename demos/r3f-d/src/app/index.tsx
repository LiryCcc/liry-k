import Scene from '@/scene/index.js';
import { Canvas } from '@react-three/fiber';
import { StrictMode } from 'react';
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three';

const App = () => {
  return (
    <StrictMode>
      <Canvas
        camera={{ position: [2.4, 1.8, 2.4], fov: 50 }}
        gl={{
          antialias: true,
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
          outputColorSpace: SRGBColorSpace
        }}
      >
        <Scene />
      </Canvas>
    </StrictMode>
  );
};

export default App;
