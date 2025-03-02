// app/page.js
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-purple-700 text-white">
      <div className="container mx-auto px-4 py-12">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">FinCity</h1>
          <Link href="/auth/signin" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition">
            Sign In
          </Link>
        </header>
        
        <main className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold leading-tight">Learn Financial Literacy Through Play</h2>
              <p className="mt-6 text-lg text-blue-100">
                FinCity is an immersive 3D financial education game that teaches you 
                how to manage money, build businesses, and plan for early retirement.
              </p>
              
              <div className="mt-10">
                <Link 
                  href="/auth/signin" 
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-50 transition transform hover:scale-105 inline-block"
                >
                  Start Your Journey
                </Link>
              </div>
              
              <div className="mt-12 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="mt-2">Money Management</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="mt-2">Business Skills</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="mt-2">Investment Strategy</p>
                </div>
              </div>
            </div>
            
            <div className="relative h-[400px] md:h-[500px]">
              <div className="absolute inset-0 bg-white bg-opacity-10 rounded-xl overflow-hidden">
                {/* This would be replaced with a 3D city preview */}
                <div className="h-full flex items-center justify-center">
                  <p className="text-lg">3D City Preview</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center">Choose Your Path</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
              <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm">
                <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Job Saving</h3>
                <p className="text-blue-100">
                  Manage your salary wisely, reduce expenses, and build savings. 
                  Learn to handle EMIs and create a solid financial foundation.
                </p>
              </div>
              
              <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm">
                <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Business Typhoon</h3>
                <p className="text-blue-100">
                  Start with ₹1 crore and build your business empire. Navigate supply chains, 
                  manage employees, and stay ahead of competition.
                </p>
              </div>
              
              <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm">
                <div className="h-12 w-12 bg-purple-500 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Early Retirement</h3>
                <p className="text-blue-100">
                  Master investment strategies in fluctuating markets. Build wealth
                  and plan for an early, comfortable retirement.
                </p>
              </div>
            </div>
          </div>
        </main>
        
        <footer className="mt-20 text-center text-blue-200 pb-8">
          <p> 2025 FinCity - ODOO X CHARUSAT</p>
        </footer>
      </div>
    </div>
  );
}