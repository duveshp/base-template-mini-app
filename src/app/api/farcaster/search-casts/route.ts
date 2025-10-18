import { NextRequest, NextResponse } from 'next/server';
import { searchCasts } from '~/lib/neynar-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const casts = await searchCasts(query, limit);
    return NextResponse.json({ casts });
  } catch (error) {
    console.error('Error searching Farcaster casts:', error);
    return NextResponse.json({ error: 'Failed to search casts' }, { status: 500 });
  }
}
