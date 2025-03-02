// lib/game-logic/early-retirement.js
export const calculateRetirementMetrics = (financialData) => {
    const {
      age,
      currentSavings,
      monthlyExpenses,
      monthlyIncome,
      investments,
      retirementAge
    } = financialData;
    
    // Calculate savings rate
    const savingsRate = ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100;
    
    // Calculate years to retirement based on savings rate
    // Using the 4% rule: 25x annual expenses needed for retirement
    const annualExpenses = monthlyExpenses * 12;
    const targetRetirementSavings = annualExpenses * 25;
    
    // Calculate current portfolio value
    const portfolioValue = currentSavings + investments.reduce((total, investment) => 
      total + investment.amount, 0);
    
    // Calculate monthly savings
    const monthlySavings = monthlyIncome - monthlyExpenses;
    
    // Calculate years to retirement
    // Using simplified compound interest formula
    const averageReturnRate = investments.reduce((total, investment) => 
      total + (investment.amount * investment.expectedReturn), 0) / portfolioValue;
    
    // Simple calculation for years to retirement
    let yearsToRetirement = 0;
    let simulatedPortfolio = portfolioValue;
    
    while (simulatedPortfolio < targetRetirementSavings) {
      simulatedPortfolio = simulatedPortfolio * (1 + averageReturnRate) + (monthlySavings * 12);
      yearsToRetirement++;
      
      // Safety check to prevent infinite loops
      if (yearsToRetirement > 100) break;
    }
    
    // Calculate retirement age
    const projectedRetirementAge = age + yearsToRetirement;
    
    // Calculate retirement income using 4% rule
    const projectedRetirementIncome = targetRetirementSavings * 0.04;
    
    return {
      savingsRate,
      targetRetirementSavings,
      portfolioValue,
      yearsToRetirement,
      projectedRetirementAge,
      projectedRetirementIncome,
      retirementReadiness: (portfolioValue / targetRetirementSavings) * 100
    };
  };
  
  export const simulateInvestment = (investment, years, monthlyContribution = 0) => {
    const { amount, expectedReturn } = investment;
    
    let finalAmount = amount;
    
    for (let i = 0; i < years; i++) {
      finalAmount = finalAmount * (1 + expectedReturn) + (monthlyContribution * 12);
    }
    
    return {
      initialAmount: amount,
      finalAmount,
      growth: finalAmount - amount - (monthlyContribution * 12 * years),
      annualizedReturn: expectedReturn * 100
    };
  };
  
  export const diversifyPortfolio = (currentPortfolio, riskTolerance) => {
    // riskTolerance: 1 (low) to 10 (high)
    
    // Define allocation based on risk tolerance
    const allocation = {
      stocks: Math.min(80, riskTolerance * 8),
      bonds: Math.max(10, 100 - (riskTolerance * 8) - 10),
      alternatives: 10
    };
    
    // Calculate total portfolio value
    const totalValue = currentPortfolio.reduce((total, investment) => 
      total + investment.amount, 0);
    
    // Generate recommended portfolio
    return {
      recommended: {
        stocks: {
          percentage: allocation.stocks,
          amount: totalValue * (allocation.stocks / 100)
        },
        bonds: {
          percentage: allocation.bonds,
          amount: totalValue * (allocation.bonds / 100)
        },
        alternatives: {
          percentage: allocation.alternatives,
          amount: totalValue * (allocation.alternatives / 100)
        }
      },
      current: currentPortfolio.reduce((result, investment) => {
        result[investment.type] = (result[investment.type] || 0) + investment.amount;
        return result;
      }, {})
    };
  };