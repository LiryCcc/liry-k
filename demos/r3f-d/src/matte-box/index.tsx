import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';

const MatteBox = () => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (mesh === null) {
      return;
    }
    mesh.rotation.y += delta * 0.15;
    mesh.position.y = 0.35 + Math.sin(state.clock.elapsedTime * 0.55 + 0.4) * 0.08;
  });

  return (
    <mesh ref={meshRef} position={[-2.35, 0.35, 1.2]} castShadow receiveShadow>
      <boxGeometry args={[0.7, 0.7, 0.7]} />
      <meshStandardMaterial color='#0b0d12' metalness={0} roughness={1} envMapIntensity={0} />
    </mesh>
  );
};

export default MatteBox;
