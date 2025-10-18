import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '~/lib/auth';
import { getAllCollabs, createCollab } from '~/lib/database';

export async function GET() {
  try {
    const collabs = getAllCollabs.all();
    return NextResponse.json(collabs);
  } catch (error) {
    console.error('Error fetching collabs:', error);
    return NextResponse.json({ error: 'Failed to fetch collabs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const fid = await verifyAuth(request);
    if (!fid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, emoji, description, category, start_time, end_time, max_participants, media_url } = body;

    // Validate required fields
    if (!title || !emoji || !description || !category || !start_time || !end_time || !max_participants) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get user ID from FID (assuming user exists)
    const { getUserByFid } = await import('~/lib/database');
    const user = getUserByFid.get(fid) as { id: number; name: string } | undefined;
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const result = createCollab.run(
      title,
      emoji,
      description,
      category,
      start_time,
      end_time,
      max_participants,
      user.id,
      media_url || null
    );

    const newCollabId = result.lastInsertRowid;
    
    // Fetch the created collab with host info
    const { getCollabById } = await import('~/lib/database');
    const newCollab = getCollabById.get(newCollabId);

    return NextResponse.json(newCollab, { status: 201 });
  } catch (error) {
    console.error('Error creating collab:', error);
    return NextResponse.json({ error: 'Failed to create collab' }, { status: 500 });
  }
}
