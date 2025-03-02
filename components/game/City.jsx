// components/game/City.jsx (updated)
'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Environment, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useState, useRef } from 'react';
import Bank from './Bank';
import StockMarket from './StockMarket';
import Mall from './Mall';
import Industry from './Industry';
import FinAI from './FinAI';
import Ground from './Ground';
import Roads from './Roads';
import BuildingInterface from './BuildingInterface';

export default function City({ gamePath, gameData, onOpenInterface }) {
  const [activeBuilding, setActiveBuilding] = useState(null);
  const cameraRef = useRef();
  
  const handleBuildingClick = (building) => {
    setActiveBuilding(building);
    // Camera animation could be added here
  };
  
  return (
    <div className="w-full h-screen">
      <Canvas shadows>
        <PerspectiveCamera
          ref={cameraRef}
          makeDefault
          position={[0, 15, 25]}
          fov={50}
        />
        
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight 
            position={[10, 15, 10]} 
            intensity={1} 
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
          />
          
          <Sky sunPosition={[100, 20, 100]} />
          <Environment preset="city" />
          
          <Ground />
          <Roads />
          
          {/* Buildings */}
          <group>
            <Bank 
              position={[-10, 0, 0]} 
              onClick={() => handleBuildingClick('bank')}
              isActive={activeBuilding === 'bank'}
            />
            <StockMarket 
              position={[10, 0, 0]} 
              onClick={() => handleBuildingClick('stockMarket')}
              isActive={activeBuilding === 'stockMarket'}
            />
            <Mall 
              position={[0, 0, 10]} 
              onClick={() => handleBuildingClick('mall')}
              isActive={activeBuilding === 'mall'}
            />
            <Industry 
              position={[0, 0, -10]} 
              onClick={() => handleBuildingClick('industry')}
              isActive={activeBuilding === 'industry'}
            />
            
            {/* Add decorative elements */}
            <Trees />
          </group>
          
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={10}
            maxDistance={40}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Suspense>
      </Canvas>
      
      {/* Game HUD */}
      <GameHUD 
        gamePath={gamePath} 
        gameData={gameData} 
        onOpenInterface={onOpenInterface} 
      />
      
      {/* FinAI Assistant */}
      <div className="absolute bottom-4 right-4">
        <FinAI gamePath={gamePath} />
      </div>
      
      {/* Building Interface */}
      {activeBuilding && (
        <BuildingInterface 
          building={activeBuilding} 
          gamePath={gamePath}
          gameData={gameData}
          onClose={() => setActiveBuilding(null)}
        />
      )}
    </div>
  );
}

// Simple trees component
function Trees() {
  return (
    <group>
      {[...Array(20)].map((_, i) => {
        const x = Math.random() * 40 - 20;
        const z = Math.random() * 40 - 20;
        
        // Don't place trees on roads or too close to buildings
        if (Math.abs(x) < 5 || Math.abs(z) < 5 || 
            (Math.abs(x) < 12 && Math.abs(z) < 12)) {
          return null;
        }
        
        const scale = 0.5 + Math.random() * 0.5;
        
        return (
          <group key={i} position={[x, 0, z]} scale={[scale, scale, scale]}>
            {/* Tree trunk */}
            <mesh position={[0, 1, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.4, 2, 8]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
            
            {/* Tree foliage */}
            <mesh position={[0, 3, 0]} castShadow>
              <coneGeometry args={[1.5, 3, 8]} />
              <meshStandardMaterial color="#2D4F21" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// Game HUD component
function GameHUD({ gamePath, gameData, onOpenInterface }) {
  const [isMinimized, setIsMinimized] = useState(false);
  
  const getAccentColor = () => {
    switch(gamePath) {
      case 'job-saving': return 'blue';
      case 'business-typhoon': return 'green';
      case 'early-retirement': return 'purple';
      default: return 'blue';
    }
  };
  
  const accentColor = getAccentColor();
  
  return (
    <div className={`absolute top-4 left-4 p-4 bg-white bg-opacity-90 rounded-lg shadow-lg transition-all duration-300 ${isMinimized ? 'w-12 h-12 overflow-hidden' : 'max-w-xs'}`}>
      {isMinimized ? (
        <button 
          onClick={() => setIsMinimized(false)}
          className="w-full h-full flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </button>
      ) : (
        <>
          <div className="flex justify-between items-center mb-3">
            <h2 className={`text-xl font-bold text-${accentColor}-600`}>
              {gamePath === 'job-saving' ? 'Job Saving' : 
               gamePath === 'business-typhoon' ? 'Business Typhoon' : 
               'Early Retirement'}
            </h2>
            <button 
              onClick={() => setIsMinimized(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Add additional content here */}
        </>
      )}
    </div>
  );
}