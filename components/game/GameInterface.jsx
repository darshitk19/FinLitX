// components/game/GameInterface.jsx
'use client';

import { useState, useEffect } from 'react';
import JobSavingInterface from '../game-paths/JobSaving';
import BusinessTyphoonInterface from '@/components/game-paths/BusinessTyphoon';
import EarlyRetirementInterface from '@/components/game-paths/EarlyRetirement';

function GameInterface({ gamePath, initialGameData }) {
  const [gameData, setGameData] = useState(initialGameData);

  const handleUpdateGameData = (updatedData) => {
    setGameData(updatedData);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      {gamePath === 'job-saving' && (
        <JobSavingInterface gameData={gameData} onUpdate={handleUpdateGameData} />
      )}

      {gamePath === 'business-typhoon' && (
        <BusinessTyphoonInterface gameData={gameData} onUpdate={handleUpdateGameData} />
      )}

      {gamePath === 'early-retirement' && (
        <EarlyRetirementInterface gameData={gameData} onUpdate={handleUpdateGameData} />
      )}
    </div>
  );
}
export default GameInterface;