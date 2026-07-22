import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';

const MatteSphere = () => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (mesh === null) {
      return;
    }
    mesh.rotation.x += delta * 0.12;
    mesh.position.y = 0.7 + Math.sin(state.clock.elapsedTime * 0.7 + 1.8) * 0.1;
  });

  return (
    <mesh ref={meshRef} position={[2.45, 0.7, 0.55]} castShadow receiveShadow>
      <sphereGeometry args={[0.48, 32, 32]} />
      <meshStandardMaterial color='#12141a' metalness={0} roughness={0.98} envMapIntensity={0.02} />
    </mesh>
  );
};

export default MatteSphere;
