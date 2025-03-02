// components/game/Mall.jsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Text } from '@react-three/drei';

export default function Mall({ position, onClick, isActive }) {
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
      <Box 
        ref={ref}
        args={[6, 3, 4]} 
        position={[0, 1.5, 0]}
      >
        <meshStandardMaterial 
          color={isActive ? "#dd88bb" : "#cc77aa"} 
          metalness={0.3} 
          roughness={0.4}
        />
      </Box>
      
      {/* Glass Dome */}
      <mesh position={[0, 3.5, 0]}>
        <sphereGeometry args={[2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#aaddff" metalness={0.8} roughness={0.2} opacity={0.7} transparent />
      </mesh>
      
      {/* Entrance */}
      <Box position={[0, 0.75, 2.1]} args={[2, 1.5, 0.2]}>
        <meshStandardMaterial color="#aaddff" metalness={0.5} opacity={0.9} transparent />
      </Box>
      
      {/* Store Windows */}
      {[-2, 2].map((x, i) => (
        <Box key={i} position={[x, 0.75, 2]} args={[1.5, 1, 0.1]}>
          <meshStandardMaterial color="#aaddff" metalness={0.3} />
        </Box>
      ))}
      
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
          MALL
        </Text>
      </group>
    </group>
  );
}