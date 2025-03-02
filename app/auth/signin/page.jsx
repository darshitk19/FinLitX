// app/auth/signin/page.jsx
'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">FinCity</h1>
          <p className="text-gray-600 mt-2">Your financial education adventure begins here</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="flex items-center justify-center w-full bg-white border border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-50 transition"
          >
           <Image src="/google-logo.svg" alt="Google" width={20} height={20} className="mr-2" />
            <span>Continue with Google</span>
          </button>
          
          <div className="text-center text-sm text-gray-500 mt-4">
            <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </div>
    </div>
  );
}