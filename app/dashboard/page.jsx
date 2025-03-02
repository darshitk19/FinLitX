// app/dashboard/page.jsx (updated)
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showPathSelection, setShowPathSelection] = useState(false);
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
    
    if (status === 'authenticated') {
      // Fetch user's game data
      const fetchGameData = async () => {
        try {
          const response = await fetch('/api/user/game-data');
          if (response.ok) {
            const data = await response.json();
            setGameData(data);
          }
        } catch (error) {
          console.error('Failed to fetch game data:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchGameData();
    }
  }, [status, router]);

  const handleStartGame = () => {
    setShowPathSelection(true);
  };

  const selectPath = async (path) => {
    try {
      const response = await fetch('/api/user/select-path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path }),
      });
      
      if (response.ok) {
        router.push(`/game/${path}`);
      }
    } catch (error) {
      console.error('Failed to select path:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <Image 
                src={session?.user?.image || '/default-avatar.png'} 
                alt="Profile" 
                width={80} 
                height={80} 
                className="rounded-full"
              />
              <div>
                <h1 className="text-2xl font-bold text-black">{session?.user?.name}</h1>
                <p className="text-gray-600">{session?.user?.email}</p>
              </div>
            </div>
          </div>
        </header>
        
        {gameData?.currentPath ? (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 text-black">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6 text-black">
                <h2 className="text-xl font-bold">Your Financial Journey</h2>
                <button
                  onClick={() => router.push(`/game/${gameData.currentPath}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Continue Journey
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Current Path</h3>
                  <p className="text-lg font-bold capitalize">
                    {gameData.currentPath.replace('-', ' ')}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {gameData.currentPath === 'job-saving' 
                      ? 'Master personal finance and build savings'
                      : gameData.currentPath === 'business-typhoon'
                      ? 'Build and grow your business empire'
                      : 'Plan and invest for early retirement'}
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Progress</h3>
                  <p className="text-lg font-bold">
                    Month {gameData.progress || 0}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="h-2 rounded-full bg-green-500"
                      style={{ width: `${Math.min(100, (gameData.progress || 0) * 2)}% `}}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Financial Status</h3>
                  {gameData.currentPath === 'job-saving' && (
                    <p className="text-lg font-bold">
                      ₹{gameData.savings?.toLocaleString() || 0} saved
                    </p>
                  )}
                  {gameData.currentPath === 'business-typhoon' && (
                    <p className="text-lg font-bold">
                      ₹{gameData.businessDetails?.capital?.toLocaleString() || 0} capital
                    </p>
                  )}
                  {gameData.currentPath === 'early-retirement' && (
                    <p className="text-lg font-bold">
                      ₹{((gameData.savings || 0) + 
                         (gameData.investments || []).reduce((sum, inv) => sum + inv.amount, 0))
                        .toLocaleString()} portfolio
                    </p>
                  )}
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-3">Your Achievements</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {generateAchievements(gameData).map((achievement, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg border ${achievement.unlocked ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${achievement.unlocked ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-400'}`}>
                          {achievement.unlocked ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-sm ${achievement.unlocked ? 'text-yellow-800' : 'text-gray-500'}`}>
                          {achievement.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : !showPathSelection ? (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <div className="mt-4 text-center">
                <h2 className="text-xl font-semibold mb-4">Welcome to FinCity</h2>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  Learn financial literacy through an immersive game experience.
                  Manage money, build businesses, or plan for early retirement.
                </p>
                
                <button
                  onClick={handleStartGame}
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 transition transform hover:scale-105"
                >
                  Start Your Journey
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition hover:scale-105"
              onClick={() => selectPath('job-saving')}
            >
              <div className="h-48 bg-blue-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Job Saving</h3>
                <p className="text-gray-600">
                  Master personal finance with a salary between ₹10,000 and ₹2,50,000. 
                  Learn to save 10-20% while managing expenses and EMIs.
                </p>
              </div>
            </div>
            
            <div 
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition hover:scale-105"
              onClick={() => selectPath('business-typhoon')}
            >
              <div className="h-48 bg-green-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Business Typhoon</h3>
                <p className="text-gray-600">
                  Start with ₹1 crore investment and build your business empire. 
                  Manage supply chains, employees, taxes, and competition.
                </p>
              </div>
            </div>
            
            <div 
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition hover:scale-105"
              onClick={() => selectPath('early-retirement')}
            >
              <div className="h-48 bg-purple-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Early Retirement</h3>
                <p className="text-gray-600">
                  Develop smart investment strategies in fluctuating markets. 
                  Plan for early retirement through long-term financial planning.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to generate achievements based on game data
function generateAchievements(gameData) {
  const achievements = [];
  
  if (gameData.currentPath === 'job-saving') {
    achievements.push(
      { name: 'First Saver', unlocked: gameData.savings > 0 },
      { name: '10% Saver', unlocked: gameData.savings >= gameData.salary * 0.1 },
      { name: '20% Saver', unlocked: gameData.savings >= gameData.salary * 0.2 },
      { name: 'Emergency Fund', unlocked: gameData.savings >= gameData.salary * 6 },
      { name: 'Debt Manager', unlocked: gameData.loans && gameData.loans.some(loan => loan.remainingAmount === 0) },
      { name: 'Budget Master', unlocked: gameData.expenses && gameData.expenses.length >= 5 },
      { name: '6-Month Milestone', unlocked: gameData.progress >= 6 },
      { name: '1-Year Journey', unlocked: gameData.progress >= 12 }
    );
  } else if (gameData.currentPath === 'business-typhoon') {
    achievements.push(
      { name: 'Business Founder', unlocked: true },
      { name: 'First Profit', unlocked: gameData.businessDetails && (gameData.businessDetails.revenue > gameData.businessDetails.expenses) },
      { name: 'Team Builder', unlocked: gameData.businessDetails && gameData.businessDetails.employees >= 5 },
      { name: 'Market Player', unlocked: gameData.businessDetails && gameData.businessDetails.marketShare >= 5 },
      { name: 'Inventory Manager', unlocked: gameData.businessDetails && gameData.businessDetails.inventory >= 50 },
      { name: 'Capital Growth', unlocked: gameData.businessDetails && gameData.businessDetails.capital >= 15000000 },
      { name: '6-Month Milestone', unlocked: gameData.progress >= 6 },
      { name: '1-Year Journey', unlocked: gameData.progress >= 12 }
    );
  } else if (gameData.currentPath === 'early-retirement') {
    const portfolioValue = (gameData.savings || 0) + (gameData.investments || []).reduce((sum, inv) => sum + inv.amount, 0);
    
    achievements.push(
      { name: 'First Investment', unlocked: gameData.investments && gameData.investments.length > 0 },
      { name: 'Diversified Portfolio', unlocked: gameData.investments && 
        new Set(gameData.investments.map(inv => inv.type)).size >= 3 },
      { name: '₹5 Lakh Portfolio', unlocked: portfolioValue >= 500000 },
      { name: '₹25 Lakh Portfolio', unlocked: portfolioValue >= 2500000 },
      { name: '40% Savings Rate', unlocked: gameData.salary && gameData.expenses && 
        ((gameData.salary - gameData.expenses.filter(exp => exp.recurring).reduce((sum, exp) => sum + exp.amount, 0)) / gameData.salary) >= 0.4 },
      { name: 'On Track to Retire', unlocked: gameData.retirementMetrics && 
        gameData.retirementMetrics.projectedRetirementAge <= gameData.retirementAge },
      { name: '6-Month Milestone', unlocked: gameData.progress >= 6 },
      { name: '1-Year Journey', unlocked: gameData.progress >= 12 }
    );
  }
  
  return achievements;
}