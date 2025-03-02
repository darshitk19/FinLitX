// components/game/Roads.jsx
import { useRef } from 'react';

export default function Roads() {
  const materialRef = useRef();
  
  return (
    <group>
      {/* Main roads */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[3, 40]} />
        <meshStandardMaterial ref={materialRef} color="#555555" />
      </mesh>
      
      <mesh rotation={[-Math.PI / 2, Math.PI / 2, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[3, 40]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
      
      {/* Road markings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <planeGeometry args={[0.1, 40]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      <mesh rotation={[-Math.PI / 2, Math.PI / 2, 0]} position={[0, 0.03, 0]}>
        <planeGeometry args={[0.1, 40]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Crossroads */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <circleGeometry args={[2, 32]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
    </group>
  );
}