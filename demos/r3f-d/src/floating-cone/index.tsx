import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';

const FloatingCone = () => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (mesh === null) {
      return;
    }
    mesh.rotation.y += delta * 0.95;
    mesh.position.y = 1.5 + Math.sin(state.clock.elapsedTime * 1.45 + 4.2) * 0.3;
  });

  return (
    <mesh ref={meshRef} position={[-1.4, 1.5, -1.1]} castShadow rotation={[0.35, 0, -0.25]}>
      <coneGeometry args={[0.32, 0.7, 32]} />
      <meshStandardMaterial
        color='#facc15'
        metalness={0.85}
        roughness={0.1}
        envMapIntensity={2.5}
        emissive='#854d0e'
        emissiveIntensity={0.6}
      />
    </mesh>
  );
};

export default FloatingCone;
