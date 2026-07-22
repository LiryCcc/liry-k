import BlazingCore from '@/blazing-core/index.js';
import FloatingCone from '@/floating-cone/index.js';
import FloatingIcosahedron from '@/floating-icosahedron/index.js';
import FloatingOctahedron from '@/floating-octahedron/index.js';
import FloatingSphere from '@/floating-sphere/index.js';
import FloatingTorus from '@/floating-torus/index.js';
import HdrEnvironment from '@/hdr-environment/index.js';
import HelloText from '@/hello-text/index.js';
import MatteBox from '@/matte-box/index.js';
import MatteCylinder from '@/matte-cylinder/index.js';
import MatteDodecahedron from '@/matte-dodecahedron/index.js';
import MatteSphere from '@/matte-sphere/index.js';
import MatteTorusKnot from '@/matte-torus-knot/index.js';
import SpinningBox from '@/spinning-box/index.js';
import { ContactShadows, OrbitControls } from '@react-three/drei';

const Scene = () => {
  return (
    <>
      <color attach='background' args={['#000000']} />
      <fog attach='fog' args={['#000000', 7, 18]} />
      <ambientLight intensity={0.03} />
      <directionalLight
        position={[5, 9, 4]}
        intensity={4.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-4, 2, -5]} intensity={1.8} color='#60a5fa' />
      <spotLight position={[0, 7, 2]} angle={0.32} penumbra={0.4} intensity={12} color='#ffffff' castShadow />
      <pointLight position={[2.2, 0.8, 2]} intensity={3.2} color='#fb923c' distance={6} />
      <pointLight position={[-2.4, 1.2, -1.5]} intensity={2.8} color='#38bdf8' distance={6} />
      <HdrEnvironment />
      <BlazingCore />
      <SpinningBox />
      <FloatingSphere />
      <FloatingTorus />
      <FloatingOctahedron />
      <FloatingIcosahedron />
      <FloatingCone />
      <MatteBox />
      <MatteSphere />
      <MatteCylinder />
      <MatteDodecahedron />
      <MatteTorusKnot />
      <HelloText />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color='#05070f' metalness={0.95} roughness={0.22} envMapIntensity={2.2} />
      </mesh>
      <ContactShadows position={[0, -0.49, 0]} opacity={0.9} scale={14} blur={2.8} far={6} color='#000000' />
      <OrbitControls enableDamping makeDefault minPolarAngle={0.2} maxPolarAngle={Math.PI / 2.05} />
    </>
  );
};

export default Scene;
