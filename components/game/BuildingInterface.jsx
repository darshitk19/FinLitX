import Link from "next/link";
export default function BuildingInterface({ building, gamePath, gameData, onClose }) {
    return (
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              {building === 'bank' ? 'Bank' :
               building === 'stockMarket' ? 'Stock Market' :
               building === 'mall' ? 'Shopping Mall' : 'Industry'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-4">
            {building === 'bank' && <BankInterface gamePath={gamePath} gameData={gameData} />}
            {building === 'stockMarket' && <StockMarketInterface gamePath={gamePath} gameData={gameData} />}
            {building === 'mall' && <MallInterface gamePath={gamePath} gameData={gameData} />}
            {building === 'industry' && <IndustryInterface gamePath={gamePath} gameData={gameData} />}
          </div>
        </div>
      </div>
    );
  }

  function BankInterface({ gamePath, gameData }) {
    if (gamePath === 'job-saving') {
      return (
        <div>
          <h3 className="font-semibold mb-4 text-black">Banking Services</h3>

          <div className="grid grid-cols-2 gap-4 mb-6 text-black">
            <Link href={"/Checkbalance"}> <button className="p-3 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Check Balance
            </button></Link>
            <Link href={"/ApplyLoan"}>
            <button className="p-3 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Apply for Loan
            </button>
            </Link>
            <Link href={"/SavingAccount"}>
            <button className="p-3 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Savings Account
            </button>
            </Link>
            <Link href={"/SavingAccount"}>
            <button className="p-3 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Fixed Deposits
            </button>
            </Link>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Your Financial Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Current Balance:</span>
                <span className="font-medium">₹{gameData?.savings?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Income:</span>
                <span className="font-medium">₹{gameData?.salary?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Expenses:</span>
                <span className="font-medium">
                  ₹{gameData?.expenses?.reduce((sum, exp) => sum + exp.amount, 0)?.toLocaleString() || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (gamePath === 'business-typhoon') {
      return (
        <div>
          <h3 className="font-semibold mb-4">Business Banking</h3>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button className="p-3 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Business Account
            </button>
            <button className="p-3 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Business Loan
            </button>
            <button className="p-3 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center text-black">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Payroll Management
            </button>
            <button className="p-3 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center text-black">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Merchant Services
            </button>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Business Financial Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Capital:</span>
                <span className="font-medium">₹{gameData?.businessDetails?.capital?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Revenue:</span>
                <span className="font-medium">₹{gameData?.businessDetails?.revenue?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Expenses:</span>
                <span className="font-medium">₹{gameData?.businessDetails?.expenses?.toLocaleString() || 0}</span>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <h3 className="font-semibold mb-4">Retirement Planning</h3>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button className="p-3 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Retirement Calculator
            </button>
            <button className="p-3 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Savings Account
            </button>
            <button className="p-3 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Insurance Products
            </button>
            <button className="p-3 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
              </svg>
              Pension Plans
            </button>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Retirement Financial Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Savings:</span>
                <span className="font-medium">₹{gameData?.savings?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Income:</span>
                <span className="font-medium">₹{gameData?.salary?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Investment Value:</span>
                <span className="font-medium">
                  ₹{gameData?.investments?.reduce((sum, inv) => sum + inv.amount, 0)?.toLocaleString() || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  function StockMarketInterface({ gamePath, gameData }) {
    return (
      <div>
        <h3 className="font-semibold mb-4">Investment Options</h3>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button className="p-3 bg-green-100 hover:bg-green-200 rounded-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Stock Market
          </button>
          <button className="p-3 bg-green-100 hover:bg-green-200 rounded-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Mutual Funds
        </button>
        <button className="p-3 bg-green-100 hover:bg-green-200 rounded-lg flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Index Funds
        </button>
        <button className="p-3 bg-green-100 hover:bg-green-200 rounded-lg flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Bonds
        </button>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Market Overview</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Sensex</span>
            <div className="flex items-center">
              <span className="font-medium mr-2">58,245.75</span>
              <span className="text-green-600 text-sm">+1.2%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span>Nifty</span>
            <div className="flex items-center">
              <span className="font-medium mr-2">17,354.05</span>
              <span className="text-green-600 text-sm">+0.9%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span>Gold</span>
            <div className="flex items-center">
              <span className="font-medium mr-2">₹48,350</span>
              <span className="text-red-600 text-sm">-0.3%</span>
            </div>
          </div>
        </div>
      </div>

      {gamePath === 'early-retirement' && (
        <div className="mt-4 p-4 border border-green-200 rounded-lg">
          <h4 className="font-medium mb-2">Your Investment Portfolio</h4>
          {gameData?.investments?.length > 0 ? (
            <div className="space-y-2">
              {gameData.investments.map((investment, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span>{investment.type}</span>
                  <div>
                    <span className="font-medium">₹{investment.amount.toLocaleString()}</span>
                    <span className="text-xs text-gray-500 ml-2">({investment.returnRate}% return)</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">No investments yet. Start investing to build your portfolio.</div>
          )}
        </div>
      )}
    </div>
  );
}

function MallInterface({ gamePath, gameData }) {
  return (
    <div>
      <h3 className="font-semibold mb-4">Shopping & Expenses</h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <button className="p-3 bg-purple-100 hover:bg-purple-200 rounded-lg flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Essentials
        </button>
        <button className="p-3 bg-purple-100 hover:bg-purple-200 rounded-lg flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
          Lifestyle
        </button>
        <button className="p-3 bg-purple-100 hover:bg-purple-200 rounded-lg flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Electronics
        </button>
        <button className="p-3 bg-purple-100 hover:bg-purple-200 rounded-lg flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          Travel
        </button>
      </div>

      {gamePath === 'job-saving' && (
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Your Monthly Expenses</h4>
          {gameData?.expenses?.length > 0 ? (
            <div className="space-y-2">
              {gameData.expenses.map((expense, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span>{expense.category}</span>
                  <div>
                    <span className="font-medium">₹{expense.amount.toLocaleString()}</span>
                    {expense.recurring && (
                      <span className="text-xs text-gray-500 ml-2">(Monthly)</span>
                    )}
                  </div>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t border-purple-200 flex justify-between font-semibold">
                <span>Total Monthly Expenses</span>
                <span>
                  ₹{gameData.expenses
                    .filter(exp => exp.recurring)
                    .reduce((sum, exp) => sum + exp.amount, 0)
                    .toLocaleString()}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-gray-500">No expenses recorded yet.</div>
          )}
        </div>
      )}

      {gamePath === 'business-typhoon' && (
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Business Expenses</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Rent</span>
              <span className="font-medium">₹25,000</span>
            </div>
            <div className="flex justify-between">
              <span>Utilities</span>
              <span className="font-medium">₹12,500</span>
            </div>
            <div className="flex justify-between">
              <span>Employee Salaries</span>
              <span className="font-medium">₹{(gameData?.businessDetails?.employees * 25000).toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Marketing</span>
              <span className="font-medium">₹35,000</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function IndustryInterface({ gamePath, gameData }) {
  if (gamePath === 'business-typhoon') {
    return (
      <div>
        <h3 className="font-semibold mb-4">Business Operations</h3>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button className="p-3 bg-amber-100 hover:bg-amber-200 rounded-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Manage Employees
          </button>
          <button className="p-3 bg-amber-100 hover:bg-amber-200 rounded-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
            Supply Chain
          </button>
          <button className="p-3 bg-amber-100 hover:bg-amber-200 rounded-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            Market Analysis
          </button>
          <button className="p-3 bg-amber-100 hover:bg-amber-200 rounded-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Inventory
          </button>
        </div>

        <div className="bg-amber-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Business Status</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Employees:</span>
              <span className="font-medium">{gameData?.businessDetails?.employees || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Revenue:</span>
              <span className="font-medium">₹{gameData?.businessDetails?.revenue?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Expenses:</span>
              <span className="font-medium">₹{gameData?.businessDetails?.expenses?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Profit:</span>
              <span className={`font-medium ${
                (gameData?.businessDetails?.revenue - gameData?.businessDetails?.expenses) >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                ₹{((gameData?.businessDetails?.revenue || 0) - (gameData?.businessDetails?.expenses || 0)).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <h3 className="font-semibold mb-4">Career Development</h3>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button className="p-3 bg-amber-100 hover:bg-amber-200 rounded-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Job Opportunities
          </button>
          <button className="p-3 bg-amber-100 hover:bg-amber-200 rounded-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
            </svg>
            Skill Development
          </button>
          <button className="p-3 bg-amber-100 hover:bg-amber-200 rounded-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Industry Trends
          </button>
          <button className="p-3 bg-amber-100 hover:bg-amber-200 rounded-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Networking
          </button>
        </div>

        <div className="bg-amber-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Career Status</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Current Position:</span>
              <span className="font-medium">Senior Associate</span>
            </div>
            <div className="flex justify-between">
              <span>Monthly Salary:</span>
              <span className="font-medium">₹{gameData?.salary?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Skills:</span>
              <span className="font-medium">Level 3</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}