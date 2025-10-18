import { NextRequest, NextResponse } from 'next/server';
import { getUserByFid, getUserJoinedCollabs } from '~/lib/database';

// Demo endpoint that bypasses authentication for testing
export async function GET(request: NextRequest) {
  try {
    // Get the first user from the database (for demo purposes)
    const { getAllUsers } = await import('~/lib/database');
    const users = getAllUsers.all() as any[];
    if (users.length === 0) {
      return NextResponse.json([]);
    }
    
    // Use the first user's ID
    const userId = users[0].id;
    const collabs = getUserJoinedCollabs.all(userId);
    return NextResponse.json(collabs);
  } catch (error) {
    console.error('Error fetching joined collabs:', error);
    return NextResponse.json({ error: 'Failed to fetch joined collabs' }, { status: 500 });
  }
}
