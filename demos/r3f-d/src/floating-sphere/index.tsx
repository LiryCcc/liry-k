import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';

const FloatingSphere = () => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (mesh === null) {
      return;
    }
    mesh.rotation.y += delta * 0.5;
    mesh.position.y = 1.15 + Math.sin(state.clock.elapsedTime * 1.6 + 1.2) * 0.28;
  });

  return (
    <mesh ref={meshRef} position={[-1.55, 1.15, 0.35]} castShadow>
      <sphereGeometry args={[0.42, 48, 48]} />
      <meshStandardMaterial
        color='#e2e8f0'
        metalness={1}
        roughness={0.04}
        envMapIntensity={2.8}
        emissive='#94a3b8'
        emissiveIntensity={0.15}
      />
    </mesh>
  );
};

export default FloatingSphere;
