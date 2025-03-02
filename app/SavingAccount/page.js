"use client"
import { useRouter } from "next/navigation";
export default function SavingsAccount() {
    const router = useRouter();
    return (
      <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Savings Account</h1>
        <p className="text-gray-600">Current interest rate: <span className="font-semibold">4.5% per annum</span></p>
        <p className="text-gray-700">Your savings balance: <span className="text-blue-600 font-bold">₹2,00,000</span></p>
        <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-gray-200 rounded-md">Go Back</button>
      </div>
    );
  }