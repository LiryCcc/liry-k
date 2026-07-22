import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';

const SpinningBox = () => {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (mesh === null) {
      return;
    }
    mesh.rotation.x += delta;
    mesh.rotation.y += delta * 0.6;
  });

  return (
    <mesh ref={meshRef} position={[0, 0.15, 0]} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color='#f97316' metalness={0.85} roughness={0.18} envMapIntensity={1.35} />
    </mesh>
  );
};

export default SpinningBox;
