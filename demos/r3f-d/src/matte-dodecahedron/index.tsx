import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';

const MatteDodecahedron = () => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (mesh === null) {
      return;
    }
    mesh.rotation.y -= delta * 0.2;
    mesh.rotation.x += delta * 0.08;
    mesh.position.y = 0.9 + Math.sin(state.clock.elapsedTime * 0.5 + 3.5) * 0.12;
  });

  return (
    <mesh ref={meshRef} position={[-2.2, 0.9, -1.7]} castShadow receiveShadow>
      <dodecahedronGeometry args={[0.4, 0]} />
      <meshStandardMaterial color='#151820' metalness={0} roughness={0.96} envMapIntensity={0.03} />
    </mesh>
  );
};

export default MatteDodecahedron;
