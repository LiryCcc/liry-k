import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';

const MatteTorusKnot = () => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (mesh === null) {
      return;
    }
    mesh.rotation.y += delta * 0.22;
    mesh.rotation.z -= delta * 0.1;
    mesh.position.y = 0.45 + Math.sin(state.clock.elapsedTime * 0.65 + 5.1) * 0.1;
  });

  return (
    <mesh ref={meshRef} position={[0.15, 0.45, -2.15]} castShadow receiveShadow>
      <torusKnotGeometry args={[0.28, 0.08, 96, 16]} />
      <meshStandardMaterial color='#0d0f14' metalness={0} roughness={0.99} envMapIntensity={0} />
    </mesh>
  );
};

export default MatteTorusKnot;
