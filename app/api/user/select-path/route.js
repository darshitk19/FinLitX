// app/api/user/select-path/route.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { path } = await request.json();
    
    if (!['job-saving', 'business-typhoon', 'early-retirement'].includes(path)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }
    
    await connectToDatabase();
    
    let initialGameState = {
      currentPath: path,
      progress: 0,
      lastPlayed: new Date()
    };
    
    // Set initial state based on path
    if (path === 'job-saving') {
      const salary = Math.floor(Math.random() * (250000 - 10000 + 1)) + 10000;
      initialGameState.salary = salary;
      initialGameState.savings = 0;
      initialGameState.expenses = [
        { category: 'Rent', amount: salary * 0.3, recurring: true },
        { category: 'Food', amount: salary * 0.15, recurring: true },
        { category: 'Transport', amount: salary * 0.1, recurring: true },
      ];
    } else if (path === 'business-typhoon') {
      initialGameState.businessDetails = {
        capital: 10000000, // 1 crore
        employees: 5,
        revenue: 0,
        expenses: 100000,
        inventory: 0
      };
    } else if (path === 'early-retirement') {
      initialGameState.salary = 80000;
      initialGameState.savings = 200000;
      initialGameState.investments = [];
    }
    
    await User.findOneAndUpdate(
      { email: session.user.email },
      { gameState: initialGameState }
    );
    
    return NextResponse.json({ success: true, path });
  } catch (error) {
    console.error('Error selecting path:', error);
    return NextResponse.json({ error: 'Failed to select path' }, { status: 500 });
  }
}
