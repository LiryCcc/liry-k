import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';

const MatteCylinder = () => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (mesh === null) {
      return;
    }
    mesh.rotation.z += delta * 0.18;
    mesh.position.y = 0.55 + Math.sin(state.clock.elapsedTime * 0.6 + 2.6) * 0.09;
  });

  return (
    <mesh ref={meshRef} position={[2.1, 0.55, -1.55]} castShadow receiveShadow rotation={[0.6, 0.2, 0.4]}>
      <cylinderGeometry args={[0.28, 0.28, 0.85, 32]} />
      <meshStandardMaterial color='#0a0c10' metalness={0} roughness={1} envMapIntensity={0} />
    </mesh>
  );
};

export default MatteCylinder;
