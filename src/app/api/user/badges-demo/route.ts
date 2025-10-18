import { NextRequest, NextResponse } from 'next/server';
import { getUserByFid, getUserBadges } from '~/lib/database';

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
    const badges = getUserBadges.all(userId);
    return NextResponse.json(badges);
  } catch (error) {
    console.error('Error fetching user badges:', error);
    return NextResponse.json({ error: 'Failed to fetch user badges' }, { status: 500 });
  }
}
