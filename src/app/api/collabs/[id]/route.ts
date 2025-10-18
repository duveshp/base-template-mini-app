import { NextRequest, NextResponse } from 'next/server';
import { getCollabById, getCollabParticipants } from '~/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const collabId = parseInt(id);
    if (isNaN(collabId)) {
      return NextResponse.json({ error: 'Invalid collab ID' }, { status: 400 });
    }

    const collab = getCollabById.get(collabId);
    if (!collab) {
      return NextResponse.json({ error: 'Collab not found' }, { status: 404 });
    }

    const participants = getCollabParticipants.all(collabId);
    
    return NextResponse.json({
      ...collab,
      participants
    });
  } catch (error) {
    console.error('Error fetching collab:', error);
    return NextResponse.json({ error: 'Failed to fetch collab' }, { status: 500 });
  }
}
