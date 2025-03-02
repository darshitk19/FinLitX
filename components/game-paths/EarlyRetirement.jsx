// components/game-paths/EarlyRetirement.jsx
'use client';

import { useState, useEffect } from 'react';
import { calculateRetirementMetrics } from '@/lib/game-logic/early-retirement';

export default function EarlyRetirementInterface({ gameData, onUpdate }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdvanceMonth = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/game/early-retirement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'advance-month'
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        onUpdate(updatedData);
      }
    } catch (error) {
      console.error('Failed to advance month:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="flex border-b overflow-x-auto">
        <button
          className={`px-4 py-3 font-medium whitespace-nowrap ${activeTab === 'overview' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`px-4 py-3 font-medium whitespace-nowrap ${activeTab === 'investments' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('investments')}
        >
          Investments
        </button>
        <button
          className={`px-4 py-3 font-medium whitespace-nowrap ${activeTab === 'budget' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('budget')}
        >
          Budget
        </button>
        <button
          className={`px-4 py-3 font-medium whitespace-nowrap ${activeTab === 'career' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('career')}
        >
          Career
        </button>
        <button
          className={`px-4 py-3 font-medium whitespace-nowrap ${activeTab === 'planning' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('planning')}
        >
          Retirement Planning
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'overview' && <OverviewTab gameData={gameData} />}
        {activeTab === 'investments' && <InvestmentsTab gameData={gameData} onUpdate={onUpdate} />}
        {activeTab === 'budget' && <BudgetTab gameData={gameData} onUpdate={onUpdate} />}
        {activeTab === 'career' && <CareerTab gameData={gameData} onUpdate={onUpdate} />}
        {activeTab === 'planning' && <PlanningTab gameData={gameData} onUpdate={onUpdate} />}
      </div>

      <div className="bg-gray-50 p-4 border-t flex justify-between items-center">
        <div>
          <span className="text-sm text-gray-500">Month {gameData?.progress || 1} | Age {gameData?.age || 30}</span>
        </div>
        <button
          onClick={handleAdvanceMonth}
          disabled={isLoading}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>Next Month</>
          )}
        </button>
      </div>
    </div>
  );
}

function OverviewTab({ gameData }) {
  const retirementMetrics = gameData?.retirementMetrics || {};

  // Calculate total portfolio value
  const totalPortfolioValue = (gameData?.savings || 0) +
    (gameData?.investments || []).reduce((sum, inv) => sum + inv.amount, 0);

  // Calculate monthly expenses
  const monthlyExpenses = gameData?.expenses
    ?.filter(exp => exp.recurring)
    ?.reduce((sum, exp) => sum + exp.amount, 0) || 0;

  // Calculate savings rate
  const savingsRate = gameData?.salary
    ? ((gameData.salary - monthlyExpenses) / gameData.salary * 100).toFixed(1)
    : 0;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Financial Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-800 mb-1">Portfolio Value</h3>
          <p className="text-2xl font-bold">₹{totalPortfolioValue.toLocaleString()}</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-1">Monthly Income</h3>
          <p className="text-2xl font-bold">₹{gameData?.salary?.toLocaleString() || 0}</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-800 mb-1">Savings Rate</h3>
          <p className="text-2xl font-bold">{savingsRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-medium mb-3">Retirement Projection</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Current Age:</span>
                <span className="font-medium">{gameData?.age || 30}</span>
              </div>
              <div className="flex justify-between">
                <span>Target Retirement Age:</span>
                <span className="font-medium">{gameData?.retirementAge || 65}</span>
              </div>
              <div className="flex justify-between">
                <span>Projected Retirement Age:</span>
                <span className={`font-medium ${retirementMetrics.projectedRetirementAge < (gameData?.retirementAge || 65)
                    ? 'text-green-600'
                    : 'text-red-600'
                  }`}>
                  {retirementMetrics.projectedRetirementAge || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Years to Retirement:</span>
                <span className="font-medium">{retirementMetrics.yearsToRetirement || 'N/A'}</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <span>Retirement Readiness</span>
                <span>{retirementMetrics.retirementReadiness?.toFixed(1) || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${(retirementMetrics.retirementReadiness || 0) >= 75 ? 'bg-green-500' :
                      (retirementMetrics.retirementReadiness || 0) >= 40 ? 'bg-yellow-500' :
                        'bg-red-500'
                    }`}
                  style={{ width: `${Math.min(100, Math.max(0, retirementMetrics.retirementReadiness || 0))}%` }}

                ></div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">Asset Allocation</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Cash Savings:</span>
                <span className="font-medium">₹{gameData?.savings?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Investments:</span>
                <span className="font-medium">
                  ₹{(gameData?.investments || []).reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Expenses:</span>
                <span className="font-medium">₹{monthlyExpenses.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="h-40 bg-white p-3 rounded border border-gray-200">
                {/* Pie chart would go here in a real implementation */}
                <div className="h-full flex items-center justify-center">
                  <div className="flex space-x-4">
                    {totalPortfolioValue > 0 ? (
                      <>
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs">
                            {((gameData?.savings || 0) / totalPortfolioValue * 100).toFixed(0)}%
                          </div>
                          <span className="text-xs mt-1">Cash</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                            {((gameData?.investments || []).reduce((sum, inv) => sum + inv.amount, 0) / totalPortfolioValue * 100).toFixed(0)}%
                          </div>
                          <span className="text-xs mt-1">Investments</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-500">No portfolio data available</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-3">Financial Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <h4 className="font-medium mb-2">Savings Rate</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Current:</span>
                <span className={`font-medium ${parseFloat(savingsRate) >= 40 ? 'text-green-600' :
                    parseFloat(savingsRate) >= 20 ? 'text-yellow-600' :
                      'text-red-600'
                  }`}>
                  {savingsRate}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Target:</span>
                <span className="font-medium">40%+</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className={`h-2 rounded-full ${parseFloat(savingsRate) >= 40 ? 'bg-green-500' :
                      parseFloat(savingsRate) >= 20 ? 'bg-yellow-500' :
                        'bg-red-500'
                    }`}
                  style={{ width: `${Math.min(100, Math.max(0, parseFloat(savingsRate)))}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <h4 className="font-medium mb-2">Emergency Fund</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Current:</span>
                <span className="font-medium">
                  {monthlyExpenses > 0
                    ? `${((gameData?.savings || 0) / monthlyExpenses).toFixed(1)} months`
                    : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Target:</span>
                <span className="font-medium">6 months</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className={`h-2 rounded-full ${(gameData?.savings || 0) / monthlyExpenses >= 6 ? 'bg-green-500' :
                      (gameData?.savings || 0) / monthlyExpenses >= 3 ? 'bg-yellow-500' :
                        'bg-red-500'
                    }`}
                  style={{ width: `${Math.min(100, ((gameData?.savings || 0) / monthlyExpenses) / 6 * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <h4 className="font-medium mb-2">Investment Rate</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Investments:</span>
                <span className="font-medium">
                  {totalPortfolioValue > 0
                    ? `${(((gameData?.investments || []).reduce((sum, inv) => sum + inv.amount, 0)) / totalPortfolioValue * 100).toFixed(1)}%`
                    : '0%'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Target:</span>
                <span className="font-medium">70%+</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className={`h-2 rounded-full ${(((gameData?.investments || []).reduce((sum, inv) => sum + inv.amount, 0)) / totalPortfolioValue * 100) >= 70 ? 'bg-green-500' :
                      (((gameData?.investments || []).reduce((sum, inv) => sum + inv.amount, 0)) / totalPortfolioValue * 100) >= 40 ? 'bg-yellow-500' :
                        'bg-red-500'
                    }`}
                  style={{ width: `${Math.min(100, (((gameData?.investments || []).reduce((sum, inv) => sum + inv.amount, 0)) / totalPortfolioValue * 100))}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InvestmentsTab({ gameData, onUpdate }) {
  const [isInvesting, setIsInvesting] = useState(false);
  const [investmentPlan, setInvestmentPlan] = useState({
    type: 'stocks',
    amount: '',
    expectedReturn: 0.08
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMakeInvestment = async () => {
    if (!investmentPlan.amount) return;

    const amount = parseFloat(investmentPlan.amount);

    if (amount > (gameData?.savings || 0)) {
      alert("You don't have enough savings for this investment.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/game/early-retirement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'make-investment',
          payload: {
            type: investmentPlan.type,
            amount,
            expectedReturn: investmentPlan.expectedReturn
          }
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        onUpdate(updatedData);
        setInvestmentPlan({
          type: 'stocks',
          amount: '',
          expectedReturn: 0.08
        });
        setIsInvesting(false);
      }
    } catch (error) {
      console.error('Failed to make investment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSellInvestment = async (index) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/game/early-retirement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'sell-investment',
          payload: { index }
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        onUpdate(updatedData);
      }
    } catch (error) {
      console.error('Failed to sell investment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update expected return based on investment type
  useEffect(() => {
    switch (investmentPlan.type) {
      case 'stocks':
        setInvestmentPlan(prev => ({ ...prev, expectedReturn: 0.08 }));
        break;
      case 'bonds':
        setInvestmentPlan(prev => ({ ...prev, expectedReturn: 0.05 }));
        break;
      case 'real_estate':
        setInvestmentPlan(prev => ({ ...prev, expectedReturn: 0.07 }));
        break;
      case 'gold':
        setInvestmentPlan(prev => ({ ...prev, expectedReturn: 0.04 }));
        break;
      case 'index_funds':
        setInvestmentPlan(prev => ({ ...prev, expectedReturn: 0.09 }));
        break;
      default:
        setInvestmentPlan(prev => ({ ...prev, expectedReturn: 0.08 }));
    }
  }, [investmentPlan.type]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Investment Portfolio</h2>
        <button
          onClick={() => setIsInvesting(true)}
          className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
        >
          Make New Investment
        </button>
      </div>

      {isInvesting && (
        <div className="mb-6 p-4 border border-purple-200 rounded-lg bg-purple-50">
          <h3 className="font-medium mb-3">New Investment</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Investment Type</label>
              <select
                value={investmentPlan.type}
                onChange={(e) => setInvestmentPlan({ ...investmentPlan, type: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="stocks">Stocks</option>
                <option value="bonds">Bonds</option>
                <option value="real_estate">Real Estate</option>
                <option value="gold">Gold</option>
                <option value="index_funds">Index Funds</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
              <input
                type="number"
                value={investmentPlan.amount}
                onChange={(e) => setInvestmentPlan({ ...investmentPlan, amount: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Amount"
                min="1000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Annual Return</label>
              <input
                type="text"
                value={`${(investmentPlan.expectedReturn * 100).toFixed(1)}%`}
                disabled
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
          </div>

          <div className="mb-4 p-3 bg-white rounded-lg">
            <h4 className="font-medium mb-2">Investment Summary</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Investment Amount:</span>
                <span className="font-medium ml-2">
                  ₹{investmentPlan.amount ? parseFloat(investmentPlan.amount).toLocaleString() : 0}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Available Savings:</span>
                <span className="font-medium ml-2">₹{gameData?.savings?.toLocaleString() || 0}</span>
              </div>
              <div>
                <span className="text-gray-600">Risk Level:</span>
                <span className="font-medium ml-2">
                  {investmentPlan.type === 'stocks' ? 'High' :
                    investmentPlan.type === 'bonds' ? 'Low' :
                      investmentPlan.type === 'real_estate' ? 'Medium' :
                        investmentPlan.type === 'gold' ? 'Low' :
                          investmentPlan.type === 'index_funds' ? 'Medium' : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Projected Value (10 years):</span>
                <span className="font-medium ml-2">
                  ₹{investmentPlan.amount
                    ? (parseFloat(investmentPlan.amount) * Math.pow(1 + investmentPlan.expectedReturn, 10)).toLocaleString(undefined, { maximumFractionDigits: 0 })
                    : 0}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsInvesting(false)}
              className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleMakeInvestment}
              disabled={
                isSubmitting ||
                !investmentPlan.amount ||
                parseFloat(investmentPlan.amount) <= 0 ||
                parseFloat(investmentPlan.amount) > (gameData?.savings || 0)
              }
              className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 'Invest'}
            </button>
          </div>

          {parseFloat(investmentPlan.amount) > (gameData?.savings || 0) && (
            <div className="mt-2 text-sm text-red-600">
              You don't have enough savings for this investment.
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-medium mb-3">Current Investments</h3>
          {gameData?.investments?.length > 0 ? (
            <div className="space-y-4">
              {gameData.investments.map((investment, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium capitalize">{investment.type.replace('_', ' ')}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(investment.purchaseDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{investment.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                      <p className="text-sm text-gray-600">
                        {(investment.expectedReturn * 100).toFixed(1)}% expected return
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end mt-3">
                    <button
                      onClick={() => handleSellInvestment(index)}
                      disabled={isSubmitting}
                      className="px-2 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
                    >
                      {isSubmitting ? 'Processing...' : 'Sell Investment'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-6 border border-gray-200 rounded-lg bg-gray-50">
              You don't have any investments yet. Click "Make New Investment" to get started.
            </div>
          )}
        </div>

        <div>
          <h3 className="font-medium mb-3">Portfolio Analysis</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Investment Value:</span>
                <span className="font-medium">
                  ₹{(gameData?.investments || [])
                    .reduce((sum, inv) => sum + inv.amount, 0)
                    .toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Average Annual Return:</span>
                <span className="font-medium">
                  {gameData?.investments?.length > 0
                    ? ((gameData.investments.reduce((sum, inv) => sum + (inv.amount * inv.expectedReturn), 0) /
                      gameData.investments.reduce((sum, inv) => sum + inv.amount, 0)) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Risk Profile:</span>
                <span className="font-medium">
                  {gameData?.investments?.length === 0 ? 'N/A' :
                    gameData.investments.some(inv => inv.type === 'stocks' || inv.type === 'real_estate') &&
                      gameData.investments.some(inv => inv.type === 'bonds' || inv.type === 'gold')
                      ? 'Balanced'
                      : gameData.investments.every(inv => ['stocks', 'real_estate'].includes(inv.type))
                        ? 'Aggressive'
                        : 'Conservative'}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Asset Allocation</h4>
              <div className="h-40 bg-white p-3 rounded border border-gray-200">
                {/* Asset allocation chart would go here in a real implementation */}
                <div className="h-full flex flex-col justify-center">
                  {gameData?.investments?.length > 0 ? (
                    <div className="space-y-2">
                      {['stocks', 'bonds', 'real_estate', 'gold', 'index_funds'].map(type => {
                        const typeInvestments = gameData.investments.filter(inv => inv.type === type);
                        const typeValue = typeInvestments.reduce((sum, inv) => sum + inv.amount, 0);
                        const totalValue = gameData.investments.reduce((sum, inv) => sum + inv.amount, 0);
                        const percentage = (typeValue / totalValue) * 100;

                        if (percentage <= 0) return null;

                        return (
                          <div key={type}>
                            <div className="flex justify-between text-xs">
                              <span className="capitalize">{type.replace('_', ' ')}</span>
                              <span>{percentage.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${type === 'stocks' ? 'bg-blue-500' :
                                    type === 'bonds' ? 'bg-green-500' :
                                      type === 'real_estate' ? 'bg-yellow-500' :
                                        type === 'gold' ? 'bg-yellow-600' :
                                          'bg-purple-500'
                                  }`}
                                style={`{ width: ${percentage}% }`}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">No investments to analyze</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2 text-yellow-800">Investment Tips</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-yellow-800">
          <li>Diversify your portfolio across different asset classes to manage risk</li>
          <li>For early retirement, aim for a higher allocation to growth assets like stocks and index funds</li>
          <li>Regularly rebalance your portfolio to maintain your target asset allocation</li>
          <li>Consider your investment time horizon - the longer your horizon, the more risk you can afford to take</li>
        </ul>
      </div>
    </div>
  );
}

function BudgetTab({ gameData, onUpdate }) {
  const [expenses, setExpenses] = useState(gameData?.expenses || []);
  const [newExpense, setNewExpense] = useState({
    category: '',
    amount: '',
    recurring: true
  });
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setExpenses(gameData?.expenses || []);
  }, [gameData]);

  const handleAddExpense = async () => {
    if (!newExpense.category || !newExpense.amount) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/game/early-retirement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add-expense',
          payload: {
            ...newExpense,
            amount: parseFloat(newExpense.amount)
          }
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        onUpdate(updatedData);
        setNewExpense({
          category: '',
          amount: '',
          recurring: true
        });
        setIsAdding(false);
      }
    } catch (error) {
      console.error('Failed to add expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveExpense = async (index) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/game/early-retirement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'remove-expense',
          payload: { index }
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        onUpdate(updatedData);
      }
    } catch (error) {
      console.error('Failed to remove expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate total expenses
  const totalExpenses = expenses
    .filter(exp => exp.recurring)
    .reduce((sum, exp) => sum + exp.amount, 0);

  // Calculate expense categories for chart
  const expenseCategories = expenses.reduce((acc, expense) => {
    if (!expense.recurring) return acc;

    if (!acc[expense.category]) {
      acc[expense.category] = expense.amount;
    } else {
      acc[expense.category] += expense.amount;
    }
    return acc;
  }, {});

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Monthly Budget</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
        >
          Add Expense
        </button>
      </div>

      {isAdding && (
        <div className="mb-6 p-4 border border-purple-200 rounded-lg bg-purple-50">
          <h3 className="font-medium mb-3">Add New Expense</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Rent, Groceries, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
              <input
                type="number"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Amount"
                min="0"
              />
            </div>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="recurring"
              checked={newExpense.recurring}
              onChange={(e) => setNewExpense({ ...newExpense, recurring: e.target.checked })}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="recurring" className="ml-2 block text-sm text-gray-700">
              Monthly recurring expense
            </label>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddExpense}
              disabled={isSubmitting || !newExpense.category || !newExpense.amount}
              className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Adding...' : 'Add Expense'}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-medium mb-3">Monthly Expenses</h3>
          {expenses.length > 0 ? (
            <div className="space-y-3">
              {expenses.map((expense, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">{expense.category}</span>
                    {expense.recurring && (
                      <span className="text-xs text-gray-500 ml-2">(Monthly)</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-3">₹{expense.amount.toLocaleString()}</span>
                    <button
                      onClick={() => handleRemoveExpense(index)}
                      className="text-red-500 hover:text-red-700"
                      disabled={isSubmitting}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg font-semibold">
                <span>Total Monthly Expenses</span>
                <span>₹{totalExpenses.toLocaleString()}</span>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-center py-6">
              No expenses added yet. Click "Add Expense" to get started.
            </div>
          )}
        </div>

        <div>
          <h3 className="font-medium mb-3">Expense Breakdown</h3>
          {Object.keys(expenseCategories).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(expenseCategories).map(([category, amount]) => (
                <div key={category}>
                  <div className="flex justify-between mb-1">
                    <span>{category}</span>
                    <span>{((amount / totalExpenses) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-purple-500"
                      style={{ width: `${(amount / totalExpenses) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}

              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <h4 className="font-medium mb-2">Budget Health</h4>
                <div className="flex justify-between">
                  <span>Income:</span>
                  <span className="font-medium">₹{gameData?.salary?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Expenses:</span>
                  <span className="font-medium">₹{totalExpenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 mt-2 border-t">
                  <span>Savings:</span>
                  <span className={`font-medium ${gameData?.salary - totalExpenses > 0
                      ? 'text-green-600'
                      : 'text-red-600'
                    }`}>
                    ₹{(gameData?.salary - totalExpenses).toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Savings Rate:</span>
                  <span className={`font-medium ${((gameData?.salary - totalExpenses) / gameData?.salary) * 100 >= 40
                      ? 'text-green-600'
                      : ((gameData?.salary - totalExpenses) / gameData?.salary) * 100 >= 20
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}>
                    {gameData?.salary
                      ? (((gameData.salary - totalExpenses) / gameData.salary) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-center py-6">
              Add expenses to see the breakdown.
            </div>
          )}
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2 text-yellow-800">Early Retirement Budget Tips</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-yellow-800">
          <li>For early retirement, aim to save at least 40-50% of your income</li>
          <li>Focus on reducing your largest expenses first for maximum impact</li>
          <li>Consider the 4% rule: You need approximately 25x your annual expenses to retire</li>
          <li>Track your expenses meticulously to identify areas for optimization</li>
        </ul>
      </div>
    </div>
  );
}

function CareerTab({ gameData, onUpdate }) {
  const [isChangingJob, setIsChangingJob] = useState(false);
  const [jobChange, setJobChange] = useState({
    jobTitle: '',
    newSalary: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChangeJob = async () => {
    if (!jobChange.jobTitle || !jobChange.newSalary) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/game/early-retirement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'change-job',
          payload: {
            jobTitle: jobChange.jobTitle,
            newSalary: parseFloat(jobChange.newSalary)
          }
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        onUpdate(updatedData);
        setJobChange({
          jobTitle: '',
          newSalary: ''
        });
        setIsChangingJob(false);
      }
    } catch (error) {
      console.error('Failed to change job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Career Management</h2>
        <button
          onClick={() => setIsChangingJob(true)}
          className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
        >
          Change Job
        </button>
      </div>

      {isChangingJob && (
        <div className="mb-6 p-4 border border-purple-200 rounded-lg bg-purple-50">
          <h3 className="font-medium mb-3">Job Change</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              <input
                type="text"
                value={jobChange.jobTitle}
                onChange={(e) => setJobChange({ ...jobChange, jobTitle: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Senior Developer, Product Manager"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Salary (₹)</label>
              <input
                type="number"
                value={jobChange.newSalary}
                onChange={(e) => setJobChange({ ...jobChange, newSalary: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Amount"
                min="0"
              />
            </div>
          </div>

          <div className="mb-4 p-3 bg-white rounded-lg">
            <h4 className="font-medium mb-2">Salary Comparison</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Current Salary:</span>
                <span className="font-medium ml-2">₹{gameData?.salary?.toLocaleString() || 0}/month</span>
              </div>
              <div>
                <span className="text-gray-600">New Salary:</span>
                <span className="font-medium ml-2">
                  ₹{jobChange.newSalary ? parseFloat(jobChange.newSalary).toLocaleString() : 0}/month
                </span>
              </div>
              <div>
                <span className="text-gray-600">Difference:</span>
                <span className={`font-medium ml-2 ${jobChange.newSalary && parseFloat(jobChange.newSalary) > (gameData?.salary || 0)
                    ? 'text-green-600'
                    : jobChange.newSalary && parseFloat(jobChange.newSalary) < (gameData?.salary || 0)
                      ? 'text-red-600'
                      : ''
                  }`}>
                  {jobChange.newSalary
                    ? `${parseFloat(jobChange.newSalary) > (gameData?.salary || 0) ? '+' : ''}
                     ₹${(parseFloat(jobChange.newSalary) - (gameData?.salary || 0)).toLocaleString()}/month`
                    : '₹0/month'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Annual Difference:</span>
                <span className={`font-medium ml-2 ${jobChange.newSalary && parseFloat(jobChange.newSalary) > (gameData?.salary || 0)
                    ? 'text-green-600'
                    : jobChange.newSalary && parseFloat(jobChange.newSalary) < (gameData?.salary || 0)
                      ? 'text-red-600'
                      : ''
                  }`}>
                  {jobChange.newSalary
                    ? `${parseFloat(jobChange.newSalary) > (gameData?.salary || 0) ? '+' : ''}
                     ₹${((parseFloat(jobChange.newSalary) - (gameData?.salary || 0)) * 12).toLocaleString()}/year`
                    : '₹0/year'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsChangingJob(false)}
              className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleChangeJob}
              disabled={isSubmitting || !jobChange.jobTitle || !jobChange.newSalary}
              className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 'Accept New Job'}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-medium mb-3">Current Position</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Job Title:</span>
                <span className="font-medium">{gameData?.jobTitle || 'Software Developer'}</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Salary:</span>
                <span className="font-medium">₹{gameData?.salary?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Annual Salary:</span>
                <span className="font-medium">₹{((gameData?.salary || 0) * 12).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Years in Position:</span>
                <span className="font-medium">{Math.floor((gameData?.progress || 0) / 12) || 0} years</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">Financial Impact</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Monthly Expenses:</span>
                <span className="font-medium">
                  ₹{gameData?.expenses
                    ?.filter(exp => exp.recurring)
                    ?.reduce((sum, exp) => sum + exp.amount, 0)
                    ?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Savings Rate:</span>
                <span className={`font-medium ${gameData?.salary && gameData?.expenses
                    ? (((gameData.salary - gameData.expenses
                      .filter(exp => exp.recurring)
                      .reduce((sum, exp) => sum + exp.amount, 0)) / gameData.salary) * 100) >= 40
                      ? 'text-green-600'
                      : (((gameData.salary - gameData.expenses
                        .filter(exp => exp.recurring)
                        .reduce((sum, exp) => sum + exp.amount, 0)) / gameData.salary) * 100) >= 20
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    : ''
                  }`}>
                  {gameData?.salary && gameData?.expenses
                    ? (((gameData.salary - gameData.expenses
                      .filter(exp => exp.recurring)
                      .reduce((sum, exp) => sum + exp.amount, 0)) / gameData.salary) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Retirement Impact:</span>
                <span className="font-medium">
                  {gameData?.retirementMetrics?.yearsToRetirement
                    ? `${gameData.retirementMetrics.yearsToRetirement} years to retirement`
                    : 'N/A'}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <p>Each ₹10,000 increase in monthly salary can reduce your time to early retirement by approximately 1-2 years, depending on your savings rate.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-medium mb-3">Career Development Opportunities</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <h4 className="font-medium mb-2">Skill Development</h4>
            <div className="space-y-2 text-sm">
              <p>Investing in new skills can increase your market value and lead to higher-paying positions.</p>
              <div className="mt-3">
                <span className="text-purple-600 font-medium">Potential Salary Increase: 15-30%</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <h4 className="font-medium mb-2">Job Hopping</h4>
            <div className="space-y-2 text-sm">
              <p>Changing employers every 2-3 years can lead to significant salary increases compared to internal promotions.</p>
              <div className="mt-3">
                <span className="text-purple-600 font-medium">Potential Salary Increase: 20-50%</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <h4 className="font-medium mb-2">Side Income</h4>
            <div className="space-y-2 text-sm">
              <p>Developing additional income streams can accelerate your path to financial independence.</p>
              <div className="mt-3">
                <span className="text-purple-600 font-medium">Potential Income Boost: 10-100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2 text-yellow-800">Career Strategy Tips</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-yellow-800">
          <li>Focus on increasing your income while keeping expenses stable to maximize savings rate</li>
          <li>Consider the work-life balance when evaluating job opportunities</li>
          <li>Develop skills that are in high demand to increase your earning potential</li>
          <li>Remember that the highest-paying job isn't always the best for early retirement if it increases stress or expenses</li>
        </ul>
      </div>
    </div>
  );
}

function PlanningTab({ gameData, onUpdate }) {
  const [retirementAge, setRetirementAge] = useState(gameData?.retirementAge || 65);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const retirementMetrics = gameData?.retirementMetrics || {};

  const handleUpdateRetirementAge = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/game/early-retirement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'set-retirement-age',
          payload: {
            age: retirementAge
          }
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        onUpdate(updatedData);
      }
    } catch (error) {
      console.error('Failed to update retirement age:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate monthly expenses
  const monthlyExpenses = gameData?.expenses
    ?.filter(exp => exp.recurring)
    ?.reduce((sum, exp) => sum + exp.amount, 0) || 0;

  // Calculate annual expenses
  const annualExpenses = monthlyExpenses * 12;

  // Calculate target retirement savings using 4% rule
  const targetRetirementSavings = annualExpenses * 25;

  return (
  <div>
    <h2 className="text-xl font-bold mb-4">Retirement Planning</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div>
        <h3 className="font-medium mb-3">Retirement Timeline</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="block text-sm font-medium text-gray-700 mb-1">Target Retirement Age</span>
              <div className="flex items-center">
                <input
                  type="range"
                  min="40"
                  max="70"
                  step="1"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(parseInt(e.target.value))}
                  className="mr-3 w-40"
                />
                <input
                  type="number"
                  min="40"
                  max="70"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(parseInt(e.target.value))}
                  className="w-16 p-1 border border-gray-300 rounded-md text-center"
                />
              </div>
            </div>
            <button
              onClick={handleUpdateRetirementAge}
              disabled={isSubmitting || retirementAge === gameData?.retirementAge}
              className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isSubmitting ? 'Updating...' : 'Update'}
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Current Age:</span>
              <span className="font-medium">{gameData?.age || 30}</span>
            </div>
            <div className="flex justify-between">
              <span>Target Retirement Age:</span>
              <span className="font-medium">{retirementAge}</span>
            </div>
            <div className="flex justify-between">
              <span>Projected Retirement Age:</span>
              <span className={`font-medium ${
                retirementMetrics.projectedRetirementAge < retirementAge
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {retirementMetrics.projectedRetirementAge || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Years to Retirement:</span>
              <span className="font-medium">{retirementMetrics.yearsToRetirement || 'N/A'}</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="relative pt-5">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="absolute h-2 rounded-full bg-purple-500"
                  style={{
                    width: `${Math.min(100, ((gameData?.age - 20) / (retirementAge - 20)) * 100)}%`
                  }}
                ></div>
                <div
  className="absolute h-4 w-4 rounded-full bg-white border-2 border-purple-500 top-1/2 transform -translate-y-1/2"
  style={{
    left: `${Math.min(100, ((gameData?.age - 20) / (retirementAge - 20)) * 100)}%`
  }}
></div>

                {retirementMetrics.projectedRetirementAge && (
                  <div
                    className="absolute h-4 w-4 rounded-full bg-white border-2 border-green-500 top-1/2 transform -translate-y-1/2"
                    style={{
                      left: `${Math.min(100, ((retirementMetrics.projectedRetirementAge - 20) / (retirementAge - 20)) * 100)}%`
                    }}
                  ></div>
                )}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-600">
                <span>20</span>
                <span>30</span>
                <span>40</span>
                <span>50</span>
                <span>60</span>
                <span>70</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Retirement Needs</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Monthly Expenses:</span>
              <span className="font-medium">₹{monthlyExpenses.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Annual Expenses:</span>
              <span className="font-medium">₹{annualExpenses.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Target Retirement Savings:</span>
              <span className="font-medium">₹{targetRetirementSavings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Current Portfolio Value:</span>
              <span className="font-medium">
                ₹{((gameData?.savings || 0) +
                   (gameData?.investments || []).reduce((sum, inv) => sum + inv.amount, 0))
                  .toLocaleString()}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between mb-1">
              <span>Progress to Target</span>
              <span>{retirementMetrics.retirementReadiness?.toFixed(1) || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  (retirementMetrics.retirementReadiness || 0) >= 75 ? 'bg-green-500' :
                  (retirementMetrics.retirementReadiness || 0) >= 40 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, retirementMetrics.retirementReadiness || 0))}%` }}
              ></div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <p>Based on the 4% rule, you need approximately 25 times your annual expenses saved to retire safely. This allows you to withdraw 4% of your portfolio annually with minimal risk of running out of money.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <h3 className="font-medium mb-3">Retirement Projection</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <h4 className="font-medium mb-2">Monthly Income in Retirement</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>4% Withdrawal:</span>
              <span className="font-medium">
                ₹{retirementMetrics.projectedRetirementIncome
                  ? (retirementMetrics.projectedRetirementIncome / 12).toLocaleString(undefined, {maximumFractionDigits: 0})
                  : 0}/month
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Current Expenses:</span>
              <span className="font-medium">₹{monthlyExpenses.toLocaleString()}/month</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t">
              <span>Difference:</span>
              <span className={`font-medium ${
                (retirementMetrics.projectedRetirementIncome / 12) >= monthlyExpenses
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {(retirementMetrics.projectedRetirementIncome / 12) >= monthlyExpenses ? '+' : ''}
                ₹{((retirementMetrics.projectedRetirementIncome / 12) - monthlyExpenses)
                  .toLocaleString(undefined, {maximumFractionDigits: 0})}/month
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <h4 className="font-medium mb-2">Portfolio Growth</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Current Value:</span>
              <span className="font-medium">
                ₹{((gameData?.savings || 0) +
                   (gameData?.investments || []).reduce((sum, inv) => sum + inv.amount, 0))
                  .toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Monthly Contribution:</span>
              <span className="font-medium">
                ₹{(gameData?.salary - monthlyExpenses).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Projected Annual Growth:</span>
              <span className="font-medium">
                {gameData?.investments?.length > 0
                  ? ((gameData.investments.reduce((sum, inv) => sum + (inv.amount * inv.expectedReturn), 0) /
                      gameData.investments.reduce((sum, inv) => sum + inv.amount, 0)) * 100).toFixed(1)
                  : 7}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <h4 className="font-medium mb-2">Retirement Strategy</h4>
          <div className="space-y-2 text-sm">
            <p className={`${
              retirementMetrics.projectedRetirementAge <= retirementAge
                ? 'text-green-600'
                : 'text-red-600'
            }`}>
              {retirementMetrics.projectedRetirementAge <= retirementAge
                ? `You're on track to retire by age ${retirementMetrics.projectedRetirementAge}`
                : `You need to adjust your strategy to retire by age ${retirementAge}`}
            </p>
            <div className="mt-2">
              <span className="block font-medium">Key Actions:</span>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Increase savings rate</li>
                <li>Boost investment returns</li>
                <li>Reduce monthly expenses</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-yellow-50 p-4 rounded-lg">
      <h3 className="font-medium mb-2 text-yellow-800">Early Retirement Principles</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm text-yellow-800">
        <li>The 4% Rule: You can safely withdraw 4% of your portfolio in the first year of retirement, then adjust for inflation in subsequent years</li>
        <li>Your target retirement savings should be at least 25 times your annual expenses</li>
        <li>The three most powerful levers for early retirement are: increasing income, reducing expenses, and investing wisely</li>
        <li>Building multiple income streams can significantly accelerate your path to financial independence</li>
      </ul>
    </div>
  </div >
);
}