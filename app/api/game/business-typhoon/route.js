// app/api/game/business-typhoon/route.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { 
  calculateBusinessMetrics, 
  simulateMarketChange,
  calculateTaxLiability
} from '@/lib/game-logic/business-typhoon';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    await connectToDatabase();
    
    const user = await User.findOne({ email: session.user.email });
    
    if (!user || !user.gameState || user.gameState.currentPath !== 'business-typhoon') {
      return NextResponse.json({ error: 'Business Typhoon game not started' }, { status: 404 });
    }
    
    // Calculate additional business metrics
    const businessMetrics = calculateBusinessMetrics(user.gameState.businessDetails);
    
    return NextResponse.json({
      ...user.gameState,
      businessMetrics
    });
  } catch (error) {
    console.error('Error fetching business data:', error);
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
    
    if (!user || !user.gameState || user.gameState.currentPath !== 'business-typhoon') {
      return NextResponse.json({ error: 'Business Typhoon game not started' }, { status: 404 });
    }
    
    let updatedGameState = { ...user.gameState };
    let businessDetails = { ...updatedGameState.businessDetails };
    
    switch (action) {
      case 'hire-employees':
        businessDetails.employees = (businessDetails.employees || 0) + payload.count;
        businessDetails.expenses = (businessDetails.expenses || 0) + (payload.count * payload.salary);
        businessDetails.capital = (businessDetails.capital || 0) - (payload.count * payload.hiringCost);
        break;
        
      case 'fire-employees':
        businessDetails.employees = Math.max(0, (businessDetails.employees || 0) - payload.count);
        businessDetails.expenses = Math.max(0, (businessDetails.expenses || 0) - (payload.count * payload.salary));
        businessDetails.capital = (businessDetails.capital || 0) - (payload.count * payload.severanceCost);
        break;
        
      case 'invest-marketing':
        businessDetails.capital = (businessDetails.capital || 0) - payload.amount;
        businessDetails.marketingBudget = (businessDetails.marketingBudget || 0) + payload.amount;
        businessDetails.marketShare = (businessDetails.marketShare || 1) + (payload.amount / 1000000); // 1 crore = 1% market share
        break;
        
      case 'purchase-inventory':
        businessDetails.capital = (businessDetails.capital || 0) - payload.cost;
        businessDetails.inventory = (businessDetails.inventory || 0) + payload.quantity;
        break;
        
      case 'sell-products':
        businessDetails.inventory = Math.max(0, (businessDetails.inventory || 0) - payload.quantity);
        businessDetails.revenue = (businessDetails.revenue || 0) + payload.revenue;
        businessDetails.capital = (businessDetails.capital || 0) + payload.revenue;
        break;
        
      case 'take-loan':
        businessDetails.capital = (businessDetails.capital || 0) + payload.amount;
        updatedGameState.loans = [...(updatedGameState.loans || []), {
          amount: payload.amount,
          interestRate: payload.interestRate,
          term: payload.term,
          remainingAmount: payload.amount,
          monthlyPayment: payload.monthlyPayment,
          startDate: new Date()
        }];
        break;
        
      case 'pay-taxes':
        businessDetails.capital = (businessDetails.capital || 0) - payload.amount;
        businessDetails.taxesPaid = (businessDetails.taxesPaid || 0) + payload.amount;
        break;
        
      case 'advance-month':
        // Calculate revenue based on employees, market share, and inventory
        const potentialRevenue = (businessDetails.employees || 0) * 50000 * 
                                 ((businessDetails.marketShare || 1) / 100);
        
        // Limit by inventory
        const actualRevenue = Math.min(
          potentialRevenue,
          (businessDetails.inventory || 0) * 5000
        );
        
        // Update inventory (sold products)
        const soldInventory = Math.min(
          Math.floor(actualRevenue / 5000),
          businessDetails.inventory || 0
        );
        
        // Apply market conditions (random factor between -10% and +20%)
        const marketFactor = 0.9 + (Math.random() * 0.3);
        
        // Calculate final revenue
        const finalRevenue = actualRevenue * marketFactor;
        
        // Update business details
        businessDetails.revenue = (businessDetails.revenue || 0) + finalRevenue;
        businessDetails.capital = (businessDetails.capital || 0) + finalRevenue;
        businessDetails.inventory = (businessDetails.inventory || 0) - soldInventory;
        
        // Process monthly expenses
        businessDetails.capital = (businessDetails.capital || 0) - (businessDetails.expenses || 0);
        
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
        
        businessDetails.capital = (businessDetails.capital || 0) - totalLoanPayments;
        
        // Calculate taxes (simplified)
        const monthlyProfit = finalRevenue - (businessDetails.expenses || 0);
        const taxAmount = Math.max(0, monthlyProfit * 0.25); // 25% tax rate
        
        // Accrue tax liability (paid quarterly)
        businessDetails.taxLiability = (businessDetails.taxLiability || 0) + taxAmount;
        
        // Increment progress
        updatedGameState.progress = (updatedGameState.progress || 0) + 1;
        
        // Every 3 months, pay taxes
        if (updatedGameState.progress % 3 === 0) {
          businessDetails.capital = (businessDetails.capital || 0) - (businessDetails.taxLiability || 0);
          businessDetails.taxesPaid = (businessDetails.taxesPaid || 0) + (businessDetails.taxLiability || 0);
          businessDetails.taxLiability = 0;
        }
        
        break;
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    
    // Update game state with new business details
    updatedGameState.businessDetails = businessDetails;
    
    // Update user's game state
    await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { gameState: updatedGameState } }
    );
    
    // Calculate additional business metrics for response
    const businessMetrics = calculateBusinessMetrics(businessDetails);
    
    return NextResponse.json({
      ...updatedGameState,
      businessMetrics
    });
  } catch (error) {
    console.error('Error updating business data:', error);
    return NextResponse.json({ error: 'Failed to update game data' }, { status: 500 });
  }
}