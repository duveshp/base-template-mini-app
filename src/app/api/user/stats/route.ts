import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '~/lib/auth';
import { getUserByFid, getUserStats } from '~/lib/database';

export async function GET(request: NextRequest) {
  try {
    const fid = await verifyAuth(request);
    if (!fid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = getUserByFid.get(fid);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const stats = getUserStats.get(user.id, user.id, user.id);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json({ error: 'Failed to fetch user stats' }, { status: 500 });
  }
}
