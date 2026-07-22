import SpinningBox from '@/spinning-box/index.js';
import { ContactShadows, Environment, OrbitControls, Text } from '@react-three/drei';

const Scene = () => {
  return (
    <>
      <Environment preset='city' background backgroundBlurriness={0.35} environmentIntensity={1} />
      <ambientLight intensity={0.15} />
      <directionalLight position={[4, 6, 3]} intensity={0.85} castShadow />
      <SpinningBox />
      <Text position={[0, 1.4, 0]} fontSize={0.35} color='#f8fafc' anchorX='center' anchorY='middle'>
        Hello World
      </Text>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color='#1e293b' metalness={0.6} roughness={0.25} envMapIntensity={0.9} />
      </mesh>
      <ContactShadows position={[0, -0.49, 0]} opacity={0.55} scale={8} blur={2.2} far={4} />
      <OrbitControls enableDamping makeDefault />
    </>
  );
};

export default Scene;
