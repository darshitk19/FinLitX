"use client"
import { useRouter } from "next/navigation";
export default function FixedDeposits() {
    const router = useRouter();
    return (
      <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Fixed Deposits</h1>
        <p className="text-gray-600">Your fixed deposit details:</p>
        <p className="text-gray-700">Total FD Amount: <span className="text-green-600 font-bold">₹5,00,000</span></p>
        <p className="text-gray-700">Interest Rate: <span className="font-semibold">6.5% per annum</span></p>
        <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-gray-200 rounded-md">Go Back</button>
      </div>
    );
  }