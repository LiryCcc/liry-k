import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';

const SpinningBox = () => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (mesh === null) {
      return;
    }
    mesh.rotation.x += delta * 0.7;
    mesh.rotation.y += delta * 0.9;
    mesh.position.y = 0.55 + Math.sin(state.clock.elapsedTime * 1.2) * 0.18;
  });

  return (
    <mesh ref={meshRef} position={[0, 0.55, 0]} castShadow>
      <boxGeometry args={[0.85, 0.85, 0.85]} />
      <meshStandardMaterial
        color='#ff6b1a'
        metalness={0.95}
        roughness={0.08}
        envMapIntensity={2.2}
        emissive='#7c2d12'
        emissiveIntensity={0.25}
      />
    </mesh>
  );
};

export default SpinningBox;
