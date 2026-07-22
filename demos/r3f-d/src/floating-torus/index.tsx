import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';

const FloatingTorus = () => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (mesh === null) {
      return;
    }
    mesh.rotation.x += delta * 0.8;
    mesh.rotation.z += delta * 0.55;
    mesh.position.y = 1.35 + Math.sin(state.clock.elapsedTime * 1.1 + 2.4) * 0.32;
  });

  return (
    <mesh ref={meshRef} position={[1.65, 1.35, -0.2]} castShadow>
      <torusGeometry args={[0.38, 0.14, 32, 64]} />
      <meshStandardMaterial
        color='#22d3ee'
        metalness={0.9}
        roughness={0.12}
        envMapIntensity={2.4}
        emissive='#0891b2'
        emissiveIntensity={0.55}
      />
    </mesh>
  );
};

export default FloatingTorus;
