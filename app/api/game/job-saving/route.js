import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { calculateSavings, calculateSavingsPercentage } from '@/lib/game-logic/job-saving';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    await connectToDatabase();
    
    const user = await User.findOne({ email: session.user.email });
    
    if (!user || !user.gameState || user.gameState.currentPath !== 'job-saving') {
      return NextResponse.json({ error: 'Job Saving game not started' }, { status: 404 });
    }
    
    // Calculate additional metrics
    const savings = calculateSavings(user.gameState.salary, user.gameState.expenses || []);
    const savingsPercentage = calculateSavingsPercentage(user.gameState.salary, savings);
    
    return NextResponse.json({
      ...user.gameState,
      calculatedSavings: savings,
      savingsPercentage
    });
  } catch (error) {
    console.error('Error fetching job saving data:', error);
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
    
    if (!user || !user.gameState || user.gameState.currentPath !== 'job-saving') {
      return NextResponse.json({ error: 'Job Saving game not started' }, { status: 404 });
    }
    
    let updatedGameState = { ...user.gameState };
    
    switch (action) {
      case 'add-expense':
        updatedGameState.expenses = [...(updatedGameState.expenses || []), payload];
        break;
        
      case 'remove-expense':
        updatedGameState.expenses = updatedGameState.expenses.filter(
          (_, index) => index !== payload.index
        );
        break;
        
      case 'modify-expense':
        updatedGameState.expenses = updatedGameState.expenses.map((expense, index) => 
          index === payload.index ? payload.expense : expense
        );
        break;
        
      case 'add-savings':
        updatedGameState.savings = (updatedGameState.savings || 0) + payload.amount;
        break;
        
      case 'apply-for-loan':
        updatedGameState.loans = [...(updatedGameState.loans || []), {
          amount: payload.amount,
          interestRate: payload.interestRate,
          term: payload.term,
          remainingAmount: payload.amount,
          monthlyPayment: payload.monthlyPayment,
          startDate: new Date()
        }];
        updatedGameState.savings = (updatedGameState.savings || 0) + payload.amount;
        break;
        
      case 'pay-loan':
        updatedGameState.loans = updatedGameState.loans.map((loan, index) => 
          index === payload.index 
            ? { 
                ...loan, 
                remainingAmount: Math.max(0, loan.remainingAmount - payload.amount) 
              }
            : loan
        );
        updatedGameState.savings = (updatedGameState.savings || 0) - payload.amount;
        break;
        
      case 'advance-month':
        // Process monthly income and expenses
        const monthlySalary = updatedGameState.salary || 0;
        const monthlyExpenses = (updatedGameState.expenses || [])
          .filter(exp => exp.recurring)
          .reduce((sum, exp) => sum + exp.amount, 0);
        
        // Process loan payments
        let totalLoanPayments = 0;
        updatedGameState.loans = (updatedGameState.loans || []).map(loan => {
          if (loan.remainingAmount > 0) {
            const payment = Math.min(loan.monthlyPayment, loan.remainingAmount);
            totalLoanPayments += payment;
            return {
              ...loan,
              remainingAmount: Math.max(0, loan.remainingAmount - payment)
            };
          }
          return loan;
        });
        
        // Update savings
        updatedGameState.savings = (updatedGameState.savings || 0) + 
                                  monthlySalary - 
                                  monthlyExpenses - 
                                  totalLoanPayments;
        
        // Increment progress
        updatedGameState.progress = (updatedGameState.progress || 0) + 1;
        
        break;
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    
    // Update user's game state
    await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { gameState: updatedGameState } }
    );
    
    // Calculate additional metrics for response
    const savings = calculateSavings(updatedGameState.salary, updatedGameState.expenses || []);
    const savingsPercentage = calculateSavingsPercentage(updatedGameState.salary, savings);
    
    return NextResponse.json({
      ...updatedGameState,
      calculatedSavings: savings,
      savingsPercentage
    });
  } catch (error) {
    console.error('Error updating job saving data:', error);
    return NextResponse.json({ error: 'Failed to update game data' }, { status: 500 });
  }
}