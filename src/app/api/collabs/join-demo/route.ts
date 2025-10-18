import { NextRequest, NextResponse } from 'next/server';
import { joinCollab, getCollabById } from '~/lib/database';

// Demo endpoint that bypasses authentication for testing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { collabId, proofText, proofImageUrl } = body;

    if (!collabId) {
      return NextResponse.json({ error: 'Collab ID is required' }, { status: 400 });
    }

    // Use a demo user ID for testing
    const demoUserId = 1;

    // Check if collab exists and is still active
    const collab = getCollabById.get(collabId) as any;
    if (!collab) {
      return NextResponse.json({ error: 'Collab not found' }, { status: 404 });
    }

    if (new Date(collab.end_time) < new Date()) {
      return NextResponse.json({ error: 'Collab has ended' }, { status: 400 });
    }

    // Join the collab
    try {
      joinCollab.run(collabId, demoUserId, proofText || null, proofImageUrl || null);
      
      return NextResponse.json({ 
        message: 'Successfully joined collab',
        collabId,
        userId: demoUserId 
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
        return NextResponse.json({ error: 'Already joined this collab' }, { status: 400 });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error joining collab:', error);
    return NextResponse.json({ error: 'Failed to join collab' }, { status: 500 });
  }
}
