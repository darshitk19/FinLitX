// app/api/user/game-data/route.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    await connectToDatabase();
    
    const user = await User.findOne({ email: session.user.email });
    
    if (!user || !user.gameState) {
      return NextResponse.json({ error: 'No game data found' }, { status: 404 });
    }
    
    return NextResponse.json(user.gameState);
  } catch (error) {
    console.error('Error fetching user game data:', error);
    return NextResponse.json({ error: 'Failed to fetch game data' }, { status: 500 });
  }
}