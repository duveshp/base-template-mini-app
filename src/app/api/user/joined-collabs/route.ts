import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '~/lib/auth';
import { getUserByFid, getUserJoinedCollabs } from '~/lib/database';

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

    const collabs = getUserJoinedCollabs.all(user.id);
    return NextResponse.json(collabs);
  } catch (error) {
    console.error('Error fetching joined collabs:', error);
    return NextResponse.json({ error: 'Failed to fetch joined collabs' }, { status: 500 });
  }
}
