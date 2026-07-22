import { Environment, Lightformer } from '@react-three/drei';

/**
 * High-contrast procedural environment (no remote HDR fetch).
 * Hot white panels vs deep void for a wider luminance range.
 */
const HdrEnvironment = () => {
  return (
    <Environment resolution={512} environmentIntensity={2.4}>
      <Lightformer intensity={28} position={[0, 9, 0]} scale={[16, 1.4, 1]} form='rect' color='#ffffff' />
      <Lightformer intensity={18} position={[8, 5, 4]} scale={[3.5, 10, 1]} form='rect' color='#fff7ed' />
      <Lightformer intensity={14} position={[-8, 4, -3]} scale={[3, 11, 1]} form='rect' color='#e0f2fe' />
      <Lightformer intensity={12} position={[0, 3, 9]} scale={[6, 6, 1]} form='ring' color='#fef08a' />
      <Lightformer intensity={10} position={[3, 1, -8]} scale={[8, 3, 1]} form='rect' color='#ffffff' />
      <Lightformer intensity={0.08} position={[0, -5, 0]} scale={[24, 10, 1]} form='rect' color='#000000' />
    </Environment>
  );
};

export default HdrEnvironment;
