import { NextRequest, NextResponse } from 'next/server';
import { fetchUserProfile, fetchUserCasts } from '~/lib/neynar-client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fid: string }> }
) {
  try {
    const { fid: fidString } = await params;
    const fid = parseInt(fidString);
    const { searchParams } = new URL(request.url);
    const includeCasts = searchParams.get('includeCasts') === 'true';
    const limit = parseInt(searchParams.get('limit') || '10');

    const user = await fetchUserProfile(fid);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const result: any = { user };

    if (includeCasts) {
      const casts = await fetchUserCasts(fid, limit);
      result.casts = casts;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching Farcaster user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}
