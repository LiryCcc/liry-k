import { Html } from '@react-three/drei';

const HelloText = () => {
  return (
    <Html
      center
      position={[0, 2.55, 0]}
      style={{
        color: '#f8fafc',
        fontSize: '30px',
        fontWeight: 700,
        letterSpacing: '0.04em',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        textShadow: '0 0 18px rgba(255,255,255,0.55), 0 2px 10px rgba(0,0,0,0.9)'
      }}
    >
      Hello World
    </Html>
  );
};

export default HelloText;
