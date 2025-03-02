"use client"
import { useRouter } from "next/navigation";

export default function ApplyLoan() {
    const router = useRouter();
    return (
      <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Apply for Loan</h1>
        <p className="text-gray-600">Loan options available:</p>
        <ul className="text-gray-700 space-y-2">
          <li>🏠 Home Loan - Up to ₹50,00,000</li>
          <li>🚗 Car Loan - Up to ₹10,00,000</li>
          <li>🎓 Education Loan - Up to ₹5,00,000</li>
        </ul>
        <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-gray-200 rounded-md">Go Back</button>
      </div>
    );
  }