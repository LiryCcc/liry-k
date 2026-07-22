import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group, Mesh, PointLight } from 'three';

/**
 * Ultra-bright emissive core — drives HDR highlight response on nearby metals.
 */
const BlazingCore = () => {
  const groupRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const lightRef = useRef<PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const group = groupRef.current;
    const core = coreRef.current;
    const light = lightRef.current;
    if (group === null || core === null || light === null) {
      return;
    }

    group.position.y = 1.85 + Math.sin(t * 1.4) * 0.22;
    group.rotation.y = t * 0.55;

    const pulse = 0.85 + Math.sin(t * 4.2) * 0.15;
    core.scale.setScalar(pulse);
    light.intensity = 55 + Math.sin(t * 4.2) * 18;
  });

  return (
    <group ref={groupRef} position={[0.15, 1.85, 0.9]}>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.28, 64, 64]} />
        <meshBasicMaterial color='#fffef5' toneMapped={false} />
      </mesh>
      <pointLight ref={lightRef} color='#fff7c2' intensity={60} distance={12} decay={2} />
    </group>
  );
};

export default BlazingCore;
