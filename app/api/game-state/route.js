// app/api/game-state/route.js
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
  
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  
  if (!path || !['job-saving', 'business-typhoon', 'early-retirement'].includes(path)) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  }
  
  try {
    await connectToDatabase();
    
    const user = await User.findOne({ email: session.user.email });
    
    if (!user || !user.gameState || user.gameState.currentPath !== path) {
      return NextResponse.json({ error: 'Game not started for this path' }, { status: 404 });
    }
    
    return NextResponse.json(user.gameState);
  } catch (error) {
    console.error('Error fetching game state:', error);
    return NextResponse.json({ error: 'Failed to fetch game state' }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { gameState } = await request.json();
    
    await connectToDatabase();
    
    await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        $set: { 
          gameState: {
            ...gameState,
            lastPlayed: new Date()
          }
        }
      }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating game state:', error);
    return NextResponse.json({ error: 'Failed to update game state' }, { status: 500 });
  }
}