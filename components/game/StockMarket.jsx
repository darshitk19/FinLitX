// components/game/StockMarket.jsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Text } from '@react-three/drei';

export default function StockMarket({ position, onClick, isActive }) {
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
        args={[4, 5, 4]} 
        position={[0, 2.5, 0]}
      >
        <meshStandardMaterial 
          color={isActive ? "#66bb66" : "#44aa44"} 
          metalness={0.7} 
          roughness={0.2}
        />
      </Box>
      
      {/* Windows */}
      <group>
        {[...Array(3)].map((_, i) => (
          <group key={i} position={[0, i * 1.2 + 1, 0]}>
            {[...Array(4)].map((_, j) => (
              <Box 
                key={j} 
                args={[0.6, 0.6, 0.1]} 
                position={[
                  (j % 2 === 0 ? -1 : 1) * 1.2,
                  0,
                  (j < 2 ? -1 : 1) * 1.2
                ]}
              >
                <meshStandardMaterial color="#88ccff" metalness={0.5} />
              </Box>
            ))}
          </group>
        ))}
      </group>
      
      {/* Roof */}
      <Box position={[0, 5.5, 0]} args={[2, 0.5, 2]}>
        <meshStandardMaterial color="#338833" />
      </Box>
      
      {/* Antenna */}
      <mesh position={[0, 6.5, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 2, 8]} />
        <meshStandardMaterial color="#999999" />
      </mesh>
      
      {/* Sign */}
      <group position={[0, 3.5, 2.1]}>
        <Text
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          fontSize={0.4}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          STOCK MARKET
        </Text>
      </group>
    </group>
  );
}