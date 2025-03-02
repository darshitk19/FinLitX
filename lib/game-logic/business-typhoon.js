// lib/game-logic/business-typhoon.js
export const calculateBusinessMetrics = (business) => {
    const {
      capital,
      employees,
      revenue,
      expenses,
      inventory,
      marketShare,
      competitors
    } = business;
    
    // Calculate profit
    const profit = revenue - expenses;
    
    // Calculate ROI (Return on Investment)
    const roi = (profit / capital) * 100;
    
    // Calculate revenue per employee
    const revenuePerEmployee = employees > 0 ? revenue / employees : 0;
    
    // Calculate inventory turnover
    const inventoryTurnover = inventory > 0 ? revenue / inventory : 0;
    
    // Calculate competitive position (higher is better)
    const competitivePosition = competitors.reduce((total, competitor) => {
      return total + (marketShare / competitor.marketShare);
    }, 0) / competitors.length;
    
    return {
      profit,
      roi,
      revenuePerEmployee,
      inventoryTurnover,
      competitivePosition
    };
  };
  
  export const simulateMarketChange = (business, marketTrend) => {
    // marketTrend ranges from -10 (severe downturn) to +10 (boom)
    
    // Adjust revenue based on market trend and competitive position
    const revenueAdjustment = marketTrend * (business.marketShare / 100) * 
                              (business.innovation / 10) * business.revenue * 0.1;
    
    // Adjust expenses based on market conditions
    const expenseAdjustment = marketTrend < 0 
      ? business.expenses * (Math.abs(marketTrend) / 100) // Increased costs during downturn
      : 0;
    
    return {
      ...business,
      revenue: business.revenue + revenueAdjustment,
      expenses: business.expenses + expenseAdjustment,
    };
  };
  
  export const calculateTaxLiability = (business) => {
    const { revenue, expenses, deductions } = business;
    
    // Calculate taxable income
    const taxableIncome = revenue - expenses - deductions;
    
    // Apply tax rate (simplified)
    const taxRate = 0.25; // 25% corporate tax
    const taxLiability = Math.max(0, taxableIncome * taxRate);
    
    return {
      taxableIncome,
      taxLiability,
      effectiveTaxRate: taxableIncome > 0 ? (taxLiability / taxableIncome) * 100 : 0
    };
  };
  
  export const simulateBusinessDecision = (business, decision) => {
    switch (decision.type) {
      case 'hire':
        return {
          ...business,
          employees: business.employees + decision.count,
          expenses: business.expenses + (decision.count * decision.salary),
          productivity: business.productivity + (decision.count * decision.productivity)
        };
        
      case 'invest':
        return {
          ...business,
          capital: business.capital - decision.amount,
          assets: business.assets + decision.amount,
          innovation: business.innovation + decision.innovationBoost
        };
        
      case 'expand':
        return {
          ...business,
          capital: business.capital - decision.cost,
          marketShare: business.marketShare + decision.marketShareGain,
          expenses: business.expenses + decision.operatingCost
        };
        
      default:
        return business;
    }
  };