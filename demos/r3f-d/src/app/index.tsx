import FullscreenButton from '@/fullscreen-button/index.js';
import Scene from '@/scene/index.js';
import { Canvas } from '@react-three/fiber';
import { StrictMode } from 'react';
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three';
import styles from './index.module.css';

const App = () => {
  const shellClassName = styles['shell'];
  const canvasClassName = styles['canvas'];
  if (shellClassName === undefined || canvasClassName === undefined) {
    throw new Error('Missing CSS module class for app shell');
  }

  return (
    <StrictMode>
      <div className={shellClassName}>
        <FullscreenButton />
        <Canvas
          className={canvasClassName}
          shadows
          camera={{ position: [3.2, 2.4, 3.6], fov: 42 }}
          gl={{
            antialias: true,
            toneMapping: ACESFilmicToneMapping,
            toneMappingExposure: 0.78,
            outputColorSpace: SRGBColorSpace
          }}
        >
          <Scene />
        </Canvas>
      </div>
    </StrictMode>
  );
};

export default App;
