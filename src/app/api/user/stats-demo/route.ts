import { NextRequest, NextResponse } from 'next/server';
import { getUserByFid, getUserStats } from '~/lib/database';

// Demo endpoint that bypasses authentication for testing
export async function GET(request: NextRequest) {
  try {
    // Get the first user from the database (for demo purposes)
    const { getAllUsers } = await import('~/lib/database');
    const users = getAllUsers.all() as any[];
    if (users.length === 0) {
      return NextResponse.json({ collabs_hosted: 0, collabs_joined: 0, proofs_submitted: 0 });
    }
    
    // Use the first user's ID
    const userId = users[0].id;
    const stats = getUserStats.get(userId, userId, userId);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json({ error: 'Failed to fetch user stats' }, { status: 500 });
  }
}
