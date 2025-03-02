// components/game/Industry.jsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Text } from '@react-three/drei';

export default function Industry({ position, onClick, isActive }) {
  const ref = useRef();
  
  useFrame(() => {
    if (isActive) {
      ref.current.scale.y = 1 + Math.sin(Date.now() / 500) * 0.05;
    } else {
      ref.current.scale.y = 1;
    }
  });
  
  return (
    <group position={position} onClick={onClick}>
      {/* Main Building */}
      <Box 
        ref={ref}
        args={[5, 3, 4]} 
        position={[0, 1.5, 0]}
      >
        <meshStandardMaterial 
          color={isActive ? "#aa7744" : "#996633"} 
          metalness={0.4} 
          roughness={0.6}
        />
      </Box>
      
      {/* Chimney */}
      <mesh position={[1.5, 3.5, 0]}>
        <cylinderGeometry args={[0.5, 0.7, 3, 8]} />
        <meshStandardMaterial color="#777777" />
      </mesh>
      
      {/* Factory Roof */}
      <Box position={[0, 3.2, 0]} args={[5.2, 0.4, 4.2]} rotation={[0, 0, 0]}>
        <meshStandardMaterial color="#555555" />
      </Box>
      
      {/* Windows */}
      {[-1.5, 0, 1.5].map((x, i) => (
        <Box key={i} position={[x, 1.5, 2.1]} args={[1, 1, 0.1]}>
          <meshStandardMaterial color="#aaddff" metalness={0.3} />
        </Box>
      ))}
      
      {/* Door */}
      <Box position={[0, 0.6, 2.1]} args={[1, 1.2, 0.1]}>
        <meshStandardMaterial color="#555555" />
      </Box>
      
      {/* Sign */}
      <group position={[0, 2.5, 2.1]}>
        <Text
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          INDUSTRY
        </Text>
      </group>
    </group>
  );
}