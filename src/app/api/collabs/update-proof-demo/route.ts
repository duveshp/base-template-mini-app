import { NextRequest, NextResponse } from 'next/server';
import { updateParticipantProof } from '~/lib/database';

// Demo endpoint that bypasses authentication for testing
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { collabId, proofText, proofImageUrl } = body;

    if (!collabId) {
      return NextResponse.json({ error: 'Collab ID is required' }, { status: 400 });
    }

    // Use a demo user ID for testing
    const demoUserId = 1;

    // Update the proof
    const result = updateParticipantProof.run(
      proofText || null,
      proofImageUrl || null,
      collabId,
      demoUserId
    );

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Participant not found or not joined to this collab' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Proof updated successfully',
      collabId,
      userId: demoUserId 
    });
  } catch (error) {
    console.error('Error updating proof:', error);
    return NextResponse.json({ error: 'Failed to update proof' }, { status: 500 });
  }
}
