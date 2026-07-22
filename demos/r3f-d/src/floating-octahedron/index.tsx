import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';

const FloatingOctahedron = () => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (mesh === null) {
      return;
    }
    mesh.rotation.y += delta * 1.1;
    mesh.rotation.z += delta * 0.4;
    mesh.position.y = 1.7 + Math.sin(state.clock.elapsedTime * 1.8 + 0.6) * 0.35;
  });

  return (
    <mesh ref={meshRef} position={[-0.2, 1.7, -1.4]} castShadow>
      <octahedronGeometry args={[0.4, 0]} />
      <meshStandardMaterial
        color='#f472b6'
        metalness={0.75}
        roughness={0.15}
        envMapIntensity={2}
        emissive='#9d174d'
        emissiveIntensity={0.7}
      />
    </mesh>
  );
};

export default FloatingOctahedron;
