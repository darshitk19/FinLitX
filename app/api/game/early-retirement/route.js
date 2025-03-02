// app/api/game/early-retirement/route.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { 
  calculateRetirementMetrics,
  simulateInvestment,
  diversifyPortfolio
} from '@/lib/game-logic/early-retirement';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    await connectToDatabase();
    
    const user = await User.findOne({ email: session.user.email });
    
    if (!user || !user.gameState || user.gameState.currentPath !== 'early-retirement') {
      return NextResponse.json({ error: 'Early Retirement game not started' }, { status: 404 });
    }
    
    // Calculate retirement metrics
    const financialData = {
      age: user.gameState.age || 30,
      currentSavings: user.gameState.savings || 0,
      monthlyExpenses: user.gameState.expenses?.reduce((sum, exp) => sum + (exp.recurring ? exp.amount : 0), 0) || 0,
      monthlyIncome: user.gameState.salary || 0,
      investments: user.gameState.investments || [],
      retirementAge: user.gameState.retirementAge || 65
    };
    
    const retirementMetrics = calculateRetirementMetrics(financialData);
    
    return NextResponse.json({
      ...user.gameState,
      retirementMetrics
    });
  } catch (error) {
    console.error('Error fetching retirement data:', error);
    return NextResponse.json({ error: 'Failed to fetch game data' }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const data = await request.json();
    const { action, payload } = data;
    
    await connectToDatabase();
    
    const user = await User.findOne({ email: session.user.email });
    
    if (!user || !user.gameState || user.gameState.currentPath !== 'early-retirement') {
      return NextResponse.json({ error: 'Early Retirement game not started' }, { status: 404 });
    }
    
    let updatedGameState = { ...user.gameState };
    
    switch (action) {
      case 'make-investment':
        updatedGameState.savings = (updatedGameState.savings || 0) - payload.amount;
        updatedGameState.investments = [...(updatedGameState.investments || []), {
          type: payload.type,
          amount: payload.amount,
          purchaseDate: new Date(),
          expectedReturn: payload.expectedReturn
        }];
        break;
        
      case 'sell-investment':
        const investment = updatedGameState.investments[payload.index];
        // Calculate return based on time held and expected return
        const monthsHeld = (new Date() - new Date(investment.purchaseDate)) / (1000 * 60 * 60 * 24 * 30);
        const annualizedReturn = investment.expectedReturn;
        const totalReturn = investment.amount * (1 + (annualizedReturn * (monthsHeld / 12)));
        
        updatedGameState.savings = (updatedGameState.savings || 0) + totalReturn;
        updatedGameState.investments = updatedGameState.investments.filter((_, index) => index !== payload.index);
        break;
        
      case 'change-job':
        updatedGameState.salary = payload.newSalary;
        updatedGameState.jobTitle = payload.jobTitle;
        break;
        
      case 'add-expense':
        updatedGameState.expenses = [...(updatedGameState.expenses || []), {
          ...payload,
          amount: parseFloat(payload.amount)
        }];
        break;
        
      case 'remove-expense':
        updatedGameState.expenses = updatedGameState.expenses.filter(
          (_, index) => index !== payload.index
        );
        break;
        
      case 'set-retirement-age':
        updatedGameState.retirementAge = payload.age;
        break;
        
      case 'advance-month':
        // Process monthly income
        const monthlySalary = updatedGameState.salary || 0;
        
        // Process monthly expenses
        const monthlyExpenses = (updatedGameState.expenses || [])
          .filter(exp => exp.recurring)
          .reduce((sum, exp) => sum + exp.amount, 0);
        
        // Update savings
        updatedGameState.savings = (updatedGameState.savings || 0) + monthlySalary - monthlyExpenses;
        
        // Update investments
        updatedGameState.investments = (updatedGameState.investments || []).map(investment => {
          // Apply monthly growth
          const monthlyReturn = investment.expectedReturn / 12;
          return {
            ...investment,
            amount: investment.amount * (1 + monthlyReturn)
          };
        });
        
        // Simulate market fluctuations (random factor between -5% and +8%)
        const marketFactor = 0.95 + (Math.random() * 0.13);
        updatedGameState.investments = updatedGameState.investments.map(investment => ({
          ...investment,
          amount: investment.amount * marketFactor
        }));
        
        // Increment progress and age
        updatedGameState.progress = (updatedGameState.progress || 0) + 1;
        
        // Every 12 months, increment age
        if (updatedGameState.progress % 12 === 0) {
          updatedGameState.age = (updatedGameState.age || 30) + 1;
        }
        
        break;
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    
    // Update user's game state
    await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { gameState: updatedGameState } }
    );
    
    // Calculate retirement metrics for response
    const financialData = {
      age: updatedGameState.age || 30,
      currentSavings: updatedGameState.savings || 0,
      monthlyExpenses: updatedGameState.expenses?.reduce((sum, exp) => sum + (exp.recurring ? exp.amount : 0), 0) || 0,
      monthlyIncome: updatedGameState.salary || 0,
      investments: updatedGameState.investments || [],
      retirementAge: updatedGameState.retirementAge || 65
    };
    
    const retirementMetrics = calculateRetirementMetrics(financialData);
    
    return NextResponse.json({
      ...updatedGameState,
      retirementMetrics
    });
  } catch (error) {
    console.error('Error updating retirement data:', error);
    return NextResponse.json({ error: 'Failed to update game data' }, { status: 500 });
  }
}