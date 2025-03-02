// components/game-paths/JobSaving.jsx
'use client';

import { useState, useEffect } from 'react';
import { calculateEMI } from '@/lib/game-logic/job-saving';

export default function JobSavingInterface({ gameData, onUpdate }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdvanceMonth = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/game/job-saving', {
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
      <div className="flex border-b">
        <button
          className={`px-4 py-3 font-medium ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`px-4 py-3 font-medium ${activeTab === 'budget' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('budget')}
        >
          Budget
        </button>
        <button
          className={`px-4 py-3 font-medium ${activeTab === 'loans' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('loans')}
        >
          Loans
        </button>
        <button
          className={`px-4 py-3 font-medium ${activeTab === 'goals' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('goals')}
        >
          Goals
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'overview' && <OverviewTab gameData={gameData} />}
        {activeTab === 'budget' && <BudgetTab gameData={gameData} onUpdate={onUpdate} />}
        {activeTab === 'loans' && <LoansTab gameData={gameData} onUpdate={onUpdate} />}
        {activeTab === 'goals' && <GoalsTab gameData={gameData} onUpdate={onUpdate} />}
      </div>

      <div className="bg-gray-50 p-4 border-t flex justify-between items-center">
        <div>
          <span className="text-sm text-gray-500">Month {gameData?.progress || 1}</span>
        </div>
        <button
          onClick={handleAdvanceMonth}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
  // Calculate savings rate
  const savingsRate = gameData?.salary
    ? ((gameData.savings / gameData.salary) * 100).toFixed(1)
    : 0;

  // Calculate total expenses
  const totalExpenses = gameData?.expenses
    ?.filter(exp => exp.recurring)
    ?.reduce((sum, exp) => sum + exp.amount, 0) || 0;

  // Calculate total loan payments
  const totalLoanPayments = gameData?.loans
    ?.filter(loan => loan.remainingAmount > 0)
    ?.reduce((sum, loan) => sum + loan.monthlyPayment, 0) || 0;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Financial Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-1">Monthly Income</h3>
          <p className="text-2xl font-bold">₹{gameData?.salary?.toLocaleString() || 0}</p>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-red-800 mb-1">Monthly Expenses</h3>
          <p className="text-2xl font-bold">₹{totalExpenses.toLocaleString()}</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-800 mb-1">Savings</h3>
          <p className="text-2xl font-bold">₹{gameData?.savings?.toLocaleString() || 0}</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-2">Savings Rate</h3>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`h-4 rounded-full ${
              parseFloat(savingsRate) >= 20 ? 'bg-green-500' :
              parseFloat(savingsRate) >= 10 ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, parseFloat(savingsRate)))}%` }}

          ></div>
        </div>
        <div className="flex justify-between mt-1 text-sm text-gray-600">
          <span>0%</span>
          <span>Target: 20%</span>
          <span>50%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-3">Monthly Cash Flow</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Income:</span>
              <span className="font-medium text-green-600">+₹{gameData?.salary?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Expenses:</span>
              <span className="font-medium text-red-600">-₹{totalExpenses.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Loan Payments:</span>
              <span className="font-medium text-red-600">-₹{totalLoanPayments.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span>Net Cash Flow:</span>
              <span className={`font-medium ${
                gameData?.salary - totalExpenses - totalLoanPayments > 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {gameData?.salary - totalExpenses - totalLoanPayments > 0 ? '+' : ''}
                ₹{(gameData?.salary - totalExpenses - totalLoanPayments).toLocaleString() || 0}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">Financial Health</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span>Savings Rate</span>
                <span className={`${
                  parseFloat(savingsRate) >= 20 ? 'text-green-600' :
                  parseFloat(savingsRate) >= 10 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {savingsRate}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    parseFloat(savingsRate) >= 20 ? 'bg-green-500' :
                    parseFloat(savingsRate) >= 10 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, parseFloat(savingsRate)))}%` }}

                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Expense to Income Ratio</span>
                <span className={`${
                  (totalExpenses / gameData?.salary) * 100 <= 50 ? 'text-green-600' :
                  (totalExpenses / gameData?.salary) * 100 <= 70 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {gameData?.salary ? ((totalExpenses / gameData.salary) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    (totalExpenses / gameData?.salary) * 100 <= 50 ? 'bg-green-500' :
                    (totalExpenses / gameData?.salary) * 100 <= 70 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, (totalExpenses / (gameData?.salary || 1)) * 100)}%` }}

                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Debt to Income Ratio</span>
                <span className={`${
                  (totalLoanPayments / gameData?.salary) * 100 <= 30 ? 'text-green-600' :
                  (totalLoanPayments / gameData?.salary) * 100 <= 40 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {gameData?.salary ? ((totalLoanPayments / gameData.salary) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    (totalLoanPayments / gameData?.salary) * 100 <= 30 ? 'bg-green-500' :
                    (totalLoanPayments / gameData?.salary) * 100 <= 40 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, (totalLoanPayments / (gameData?.salary || 1)) * 100)}%` }}

                ></div>
              </div>
            </div>
          </div>
        </div>
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
      const response = await fetch('/api/game/job-saving', {
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
      const response = await fetch('/api/game/job-saving', {
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
          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          Add Expense
        </button>
      </div>

      {isAdding && (
        <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
          <h3 className="font-medium mb-3">Add New Expense</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={newExpense.category}
                onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Rent, Groceries, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
              <input
                type="number"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              onChange={(e) => setNewExpense({...newExpense, recurring: e.target.checked})}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: `${(amount / totalExpenses) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
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
                  <span>Remaining:</span>
                  <span className={`font-medium ${
                    gameData?.salary - totalExpenses > 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    ₹{(gameData?.salary - totalExpenses).toLocaleString() || 0}
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
        <h3 className="font-medium mb-2 text-yellow-800">Budget Tips</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-yellow-800">
          <li>Aim to keep your housing costs under 30% of your income</li>
          <li>Try to save at least 20% of your income each month</li>
          <li>Track all expenses to identify areas where you can cut back</li>
          <li>Consider the 50/30/20 rule: 50% for needs, 30% for wants, 20% for savings</li>
        </ul>
      </div>
    </div>
  );
}

function LoansTab({ gameData, onUpdate }) {
  const [isApplying, setIsApplying] = useState(false);
  const [loanApplication, setLoanApplication] = useState({
    amount: '',
    interestRate: '',
    term: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedEMI, setCalculatedEMI] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState({});

  useEffect(() => {
    if (loanApplication.amount && loanApplication.interestRate && loanApplication.term) {
      const emi = calculateEMI(
        parseFloat(loanApplication.amount),
        parseFloat(loanApplication.interestRate),
        parseFloat(loanApplication.term)
      );
      setCalculatedEMI(emi);
    } else {
      setCalculatedEMI(0);
    }
  }, [loanApplication]);

  const handleApplyLoan = async () => {
    if (!loanApplication.amount || !loanApplication.interestRate || !loanApplication.term) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/game/job-saving', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'apply-for-loan',
          payload: {
            amount: parseFloat(loanApplication.amount),
            interestRate: parseFloat(loanApplication.interestRate),
            term: parseFloat(loanApplication.term),
            monthlyPayment: calculatedEMI
          }
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        onUpdate(updatedData);
        setLoanApplication({
          amount: '',
          interestRate: '',
          term: '',
        });
        setIsApplying(false);
      }
    } catch (error) {
      console.error('Failed to apply for loan:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayLoan = async (index) => {
    if (!paymentAmount[index] || parseFloat(paymentAmount[index]) <= 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/game/job-saving', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'pay-loan',
          payload: {
            index,
            amount: parseFloat(paymentAmount[index])
          }
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        onUpdate(updatedData);
        setPaymentAmount({...paymentAmount, [index]: ''});
      }
    } catch (error) {
      console.error('Failed to pay loan:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Loans & EMIs</h2>
        <button
          onClick={() => setIsApplying(true)}
          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          Apply for Loan
        </button>
      </div>

      {isApplying && (
        <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
          <h3 className="font-medium mb-3">Loan Application</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount (₹)</label>
              <input
                type="number"
                value={loanApplication.amount}
                onChange={(e) => setLoanApplication({...loanApplication, amount: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Amount"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
              <input
                type="number"
                value={loanApplication.interestRate}
                onChange={(e) => setLoanApplication({...loanApplication, interestRate: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Annual Rate"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Term (Years)</label>
              <input
                type="number"
                value={loanApplication.term}
                onChange={(e) => setLoanApplication({...loanApplication, term: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Years"
                min="1"
                max="30"
              />
            </div>
          </div>

          {calculatedEMI > 0 && (
            <div className="mb-4 p-3 bg-white rounded-lg">
              <h4 className="font-medium mb-2">Loan Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Monthly EMI:</span>
                  <span className="font-medium ml-2">₹{calculatedEMI.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Total Repayment:</span>
                  <span className="font-medium ml-2">
                    ₹{(calculatedEMI * loanApplication.term * 12).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Total Interest:</span>
                  <span className="font-medium ml-2">
                    ₹{((calculatedEMI * loanApplication.term * 12) - loanApplication.amount).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">EMI to Income Ratio:</span>
                  <span className={`font-medium ml-2 ${
                    (calculatedEMI / (gameData?.salary || 1)) * 100 <= 30
                      ? 'text-green-600'
                      : (calculatedEMI / (gameData?.salary || 1)) * 100 <= 40
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}>
                    {gameData?.salary
                      ? ((calculatedEMI / gameData.salary) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsApplying(false)}
              className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyLoan}
              disabled={
                isSubmitting ||
                !loanApplication.amount ||
                !loanApplication.interestRate ||
                !loanApplication.term ||
                (calculatedEMI / (gameData?.salary || 1)) > 0.5 // Don't allow loans with EMI > 50% of income
              }
              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 'Apply for Loan'}
            </button>
          </div>

          {(calculatedEMI / (gameData?.salary || 1)) > 0.5 && (
            <div className="mt-2 text-sm text-red-600">
              EMI exceeds 50% of your income. Reduce loan amount or increase term.
            </div>
          )}
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-medium mb-3">Your Loans</h3>
        {gameData?.loans?.length > 0 ? (
          <div className="space-y-4">
            {gameData.loans.map((loan, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div>
                    <span className="text-sm text-gray-600">Original Amount</span>
                    <p className="font-medium">₹{loan.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Interest Rate</span>
                    <p className="font-medium">{loan.interestRate}%</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Monthly Payment</span>
                    <p className="font-medium">₹{loan.monthlyPayment.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Remaining Amount</span>
                    <p className="font-medium">₹{loan.remainingAmount.toLocaleString()}</p>
                  </div>
                </div>

                {loan.remainingAmount > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-end space-x-2">
                      <div className="flex-grow">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Make Extra Payment</label>
                        <input
                          type="number"
                          value={paymentAmount[index] || ''}
                          onChange={(e) => setPaymentAmount({...paymentAmount, [index]: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Amount"
                          min="0"
                          max={loan.remainingAmount}
                        />
                      </div>
                      <button
                        onClick={() => handlePayLoan(index)}
                        disabled={isSubmitting || !paymentAmount[index] || parseFloat(paymentAmount[index]) <= 0 || parseFloat(paymentAmount[index]) > (gameData?.savings || 0)}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Processing...' : 'Pay'}
                      </button>
                    </div>
                    {parseFloat(paymentAmount[index]) > (gameData?.savings || 0) && (
                      <div className="mt-1 text-sm text-red-600">
                        You don't have enough savings for this payment.
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: `${100 - (loan.remainingAmount / loan.amount) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-600">
                    <span>0%</span>
                    <span>Paid: {(100 - (loan.remainingAmount / loan.amount) * 100).toFixed(1)}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">Loan Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Total Loan Balance</span>
                  <p className="font-medium">
                    ₹{gameData.loans.reduce((sum, loan) => sum + loan.remainingAmount, 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Monthly Payments</span>
                  <p className="font-medium">
                    ₹{gameData.loans
                      .filter(loan => loan.remainingAmount > 0)
                      .reduce((sum, loan) => sum + loan.monthlyPayment, 0)
                      .toLocaleString(undefined, {maximumFractionDigits: 0})}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Debt-to-Income Ratio</span>
                  <p className={`font-medium ${
                    (gameData.loans
                      .filter(loan => loan.remainingAmount > 0)
                      .reduce((sum, loan) => sum + loan.monthlyPayment, 0) / gameData.salary) * 100 <= 30
                      ? 'text-green-600'
                      : (gameData.loans
                          .filter(loan => loan.remainingAmount > 0)
                          .reduce((sum, loan) => sum + loan.monthlyPayment, 0) / gameData.salary) * 100 <= 40
                        ? 'text-yellow-600'
                        : 'text-red-600'
                  }`}>
                    {((gameData.loans
                      .filter(loan => loan.remainingAmount > 0)
                      .reduce((sum, loan) => sum + loan.monthlyPayment, 0) / gameData.salary) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-center py-6 border border-gray-200 rounded-lg">
            You don't have any loans yet. Click "Apply for Loan" to get started.
          </div>
        )}
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2 text-yellow-800">Loan Management Tips</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-yellow-800">
          <li>Keep your total EMIs under 40% of your monthly income</li>
          <li>Consider prepaying high-interest loans to save on interest costs</li>
          <li>Prioritize paying off expensive debt (like credit cards) first</li>
          <li>Build an emergency fund before taking on additional debt</li>
        </ul>
      </div>
    </div>
  </>);
}

function GoalsTab({ gameData, onUpdate }) {
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: "Emergency Fund",
      target: gameData?.salary * 6 || 100000,
      current: gameData?.savings || 0,
      priority: "High",
      description: "Save 6 months of expenses for emergencies"
    },
    {
      id: 2,
      name: "Debt Free",
      target: gameData?.loans?.reduce((sum, loan) => sum + loan.remainingAmount, 0) || 0,
      current: 0,
      priority: "Medium",
      description: "Pay off all loans and become debt-free"
    },
    {
      id: 3,
      name: "Savings Rate",
      target: 20, // 20% of income
      current: gameData?.salary ? ((gameData.savings / gameData.salary) * 100) : 0,
      priority: "High",
      description: "Save at least 20% of your monthly income",
      isPercentage: true
    }
  ]);

  useEffect(() => {
    // Update goals with latest data
    setGoals(goals.map(goal => {
      if (goal.id === 1) {
        return {
          ...goal,
          target: gameData?.salary * 6 || 100000,
          current: gameData?.savings || 0
        };
      } else if (goal.id === 2) {
        return {
          ...goal,
          target: gameData?.loans?.reduce((sum, loan) => sum + loan.remainingAmount, 0) || 0
        };
      } else if (goal.id === 3) {
        return {
          ...goal,
          current: gameData?.salary ? ((gameData.savings / gameData.salary) * 100) : 0
        };
      }
      return goal;
    }));
  }, [gameData]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Financial Goals</h2>

      <div className="space-y-6">
        {goals.map(goal => (
          <div key={goal.id} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">{goal.name}</h3>
                <p className="text-sm text-gray-600">{goal.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                goal.priority === 'High' ? 'bg-red-100 text-red-800' :
                goal.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {goal.priority} Priority
              </span>
            </div>

            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <span>Progress</span>
                <span>
                {goal.isPercentage
  ? `${goal.current.toFixed(1)}% of ${goal.target}%`
  : `₹${goal.current.toLocaleString()} of ₹${goal.target.toLocaleString()}`}

                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    (goal.current / goal.target) * 100 >= 75 ? 'bg-green-500' :
                    (goal.current / goal.target) * 100 >= 40 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, (goal.current / goal.target) * 100))}%` }}

                ></div>
              </div>
            </div>

            {goal.id === 1 && (
              <div className="mt-3 text-sm">
                <p>Strategy: Set up automatic transfers to a separate emergency fund account after each payday.</p>
              </div>
            )}

            {goal.id === 2 && (
              <div className="mt-3 text-sm">
                <p>Strategy: Make extra payments on high-interest loans first, then move to lower interest loans.</p>
              </div>
            )}

            {goal.id === 3 && (
              <div className="mt-3 text-sm">
                <p>Strategy: Reduce discretionary spending and increase income through side hustles or career advancement.</p>
              </div>
            )}
          </div>
        ))}

        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium mb-2">Your Financial Journey</h3>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-blue-200 text-blue-800">
                  Progress
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-blue-800">
                  {Math.min(100, Math.max(0, (gameData?.progress || 0) * 5))}%
                </span>
              </div>
            </div>
            <div className="flex h-2 mb-4 overflow-hidden text-xs bg-blue-200 rounded-full">
              <div
                style={{ width: `${Math.min(100, Math.max(0, (gameData?.progress || 0) * 5))}%` }}

                className="flex flex-col justify-center text-center text-white bg-blue-500 shadow-none whitespace-nowrap"
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Beginner</span>
              <span>Intermediate</span>
              <span>Advanced</span>
              <span>Expert</span>
            </div>
          </div>

          <div className="mt-4 text-sm">
            <p className="mb-2">
              You've completed <span className="font-medium">{gameData?.progress || 0} months</span> of your financial journey.
            </p>
            <p>
              {(gameData?.progress || 0) < 6
                ? "You're just getting started. Focus on building good financial habits."
                : (gameData?.progress || 0) < 12
                ? "You're making progress! Keep building your emergency fund and reducing high-interest debt."
                : (gameData?.progress || 0) < 18
                ? "You're doing well! Start thinking about long-term investments and increasing your income."
                : "You're becoming a financial expert! Focus on optimizing your investments and planning for major life goals."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}