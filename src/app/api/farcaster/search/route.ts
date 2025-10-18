import { NextRequest, NextResponse } from 'next/server';
import { searchUsers } from '~/lib/neynar-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const users = await searchUsers(query, limit);
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error searching Farcaster users:', error);
    return NextResponse.json({ error: 'Failed to search users' }, { status: 500 });
  }
}
