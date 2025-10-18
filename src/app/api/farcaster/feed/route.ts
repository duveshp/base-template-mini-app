import { NextRequest, NextResponse } from 'next/server';
import { fetchFeed } from '~/lib/neynar-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!fid) {
      return NextResponse.json({ error: 'FID is required' }, { status: 400 });
    }

    const feed = await fetchFeed(parseInt(fid), limit);
    return NextResponse.json(feed);
  } catch (error) {
    console.error('Error fetching Farcaster feed:', error);
    return NextResponse.json({ error: 'Failed to fetch feed' }, { status: 500 });
  }
}
