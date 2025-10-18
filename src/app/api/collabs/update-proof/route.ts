import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '~/lib/auth';
import { updateParticipantProof } from '~/lib/database';

export async function PUT(request: NextRequest) {
  try {
    const fid = await verifyAuth(request);
    if (!fid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { collabId, proofText, proofImageUrl } = body;

    if (!collabId) {
      return NextResponse.json({ error: 'Collab ID is required' }, { status: 400 });
    }

    // Get user ID from FID
    const { getUserByFid } = await import('~/lib/database');
    const user = getUserByFid.get(fid);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update the proof
    const result = updateParticipantProof.run(
      proofText || null,
      proofImageUrl || null,
      collabId,
      user.id
    );

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Participant not found or not joined to this collab' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Proof updated successfully',
      collabId,
      userId: user.id 
    });
  } catch (error) {
    console.error('Error updating proof:', error);
    return NextResponse.json({ error: 'Failed to update proof' }, { status: 500 });
  }
}
