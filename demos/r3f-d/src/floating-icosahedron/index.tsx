import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';

const FloatingIcosahedron = () => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (mesh === null) {
      return;
    }
    mesh.rotation.x += delta * 0.65;
    mesh.rotation.y -= delta * 0.85;
    mesh.position.y = 0.95 + Math.sin(state.clock.elapsedTime * 1.35 + 3.1) * 0.25;
  });

  return (
    <mesh ref={meshRef} position={[1.1, 0.95, 1.35]} castShadow>
      <icosahedronGeometry args={[0.36, 0]} />
      <meshStandardMaterial
        color='#a3e635'
        metalness={0.55}
        roughness={0.22}
        envMapIntensity={1.8}
        emissive='#3f6212'
        emissiveIntensity={0.45}
      />
    </mesh>
  );
};

export default FloatingIcosahedron;
