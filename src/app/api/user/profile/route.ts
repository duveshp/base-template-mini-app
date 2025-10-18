import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '~/lib/auth';
import { getUserByFid, createUser, updateUser } from '~/lib/database';

export async function GET(request: NextRequest) {
  try {
    const fid = await verifyAuth(request);
    if (!fid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = getUserByFid.get(fid);
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
    const fid = await verifyAuth(request);
    if (!fid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, avatar, role, interests, address } = body;

    if (!name || !address) {
      return NextResponse.json({ error: 'Name and address are required' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = getUserByFid.get(fid);
    
    if (existingUser) {
      // Update existing user
      updateUser.run(name, avatar || null, role || 'User', interests || null, existingUser.id);
      const updatedUser = getUserByFid.get(fid);
      return NextResponse.json(updatedUser);
    } else {
      // Create new user
      createUser.run(fid, address, name, avatar || null, role || 'User', interests || null);
      const newUser = getUserByFid.get(fid);
      return NextResponse.json(newUser, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating/updating user profile:', error);
    return NextResponse.json({ error: 'Failed to create/update user profile' }, { status: 500 });
  }
}
