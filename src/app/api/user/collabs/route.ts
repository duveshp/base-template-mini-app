import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '~/lib/auth';
import { getUserByFid, getUserCollabs } from '~/lib/database';

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

    const collabs = getUserCollabs.all(user.id);
    return NextResponse.json(collabs);
  } catch (error) {
    console.error('Error fetching user collabs:', error);
    return NextResponse.json({ error: 'Failed to fetch user collabs' }, { status: 500 });
  }
}
