import { NextRequest, NextResponse } from 'next/server';
import { getUserByFid, createUser, updateUser } from '~/lib/database';

// Demo endpoint that bypasses authentication for testing
export async function GET(request: NextRequest) {
  try {
    // Use a demo FID for testing
    const demoFid = 12345;
    const user = getUserByFid.get(demoFid) as any;
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, avatar, role, interests, address } = body;

    if (!name || !address) {
      return NextResponse.json({ error: 'Name and address are required' }, { status: 400 });
    }

    // Use a demo FID for testing
    const demoFid = 12345;
    
    // Check if user exists
    const existingUser = getUserByFid.get(demoFid) as any;
    
    if (existingUser) {
      // Update existing user
      updateUser.run(name, avatar || null, role || 'User', interests || null, existingUser.id);
      const updatedUser = getUserByFid.get(demoFid) as any;
      return NextResponse.json(updatedUser);
    } else {
      // Create new user
      createUser.run(demoFid, address, name, avatar || null, role || 'User', interests || null);
      const newUser = getUserByFid.get(demoFid) as any;
      return NextResponse.json(newUser, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating/updating user profile:', error);
    return NextResponse.json({ error: 'Failed to create/update user profile' }, { status: 500 });
  }
}
