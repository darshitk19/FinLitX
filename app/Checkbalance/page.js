"use client"
import { useRouter } from "next/navigation";
export default function CheckBalance() {
    const router = useRouter();
    return (
      <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Check Balance</h1>
        <p className="text-gray-600">Your current balance is:</p>
        <p className="text-3xl font-semibold text-green-600">₹50,000</p>
        <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-gray-200 rounded-md">Go Back</button>
      </div>
    );
  }