// components/game-paths/BusinessTyphoon.jsx
'use client';

import { useState, useEffect } from 'react';
import { calculateEMI } from '@/lib/game-logic/job-saving';
import { formatCurrency } from '@/app/utils/formatCurrency';

export default function BusinessTyphoonInterface({ gameData, onUpdate }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdvanceMonth = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/game/business-typhoon', {
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
          className={`px-4 py-3 font-medium whitespace-nowrap ${activeTab === 'overview' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`px-4 py-3 font-medium whitespace-nowrap ${activeTab === 'operations' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('operations')}
        >
          Operations
        </button>
        <button
          className={`px-4 py-3 font-medium whitespace-nowrap ${activeTab === 'finance' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('finance')}
        >
          Finance
        </button>
        <button
          className={`px-4 py-3 font-medium whitespace-nowrap ${activeTab === 'marketing' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('marketing')}
        >
          Marketing
        </button>
        <button
          className={`px-4 py-3 font-medium whitespace-nowrap ${activeTab === 'hr' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('hr')}
        >
          HR
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'overview' && <OverviewTab gameData={gameData} />}
        {activeTab === 'operations' && <OperationsTab gameData={gameData} onUpdate={onUpdate} />}
        {activeTab === 'finance' && <FinanceTab gameData={gameData} onUpdate={onUpdate} />}
        {activeTab === 'marketing' && <MarketingTab gameData={gameData} onUpdate={onUpdate} />}
        {activeTab === 'hr' && <HRTab gameData={gameData} onUpdate={onUpdate} />}
      </div>

      <div className="bg-gray-50 p-4 border-t flex justify-between items-center">
        <div>
          <span className="text-sm text-gray-500">Month {gameData?.progress || 1}</span>
        </div>
        <button
          onClick={handleAdvanceMonth}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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

const OverviewTab = ({ gameData }) => {
  const businessDetails = gameData?.businessDetails || {};

  // Helper function to format currency
  // const formatCurrency = (amount) =>
  //   new Intl.NumberFormat("en-IN", {
  //     style: "currency",
  //     currency: "INR",
  //     maximumFractionDigits: 0,
  //   }).format(amount || 0);


  // Calculate financial metrics
  const revenue = businessDetails.revenue || 0;
  const expenses = businessDetails.expenses || 0;
  const profit = revenue - expenses;
  const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;

  const initialCapital = 10000000; // 1 crore
  const currentValue = businessDetails.capital || 0;
  const roi = ((currentValue - initialCapital) / initialCapital) * 100;

  // Determine business health status
  const getBusinessHealth = () => {
    if (profit > 0 && currentValue > expenses * 3) return "Excellent";
    if (profit >= 0 && currentValue > expenses) return "Stable";
    return "At Risk";
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-black">Business Dashboard</h2>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-black">
        <InfoCard title="Capital" value={formatCurrency(currentValue)} color="green" />
        <InfoCard title="Revenue (Total)" value={formatCurrency(revenue)} color="blue" />
        <InfoCard
          title="Profit"
          value={(profit >= 0 ? "+" : "") + formatCurrency(profit)}
          color={profit >= 0 ? "green" : "red"}
        />
      </div>

      {/* Key Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-black">
        <div>
          <h3 className="font-medium mb-3">Key Metrics</h3>
          <div className="space-y-4">
            <MetricBar label="Profit Margin" value={profitMargin} thresholds={[15, 5]} />
            <MetricBar label="Return on Investment (ROI)" value={roi} thresholds={[10, 0]} />
            <MetricBar
              label="Cash Flow"
              value={(currentValue / initialCapital) * 100}
              thresholds={[100, 80]}
            />
          </div>
        </div>

        {/* Business Status */}
        <BusinessStatus businessDetails={businessDetails} businessHealth={getBusinessHealth()} />
      </div>

      {/* Monthly Performance Chart */}
      <MonthlyPerformance />
    </div>
  );
};

// Reusable Card Component
const InfoCard = ({ title, value, color }) => (
  <div className={`bg-${color}-50 p-4 rounded-lg`}>
    <h3 className={`text-sm font-medium text-${color}-800 mb-1 text-black`}>{title}</h3>
    <p className="text-2xl font-bold text-black">{value}</p>
  </div>
);

// Reusable Metric Bar Component
const MetricBar = ({ label, value, thresholds }) => {
  const [high, mid] = thresholds;
  const color = value >= high ? "green" : value >= mid ? "yellow" : "red";

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span>{label}</span>
        <span className={`text-${color}-600`}>{value.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full bg-${color}-500`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        ></div>
      </div>
    </div>
  );
};

// Business Status Component
const BusinessStatus = ({ businessDetails, businessHealth }) => (
  <div>
    <h3 className="font-medium mb-3">Business Status</h3>
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        <StatusItem label="Employees" value={businessDetails.employees} />
        <StatusItem label="Inventory" value={`${businessDetails.inventory || 0} units`} />
        <StatusItem label="Monthly Expenses" value={formatCurrency(businessDetails.expenses)} />
        <StatusItem label="Market Share" value={`${businessDetails.marketShare?.toFixed(1) || 0}%`} />
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Business Health</span>
          <span className={`font-medium text-${businessHealth === "Excellent" ? "green" : businessHealth === "Stable" ? "yellow" : "red"}-600`}>
            {businessHealth}
          </span>
        </div>
      </div>
    </div>
  </div>
);

// Status Item Component
const StatusItem = ({ label, value }) => (
  <div>
    <span className="text-sm text-gray-600">{label}</span>
    <p className="font-medium">{value || 0}</p>
  </div>
);

// Monthly Performance Chart (Placeholder)
const MonthlyPerformance = () => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h3 className="font-medium mb-3">Monthly Performance</h3>
    <div className="h-40 bg-white p-3 rounded border border-gray-200 flex items-end space-x-1">
      {[60, 40, 70, 55, 85, 65].map((height, index) => (
        <div key={index} className="flex-1 h-full flex flex-col justify-end">
          <div className="bg-blue-500 w-full" style={{ height: `${height}%` }}></div>
          <div className="text-xs text-center mt-1">M{index + 1}</div>
        </div>
      ))}
    </div>
  </div>
);

function OperationsTab({ gameData, onUpdate }) {
  const businessDetails = gameData?.businessDetails || {};
  const [isAddingInventory, setIsAddingInventory] = useState(false);
  const [inventoryPurchase, setInventoryPurchase] = useState({
    quantity: '',
    pricePerUnit: 2000
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePurchaseInventory = async () => {
    if (!inventoryPurchase.quantity) return;

    const quantity = parseInt(inventoryPurchase.quantity, 10);
    const cost = quantity * inventoryPurchase.pricePerUnit;

    if (cost > (businessDetails.capital || 0)) {
      alert("You don't have enough capital for this purchase.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/game/business-typhoon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'purchase-inventory',
          payload: { quantity, cost }
        })
      });

      if (response.ok) {
        const updatedData = await response.json();
        onUpdate(updatedData);
        setInventoryPurchase({ quantity: '', pricePerUnit: 2000 });
        setIsAddingInventory(false);
      }
    } catch (error) {
      console.error('Failed to purchase inventory:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4 text-black">
        <h2 className="text-xl font-bold text-black">Operations Management</h2>
        <button
          onClick={() => setIsAddingInventory(true)}
          className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
        >
          Purchase Inventory
        </button>
      </div>

      {isAddingInventory && (
        <div className="mb-6 p-4 border border-green-200 rounded-lg bg-green-50 text-black">
          <h3 className="font-medium mb-3">Purchase Inventory</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                value={inventoryPurchase.quantity}
                onChange={(e) => setInventoryPurchase({ ...inventoryPurchase, quantity: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                placeholder="Number of units"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price per Unit</label>
              <input
                type="number"
                value={inventoryPurchase.pricePerUnit}
                disabled
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
          </div>

          <div className="mb-4 p-3 bg-white rounded-lg">
            <h4 className="font-medium mb-2">Purchase Summary</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Total Cost:</span>
                <span className="font-medium ml-2">
                  ₹{inventoryPurchase.quantity ? (parseInt(inventoryPurchase.quantity, 10) * inventoryPurchase.pricePerUnit).toLocaleString() : 0}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Available Capital:</span>
                <span className="font-medium ml-2">₹{(businessDetails.capital || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsAddingInventory(false)}
              className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handlePurchaseInventory}
              disabled={
                isSubmitting ||
                !inventoryPurchase.quantity ||
                parseInt(inventoryPurchase.quantity, 10) <= 0 ||
                parseInt(inventoryPurchase.quantity, 10) * inventoryPurchase.pricePerUnit > (businessDetails.capital || 0)
              }
              className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 'Purchase'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



function FinanceTab({ gameData, onUpdate }) {
  const businessDetails = gameData?.businessDetails || {};
  const [isApplyingLoan, setIsApplyingLoan] = useState(false);
  const [loanApplication, setLoanApplication] = useState({
    amount: '',
    interestRate: 12,
    term: 3,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedEMI, setCalculatedEMI] = useState(0);

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
    if (!loanApplication.amount) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/game/business-typhoon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'take-loan',
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
          interestRate: 12,
          term: 3,
        });
        setIsApplyingLoan(false);
      }
    } catch (error) {
      console.error('Failed to apply for loan:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate revenue, expenses, and profit
  const revenue = businessDetails.revenue || 0;
  const expenses = businessDetails.expenses || 0;
  const profit = revenue - expenses;

  // Calculate monthly loan payments
  const monthlyLoanPayments = gameData?.loans
    ?.filter(loan => loan.remainingAmount > 0)
    ?.reduce((sum, loan) => sum + loan.monthlyPayment, 0) || 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-4 text-black">
        <h2 className="text-xl font-bold text-black">Financial Management</h2>
        <button
          onClick={() => setIsApplyingLoan(true)}
          className="px-3 py-1 bg-green-600 text-black rounded-lg hover:bg-green-700 text-sm"
        >
          Apply for Business Loan
        </button>
      </div>

      {isApplyingLoan && (
        <div className="mb-6 p-4 border border-green-200 rounded-lg bg-green-50 text-black">
          <h3 className="font-medium mb-3">Business Loan Application</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount (₹)</label>
              <input
                type="number"
                value={loanApplication.amount}
                onChange={(e) => setLoanApplication({ ...loanApplication, amount: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Amount"
                min="100000"
                max="10000000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
              <select
                value={loanApplication.interestRate}
                onChange={(e) => setLoanApplication({ ...loanApplication, interestRate: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="10">10% - Excellent Credit</option>
                <option value="12">12% - Good Credit</option>
                <option value="15">15% - Average Credit</option>
                <option value="18">18% - Poor Credit</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Term (Years)</label>
              <select
                value={loanApplication.term}
                onChange={(e) => setLoanApplication({ ...loanApplication, term: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="1">1 Year</option>
                <option value="3">3 Years</option>
                <option value="5">5 Years</option>
                <option value="10">10 Years</option>
              </select>
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
                  <span className="text-gray-600">Debt Service Ratio:</span>
                  <span className={`font-medium ml-2 ${(calculatedEMI / Math.max(profit, 1)) * 100 <= 30
                    ? 'text-green-600'
                    : (calculatedEMI / Math.max(profit, 1)) * 100 <= 50
                      ? 'text-yellow-600'
                      : 'text-red-600'
                    }`}>
                    {profit > 0
                      ? ((calculatedEMI / profit) * 100).toFixed(1)
                      : 'N/A'}%
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsApplyingLoan(false)}
              className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyLoan}
              disabled={
                isSubmitting ||
                !loanApplication.amount ||
                parseFloat(loanApplication.amount) < 100000 ||
                (profit > 0 && (calculatedEMI / profit) > 0.7) // Don't allow loans with payments > 70% of profit
              }
              className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 'Apply for Loan'}
            </button>
          </div>

          {profit > 0 && (calculatedEMI / profit) > 0.7 && (
            <div className="mt-2 text-sm text-red-600">
              Loan payment exceeds 70% of your monthly profit. Reduce loan amount or increase term.
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-black">
        <div>
          <h3 className="font-medium mb-3 text-black">Financial Overview</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Revenue:</span>
                <span className="font-medium">₹{revenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Expenses:</span>
                <span className="font-medium">₹{expenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Profit:</span>
                <span className={`font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {profit >= 0 ? '+' : ''}₹{profit.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Current Capital:</span>
                <span className="font-medium">₹{businessDetails.capital?.toLocaleString() || 0}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="font-medium mb-2">Cash Flow Statement</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Operating Income:</span>
                  <span className="font-medium text-green-600">+₹{revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Operating Expenses:</span>
                  <span className="font-medium text-red-600">-₹{expenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Loan Payments:</span>
                  <span className="font-medium text-red-600">-₹{monthlyLoanPayments.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax Payments:</span>
                  <span className="font-medium text-red-600">
                    -₹{((businessDetails.taxesPaid || 0) / Math.max(1, gameData?.progress || 1)).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span>Net Cash Flow:</span>
                  <span className={`font-medium ${profit - monthlyLoanPayments > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {profit - monthlyLoanPayments > 0 ? '+' : ''}
                    ₹{(profit - monthlyLoanPayments).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">Loans & Liabilities</h3>
          {gameData?.loans?.length > 0 ? (
            <div className="space-y-4">
              {gameData.loans.map((loan, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="grid grid-cols-2 gap-3 mb-3">
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
                      <p className="font-medium">
                        ₹{loan.monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Remaining Amount</span>
                      <p className="font-medium">₹{loan.remainingAmount.toLocaleString()}</p>
                    </div>
                  </div> {/* ✅ Properly closing the grid container */}

                  {/* Loan Progress Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-green-500"
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

              {/* ✅ Loan Summary (Moved Outside the Loop) */}
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium mb-2">Loan Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        .toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-center py-6 border border-gray-200 rounded-lg bg-gray-50">
              You don't have any loans yet. Click "Apply for Business Loan" to get started.
            </div>
          )}

          {/* Tax Management Section */}
          <div className="mt-6">
            <h3 className="font-medium mb-3">Tax Management</h3>
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-600">Current Tax Liability</span>
                  <p className="font-medium">₹{(businessDetails.taxLiability || 0).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Total Taxes Paid</span>
                  <p className="font-medium">₹{(businessDetails.taxesPaid || 0).toLocaleString()}</p>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-3">
                <p>Taxes are calculated quarterly at 25% of your profit. Next tax payment due in {3 - ((gameData?.progress || 0) % 3)} months.</p>
              </div>

              <div className={`p-3 rounded-lg ${(businessDetails.taxLiability || 0) > (businessDetails.capital || 0) ? 'bg-red-100' : 'bg-green-100'
                }`}>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${(businessDetails.taxLiability || 0) > (businessDetails.capital || 0) ? 'text-red-600' : 'text-green-600'
                    }`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                  </svg>
                  <span className={`font-medium ${(businessDetails.taxLiability || 0) > (businessDetails.capital || 0) ? 'text-red-600' : 'text-green-600'
                    }`}>
                    {(businessDetails.taxLiability || 0) > (businessDetails.capital || 0)
                      ? 'Warning: Insufficient funds for upcoming tax payment'
                      : 'You have sufficient funds for your tax liability'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2 text-yellow-800">Financial Management Tips</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-yellow-800">
            <li>Maintain a cash reserve of at least 3 months of operating expenses</li>
            <li>Keep your debt service ratio (loan payments to profit) below 50%</li>
            <li>Plan for quarterly tax payments to avoid cash flow issues</li>
            <li>Invest in inventory and employees based on market demand</li>
          </ul>
        </div>
      </div>
    </div>
  )
};

function MarketingTab({ gameData, onUpdate }) {
  const businessDetails = gameData?.businessDetails || {};
  const [isInvesting, setIsInvesting] = useState(false);
  const [marketingInvestment, setMarketingInvestment] = useState({
    amount: '',
    channel: 'digital'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInvestInMarketing = async () => {
    if (!marketingInvestment.amount) return;

    const amount = parseFloat(marketingInvestment.amount);

    if (amount > (businessDetails.capital || 0)) {
      alert("You don't have enough capital for this investment.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/game/business-typhoon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'invest-marketing',
          payload: {
            amount,
            channel: marketingInvestment.channel
          }
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        onUpdate(updatedData);
        setMarketingInvestment({
          amount: '',
          channel: 'digital'
        });
        setIsInvesting(false);
      }
    } catch (error) {
      console.error('Failed to invest in marketing:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-4 text-black">
          <h2 className="text-xl font-bold text-black">Marketing & Sales</h2>
          <button
            onClick={() => setIsInvesting(true)}
            className="px-3 py-1 bg-green-600 text-black rounded-lg hover:bg-green-700 text-sm"
          >
            Invest in Marketing
          </button>
        </div>

        {isInvesting && (
          <div className="mb-6 p-4 border border-green-200 rounded-lg bg-green-50">
            <h3 className="font-medium mb-3">Marketing Investment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Investment Amount (₹)</label>
                <input
                  type="number"
                  value={marketingInvestment.amount}
                  onChange={(e) => setMarketingInvestment({ ...marketingInvestment, amount: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Amount"
                  min="50000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marketing Channel</label>
                <select
                  value={marketingInvestment.channel}
                  onChange={(e) => setMarketingInvestment({ ...marketingInvestment, channel: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="digital">Digital Marketing</option>
                  <option value="traditional">Traditional Media</option>
                  <option value="pr">Public Relations</option>
                  <option value="direct">Direct Marketing</option>
                </select>
              </div>
            </div>

            <div className="mb-4 p-3 bg-white rounded-lg">
              <h4 className="font-medium mb-2">Expected Impact</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Market Share Gain:</span>
                  <span className="font-medium ml-2">
                    +{marketingInvestment.amount
                      ? (parseFloat(marketingInvestment.amount) / 1000000).toFixed(2)
                      : 0}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Revenue Impact:</span>
                  <span className="font-medium ml-2">
                    +₹{marketingInvestment.amount
                      ? ((parseFloat(marketingInvestment.amount) / 1000000) * 50000 * (businessDetails.employees || 0)).toLocaleString()
                      : 0}/month
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">ROI Timeline:</span>
                  <span className="font-medium ml-2">
                    {marketingInvestment.amount
                      ? Math.ceil(parseFloat(marketingInvestment.amount) /
                        ((parseFloat(marketingInvestment.amount) / 1000000) * 50000 * (businessDetails.employees || 0)))
                      : 0} months
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Available Capital:</span>
                  <span className="font-medium ml-2">₹{businessDetails.capital?.toLocaleString() || 0}</span>
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
                onClick={handleInvestInMarketing}
                disabled={
                  isSubmitting ||
                  !marketingInvestment.amount ||
                  parseFloat(marketingInvestment.amount) <= 0 ||
                  parseFloat(marketingInvestment.amount) > (businessDetails.capital || 0)
                }
                className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing...' : 'Invest'}
              </button>
            </div>

            {parseFloat(marketingInvestment.amount) > (businessDetails.capital || 0) && (
              <div className="mt-2 text-sm text-red-600">
                You don't have enough capital for this investment.
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-black">
          <div>
            <h3 className="font-medium mb-3 text-black">Market Position</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Market Share:</span>
                  <span className="font-medium">{businessDetails.marketShare?.toFixed(2) || 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Marketing Budget:</span>
                  <span className="font-medium">₹{(businessDetails.marketingBudget || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer Acquisition Cost:</span>
                  <span className="font-medium">
                    ₹{businessDetails.marketingBudget && businessDetails.marketShare
                      ? ((businessDetails.marketingBudget / businessDetails.marketShare) / 100).toLocaleString()
                      : 0}/customer
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between mb-1">
                  <span>Market Position</span>
                  <span>
                    {(businessDetails.marketShare || 0) < 1 ? 'Startup' :
                      (businessDetails.marketShare || 0) < 5 ? 'Small Player' :
                        (businessDetails.marketShare || 0) < 15 ? 'Established' :
                          (businessDetails.marketShare || 0) < 30 ? 'Market Leader' :
                            'Dominant'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-green-500"
                    style={{ width: `${Math.min(100, (businessDetails.marketShare || 0) * 2)}%` }}

                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-600">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Sales Performance</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Monthly Revenue:</span>
                  <span className="font-medium">
                    ₹{businessDetails.revenue && gameData?.progress
                      ? (businessDetails.revenue / gameData.progress).toLocaleString()
                      : 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Revenue per Employee:</span>
                  <span className="font-medium">
                    ₹{businessDetails.revenue && businessDetails.employees && gameData?.progress
                      ? ((businessDetails.revenue / gameData.progress) / businessDetails.employees).toLocaleString()
                      : 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Conversion Rate:</span>
                  <span className="font-medium">
                    {(businessDetails.marketShare || 0) < 1 ? '2.5%' :
                      (businessDetails.marketShare || 0) < 5 ? '3.2%' :
                        (businessDetails.marketShare || 0) < 15 ? '4.1%' :
                          '5.0%'}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <p>Sales are affected by your market share, inventory levels, and number of employees.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-black">
          <h3 className="font-medium mb-3 text-black">Competitive Analysis</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Competitor</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Market Share</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Strengths</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Weaknesses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm">Industry Giant</td>
                  <td className="px-4 py-3 text-sm">35%</td>
                  <td className="px-4 py-3 text-sm">Brand recognition, Scale</td>
                  <td className="px-4 py-3 text-sm">Slow innovation, High prices</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">Innovator Inc</td>
                  <td className="px-4 py-3 text-sm">15%</td>
                  <td className="px-4 py-3 text-sm">Technology, Customer experience</td>
                  <td className="px-4 py-3 text-sm">Limited distribution, High costs</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">Budget Solutions</td>
                  <td className="px-4 py-3 text-sm">20%</td>
                  <td className="px-4 py-3 text-sm">Low prices, Wide availability</td>
                  <td className="px-4 py-3 text-sm">Quality issues, Poor service</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">Niche Player</td>
                  <td className="px-4 py-3 text-sm">8%</td>
                  <td className="px-4 py-3 text-sm">Specialization, Loyal customers</td>
                  <td className="px-4 py-3 text-sm">Limited market, High prices</td>
                </tr>
                <tr className="bg-green-50">
                  <td className="px-4 py-3 text-sm font-medium">Your Company</td>
                  <td className="px-4 py-3 text-sm font-medium">{businessDetails.marketShare?.toFixed(2) || 0}%</td>
                  <td className="px-4 py-3 text-sm" colSpan="2">
                    {(businessDetails.marketShare || 0) < 1
                      ? 'New entrant with opportunity to disrupt'
                      : (businessDetails.marketShare || 0) < 5
                        ? 'Growing player with improving market position'
                        : (businessDetails.marketShare || 0) < 15
                          ? 'Established competitor with solid market presence'
                          : 'Major market player with significant influence'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2 text-yellow-800">Marketing Strategy Tips</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-yellow-800">
            <li>Invest in marketing consistently to build and maintain market share</li>
            <li>Balance marketing spend with operational capacity to fulfill orders</li>
            <li>Target marketing investments based on your competitive position</li>
            <li>Monitor customer acquisition costs and optimize for better ROI</li>
          </ul>
        </div>
      </div>
    </>
  )
}

function HRTab({ gameData, onUpdate }) {
  const businessDetails = gameData?.businessDetails || {};
  const [isHiring, setIsHiring] = useState(false);
  const [isFiring, setIsFiring] = useState(false);
  const [hiringPlan, setHiringPlan] = useState({
    count: 1,
    position: 'operations',
    salary: 25000,
    hiringCost: 10000
  });
  const [firingPlan, setFiringPlan] = useState({
    count: 1,
    severanceCost: 50000
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleHireEmployees = async () => {
    if (!hiringPlan.count) return;

    const totalCost = hiringPlan.count * hiringPlan.hiringCost;

    if (totalCost > (businessDetails.capital || 0)) {
      alert("You don't have enough capital for this hiring plan.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/game/business-typhoon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'hire-employees',
          payload: hiringPlan
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        onUpdate(updatedData);
        setHiringPlan({
          count: 1,
          position: 'operations',
          salary: 25000,
          hiringCost: 10000
        });
        setIsHiring(false);
      }
    } catch (error) {
      console.error('Failed to hire employees:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFireEmployees = async () => {
    if (!firingPlan.count) return;

    if (firingPlan.count > (businessDetails.employees || 0)) {
      alert("You can't fire more employees than you have.");
      return;
    }

    const totalCost = firingPlan.count * firingPlan.severanceCost;

    if (totalCost > (businessDetails.capital || 0)) {
      alert("You don't have enough capital for severance payments.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/game/business-typhoon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'fire-employees',
          payload: {
            ...firingPlan,
            salary: 25000 // Assuming average salary
          }
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        onUpdate(updatedData);
        setFiringPlan({
          count: 1,
          severanceCost: 50000
        });
        setIsFiring(false);
      }
    } catch (error) {
      console.error('Failed to fire employees:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-4 text-black">
          <h2 className="text-xl font-bold text-black">Human Resources</h2>
          <div className="space-x-2">
            <button
              onClick={() => { setIsHiring(true); setIsFiring(false); }}
              className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              Hire Employees
            </button>
            <button
              onClick={() => { setIsFiring(true); setIsHiring(false); }}
              className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              disabled={(businessDetails.employees || 0) <= 0}
            >
              Reduce Workforce
            </button>
          </div>
        </div>

        {isHiring && (
          <div className="mb-6 p-4 border border-green-200 rounded-lg bg-green-50">
            <h3 className="font-medium mb-3">Hiring Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Employees</label>
                <input
                  type="number"
                  value={hiringPlan.count}
                  onChange={(e) => setHiringPlan({ ...hiringPlan, count: parseInt(e.target.value) })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  min="1"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <select
                  value={hiringPlan.position}
                  onChange={(e) => setHiringPlan({ ...hiringPlan, position: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="operations">Operations Staff</option>
                  <option value="sales">Sales Representatives</option>
                  <option value="support">Customer Support</option>
                  <option value="admin">Administrative Staff</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Salary (₹)</label>
                <select
                  value={hiringPlan.salary}
                  onChange={(e) => setHiringPlan({
                    ...hiringPlan,
                    salary: parseInt(e.target.value),
                    hiringCost: parseInt(e.target.value) * 0.4 // Hiring cost is 40% of annual salary
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="20000">₹20,000 - Junior Level</option>
                  <option value="25000">₹25,000 - Standard</option>
                  <option value="35000">₹35,000 - Experienced</option>
                  <option value="50000">₹50,000 - Senior Level</option>
                </select>
              </div>
            </div>

            <div className="mb-4 p-3 bg-white rounded-lg">
              <h4 className="font-medium mb-2">Hiring Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Hiring Cost:</span>
                  <span className="font-medium ml-2">
                    ₹{(hiringPlan.count * hiringPlan.hiringCost).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Monthly Salary Cost:</span>
                  <span className="font-medium ml-2">
                    ₹{(hiringPlan.count * hiringPlan.salary).toLocaleString()}/month
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Production Capacity Increase:</span>
                  <span className="font-medium ml-2">
                    +{hiringPlan.count * 10} units/month
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Potential Revenue Increase:</span>
                  <span className="font-medium ml-2">
                    +₹{(hiringPlan.count * 50000).toLocaleString()}/month
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsHiring(false)}
                className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleHireEmployees}
                disabled={
                  isSubmitting ||
                  hiringPlan.count <= 0 ||
                  hiringPlan.count * hiringPlan.hiringCost > (businessDetails.capital || 0)
                }
                className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing...' : 'Hire Employees'}
              </button>
            </div>

            {hiringPlan.count * hiringPlan.hiringCost > (businessDetails.capital || 0) && (
              <div className="mt-2 text-sm text-red-600">
                You don't have enough capital for this hiring plan.
              </div>
            )}
          </div>
        )}

        {isFiring && (
          <div className="mb-6 p-4 border border-red-200 rounded-lg bg-red-50">
            <h3 className="font-medium mb-3">Workforce Reduction</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Employees to Let Go</label>
                <input
                  type="number"
                  value={firingPlan.count}
                  onChange={(e) => setFiringPlan({
                    ...firingPlan,
                    count: parseInt(e.target.value),
                    severanceCost: parseInt(e.target.value) * 50000
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  min="1"
                  max={businessDetails.employees || 0}
                />
              </div><div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Severance Package</label>
                <select
                  value={firingPlan.severanceCost / firingPlan.count}
                  onChange={(e) => setFiringPlan({
                    ...firingPlan,
                    severanceCost: parseInt(e.target.value) * firingPlan.count
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="25000">₹25,000 - Minimum Legal</option>
                  <option value="50000">₹50,000 - Standard</option>
                  <option value="75000">₹75,000 - Generous</option>
                  <option value="100000">₹100,000 - Executive</option>
                </select>
              </div>
            </div>

            <div className="mb-4 p-3 bg-white rounded-lg">
              <h4 className="font-medium mb-2">Reduction Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Total Severance Cost:</span>
                  <span className="font-medium ml-2">
                    ₹{firingPlan.severanceCost.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Monthly Salary Savings:</span>
                  <span className="font-medium ml-2">
                    ₹{(firingPlan.count * 25000).toLocaleString()}/month
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Production Capacity Decrease:</span>
                  <span className="font-medium ml-2 text-red-600">
                    -{firingPlan.count * 10} units/month
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Potential Revenue Decrease:</span>
                  <span className="font-medium ml-2 text-red-600">
                    -₹{(firingPlan.count * 50000).toLocaleString()}/month
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsFiring(false)}
                className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleFireEmployees}
                disabled={
                  isSubmitting ||
                  firingPlan.count <= 0 ||
                  firingPlan.count > (businessDetails.employees || 0) ||
                  firingPlan.severanceCost > (businessDetails.capital || 0)
                }
                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing...' : 'Reduce Workforce'}
              </button>
            </div>

            {firingPlan.count > (businessDetails.employees || 0) && (
              <div className="mt-2 text-sm text-red-600">
                You can't reduce more employees than you currently have.
              </div>
            )}

            {firingPlan.severanceCost > (businessDetails.capital || 0) && (
              <div className="mt-2 text-sm text-red-600">
                You don't have enough capital for severance payments.
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-black">
          <div>
            <h3 className="font-medium mb-3 text-black">Workforce Overview</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Employees:</span>
                  <span className="font-medium">{businessDetails.employees || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Salary Expenses:</span>
                  <span className="font-medium">₹{((businessDetails.employees || 0) * 25000).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Salary:</span>
                  <span className="font-medium">₹25,000</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between mb-1">
                  <span>Workforce Size</span>
                  <span>
                    {(businessDetails.employees || 0) < 5 ? 'Startup Team' :
                      (businessDetails.employees || 0) < 20 ? 'Small Business' :
                        (businessDetails.employees || 0) < 50 ? 'Medium Enterprise' :
                          (businessDetails.employees || 0) < 100 ? 'Large Company' :
                            'Corporation'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-green-500"
                    style={{ width: `${Math.min(100, (businessDetails.employees || 0))}%` }}

                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-600">
                  <span>0</span>
                  <span>50</span>
                  <span>100+</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Productivity Metrics</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Revenue per Employee:</span>
                  <span className="font-medium">
                    ₹{businessDetails.revenue && businessDetails.employees && gameData?.progress
                      ? ((businessDetails.revenue / gameData.progress) / businessDetails.employees).toLocaleString()
                      : 0}/month
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Production Capacity:</span>
                  <span className="font-medium">{(businessDetails.employees || 0) * 10} units/month</span>
                </div>
                <div className="flex justify-between">
                  <span>Efficiency:</span>
                  <span className={`font-medium ${(businessDetails.inventory || 0) >= (businessDetails.employees || 0) * 10
                      ? 'text-green-600'
                      : 'text-red-600'
                    }`}>
                    {(businessDetails.inventory || 0) >= (businessDetails.employees || 0) * 10
                      ? '100%'
                      : `${Math.floor(((businessDetails.inventory || 0) / ((businessDetails.employees || 1) * 10)) * 100)}%`}
                  </span>

                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <p>Each employee can generate up to ₹50,000 in monthly revenue when provided with sufficient inventory.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-black">
          <h3 className="font-medium mb-3 text-black">Department Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Department</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Employees</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Monthly Cost</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Contribution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm">Operations</td>
                  <td className="px-4 py-3 text-sm">{Math.floor((businessDetails.employees || 0) * 0.5)}</td>
                  <td className="px-4 py-3 text-sm">₹{(Math.floor((businessDetails.employees || 0) * 0.5) * 25000).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm">Production, Inventory Management</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">Sales & Marketing</td>
                  <td className="px-4 py-3 text-sm">{Math.floor((businessDetails.employees || 0) * 0.3)}</td>
                  <td className="px-4 py-3 text-sm">₹{(Math.floor((businessDetails.employees || 0) * 0.3) * 25000).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm">Revenue Generation, Market Share</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">Customer Support</td>
                  <td className="px-4 py-3 text-sm">{Math.floor((businessDetails.employees || 0) * 0.1)}</td>
                  <td className="px-4 py-3 text-sm">₹{(Math.floor((businessDetails.employees || 0) * 0.1) * 25000).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm">Customer Satisfaction, Retention</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">Administration</td>
                  <td className="px-4 py-3 text-sm">{Math.ceil((businessDetails.employees || 0) * 0.1)}</td>
                  <td className="px-4 py-3 text-sm">₹{(Math.ceil((businessDetails.employees || 0) * 0.1) * 25000).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm">HR, Finance, Legal, Management</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2 text-yellow-800">HR Management Tips</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-yellow-800">
            <li>Match your workforce size to your production needs and market demand</li>
            <li>Ensure you have sufficient inventory for your employees to process</li>
            <li>Consider the long-term impact of hiring and firing decisions</li>
            <li>Monitor revenue per employee to ensure profitability</li>
          </ul>
        </div>
      </div >
    </>
  );
}