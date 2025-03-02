// app/game/[path]/page.jsx (updated)
'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import City from '@/components/game/City';
import GameInterface from '@/components/game/GameInterface';

export default function GamePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [gameData, setGameData] = useState(null);
  const [showGameInterface, setShowGameInterface] = useState(false);
  
  const path = params.path;
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
    
    if (status === 'authenticated') {
      // Validate path
      if (!['job-saving', 'business-typhoon', 'early-retirement'].includes(path)) {
        router.push('/dashboard');
        return;
      }
      
      // Fetch game data
      const fetchGameData = async () => {
        try {
          const response = await fetch(`/api/game-state?path=${path}`);
          if (response.ok) {
            const data = await response.json();
            setGameData(data);
          } else {
            // If no game data, redirect to dashboard
            router.push('/dashboard');
          }
        } catch (error) {
          console.error('Error fetching game data:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchGameData();
    }
  }, [status, router, path]);
  
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="relative w-full min-h-screen">
      {showGameInterface ? (
        <div className="pt-16">
          <button 
            onClick={() => setShowGameInterface(false)}
            className="fixed top-4 left-4 z-10 px-4 py-2 bg-white bg-opacity-90 rounded-lg shadow-md flex items-center hover:bg-opacity-100 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to City
          </button>
          
          <GameInterface gamePath={path} initialGameData={gameData} />
        </div>
      ) : (
        <>
          <City 
            gamePath={path} 
            gameData={gameData} 
            onOpenInterface={() => setShowGameInterface(true)} 
          />
          
          <button 
            onClick={() => setShowGameInterface(true)}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-white bg-opacity-90 rounded-lg shadow-lg flex items-center hover:bg-opacity-100 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            Open Financial Dashboard
          </button>
        </>
      )}
    </div>
  );
}