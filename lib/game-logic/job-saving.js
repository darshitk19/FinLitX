// lib/game-logic/job-saving.js
export const calculateSavings = (salary, expenses) => {
    const totalExpenses = expenses.reduce((total, expense) => {
      return total + (expense.recurring ? expense.amount : 0);
    }, 0);
    
    return salary - totalExpenses;
  };
  
  export const calculateSavingsPercentage = (salary, savings) => {
    return (savings / salary) * 100;
  };
  
  export const suggestExpenseReduction = (expenses) => {
    // Sort expenses by amount (descending)
    const sortedExpenses = [...expenses].sort((a, b) => b.amount - a.amount);
    
    // Focus on top 3 expenses for reduction
    return sortedExpenses.slice(0, 3).map(expense => {
      const reductionTarget = expense.amount * 0.1; // Suggest 10% reduction
      return {
        category: expense.category,
        currentAmount: expense.amount,
        targetReduction: reductionTarget,
        newAmount: expense.amount - reductionTarget
      };
    });
  };
  
  export const calculateEMI = (principal, rate, tenure) => {
    // Calculate EMI using formula: [P x R x (1+R)^N]/[(1+R)^N-1]
    // P = Principal, R = Rate per month, N = Number of months
    const monthlyRate = rate / (12 * 100);
    const numPayments = tenure * 12;
    
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    return emi;
  };
  
  export const checkFinancialHealth = (salary, savings, expenses, loans) => {
    const savingsPercentage = calculateSavingsPercentage(salary, savings);
    
    // Calculate total EMI payments
    const totalEMI = loans.reduce((total, loan) => total + loan.monthlyPayment, 0);
    const emiToIncomeRatio = (totalEMI / salary) * 100;
    
    // Check emergency fund (should be 3-6 months of expenses)
    const monthlyExpenses = expenses.reduce((total, expense) => {
      return total + (expense.recurring ? expense.amount : 0);
    }, 0);
    const emergencyFundMonths = savings / monthlyExpenses;
    
    return {
      savingsPercentage,
      emiToIncomeRatio,
      emergencyFundMonths,
      status: savingsPercentage >= 20 && emiToIncomeRatio <= 40 && emergencyFundMonths >= 3 
              ? 'Healthy' 
              : savingsPercentage >= 10 && emiToIncomeRatio <= 50 && emergencyFundMonths >= 1
              ? 'Moderate'
              : 'Needs Improvement',
      recommendations: []
    };
  };