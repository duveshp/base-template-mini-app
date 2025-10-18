import { NextRequest, NextResponse } from 'next/server';
import { createCollab, getCollabById } from '~/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, emoji, description, category, start_time, end_time, max_participants, host_id, media_url } = body;

    // Validate required fields
    if (!title || !emoji || !description || !category || !start_time || !end_time || !max_participants || !host_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = createCollab.run(
      title,
      emoji,
      description,
      category,
      start_time,
      end_time,
      max_participants,
      host_id,
      media_url || null
    );

    const newCollabId = result.lastInsertRowid;

    // Fetch the created collab with host info
    const newCollab = getCollabById.get(newCollabId);

    return NextResponse.json(newCollab, { status: 201 });
  } catch (error) {
    console.error('Error creating collab:', error);
    return NextResponse.json({ error: 'Failed to create collab' }, { status: 500 });
  }
}
