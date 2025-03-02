// components/game/Bank.jsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Text } from '@react-three/drei';

export default function Bank({ position, onClick, isActive }) {
  const ref = useRef();
  
  useFrame(() => {
    if (isActive && ref.current) {
      ref.current.scale.y = 1 + Math.sin(Date.now() / 500) * 0.05;
    } else if (ref.current) {
      ref.current.scale.y = 1;
    }
  });
  
  return (
    <group position={position} onClick={onClick}>
      <Box 
        ref={ref}
        args={[3, 4, 3]} 
        position={[0, 2, 0]}
      >
        <meshStandardMaterial 
          color={isActive ? "#4d88ff" : "#2266cc"} 
          metalness={0.5} 
          roughness={0.2}
        />
      </Box>
      
      {/* Roof */}
      <mesh position={[0, 4.5, 0]}>
        <coneGeometry args={[2.5, 1.5, 4]} />
        <meshStandardMaterial color="#1a4d99" />
      </mesh>
      
      {/* Steps */}
      <Box position={[0, 0.15, 1.75]} args={[3, 0.3, 0.5]}>
        <meshStandardMaterial color="#aaaaaa" />
      </Box>
      
      {/* Columns */}
      <mesh position={[-1, 1, 1.5]}>
        <cylinderGeometry args={[0.2, 0.2, 2, 8]} />
        <meshStandardMaterial color="#dddddd" />
      </mesh>
      
      <mesh position={[1, 1, 1.5]}>
        <cylinderGeometry args={[0.2, 0.2, 2, 8]} />
        <meshStandardMaterial color="#dddddd" />
      </mesh>
      
      {/* Sign */}
      <group position={[0, 3, 1.6]}>
        <Text
          color="white"
          fontSize={0.5}
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          anchorX="center"
          anchorY="middle"
        >
          BANK
        </Text>
      </group>
    </group>
  );
}