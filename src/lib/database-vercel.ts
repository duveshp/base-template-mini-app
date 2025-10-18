// In-memory database for Vercel serverless deployment
// Note: Data will reset on each deployment and after inactivity

interface User {
  id: number;
  fid: number;
  address: string;
  name: string;
  avatar?: string;
  role: 'User' | 'Organization';
  interests?: string;
  created_at: string;
  updated_at: string;
}

interface Collab {
  id: number;
  title: string;
  emoji: string;
  description: string;
  category: string;
  start_time: string;
  end_time: string;
  max_participants: number;
  host_id: number;
  media_url?: string;
  created_at: string;
  updated_at: string;
}

interface Participant {
  id: number;
  collab_id: number;
  user_id: number;
  proof_text?: string;
  proof_image_url?: string;
  joined_at: string;
}

interface Badge {
  id: number;
  user_id: number;
  badge_type: string;
  earned_at: string;
}

// In-memory storage
let users: User[] = [];
let collabs: Collab[] = [];
let participants: Participant[] = [];
let badges: Badge[] = [];

// Auto-increment IDs
let userIdCounter = 1;
let collabIdCounter = 1;
let participantIdCounter = 1;
let badgeIdCounter = 1;

// Initialize with demo data
function initializeData() {
  if (users.length === 0) {
    // Create demo users
    users = [
      {
        id: userIdCounter++,
        fid: 12345,
        address: '0x1234567890123456789012345678901234567890',
        name: 'Demo User',
        role: 'User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    // Create demo collabs
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    collabs = [
      {
        id: collabIdCounter++,
        title: 'Morning Yoga Challenge',
        emoji: '🧘',
        description: 'Join us for a 7-day morning yoga challenge!',
        category: 'Fitness',
        start_time: tomorrow.toISOString(),
        end_time: nextWeek.toISOString(),
        max_participants: 20,
        host_id: 1,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      },
    ];
  }
}

// User operations
export const getUserByFid = {
  get: (fid: number) => {
    initializeData();
    return users.find(u => u.fid === fid);
  }
};

export const getUserById = {
  get: (id: number) => {
    initializeData();
    return users.find(u => u.id === id);
  }
};

export const createUser = {
  run: (fid: number, address: string, name: string, avatar: string | null, role: string, interests: string | null) => {
    initializeData();
    const user: User = {
      id: userIdCounter++,
      fid,
      address,
      name,
      avatar: avatar || undefined,
      role: role as 'User' | 'Organization',
      interests: interests || undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    users.push(user);
    return { lastInsertRowid: user.id };
  }
};

export const updateUser = {
  run: (name: string, avatar: string | null, role: string, interests: string | null, id: number) => {
    initializeData();
    const user = users.find(u => u.id === id);
    if (user) {
      user.name = name;
      user.avatar = avatar || undefined;
      user.role = role as 'User' | 'Organization';
      user.interests = interests || undefined;
      user.updated_at = new Date().toISOString();
    }
    return { changes: user ? 1 : 0 };
  }
};

// Collab operations
export const getAllCollabs = {
  all: () => {
    initializeData();
    const now = new Date();
    return collabs
      .filter(c => new Date(c.end_time) > now)
      .map(c => {
        const host = users.find(u => u.id === c.host_id);
        const participantCount = participants.filter(p => p.collab_id === c.id).length;
        return {
          ...c,
          host_name: host?.name,
          host_avatar: host?.avatar,
          participant_count: participantCount,
        };
      });
  }
};

export const getCollabById = {
  get: (id: number) => {
    initializeData();
    const collab = collabs.find(c => c.id === id);
    if (!collab) return null;
    const host = users.find(u => u.id === collab.host_id);
    return {
      ...collab,
      host_name: host?.name,
      host_avatar: host?.avatar,
    };
  }
};

export const createCollab = {
  run: (title: string, emoji: string, description: string, category: string, start_time: string, end_time: string, max_participants: number, host_id: number, media_url: string | null) => {
    initializeData();
    const collab: Collab = {
      id: collabIdCounter++,
      title,
      emoji,
      description,
      category,
      start_time,
      end_time,
      max_participants,
      host_id,
      media_url: media_url || undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    collabs.push(collab);
    return { lastInsertRowid: collab.id };
  }
};

// Participant operations
export const getCollabParticipants = {
  all: (collab_id: number) => {
    initializeData();
    return participants
      .filter(p => p.collab_id === collab_id)
      .map(p => {
        const user = users.find(u => u.id === p.user_id);
        return {
          ...p,
          name: user?.name,
          avatar: user?.avatar,
        };
      });
  }
};

export const joinCollab = {
  run: (collab_id: number, user_id: number, proof_text: string | null, proof_image_url: string | null) => {
    initializeData();
    // Check if already joined
    const existing = participants.find(p => p.collab_id === collab_id && p.user_id === user_id);
    if (existing) {
      throw new Error('UNIQUE constraint failed');
    }

    const participant: Participant = {
      id: participantIdCounter++,
      collab_id,
      user_id,
      proof_text: proof_text || undefined,
      proof_image_url: proof_image_url || undefined,
      joined_at: new Date().toISOString(),
    };
    participants.push(participant);
    return { lastInsertRowid: participant.id };
  }
};

export const updateParticipantProof = {
  run: (proof_text: string | null, proof_image_url: string | null, collab_id: number, user_id: number) => {
    initializeData();
    const participant = participants.find(p => p.collab_id === collab_id && p.user_id === user_id);
    if (participant) {
      participant.proof_text = proof_text || undefined;
      participant.proof_image_url = proof_image_url || undefined;
    }
    return { changes: participant ? 1 : 0 };
  }
};

// User stats and badges
export const getUserCollabs = {
  all: (user_id: number) => {
    initializeData();
    return collabs
      .filter(c => c.host_id === user_id)
      .map(c => {
        const host = users.find(u => u.id === c.host_id);
        const participantCount = participants.filter(p => p.collab_id === c.id).length;
        return {
          ...c,
          host_name: host?.name,
          host_avatar: host?.avatar,
          participant_count: participantCount,
        };
      });
  }
};

export const getUserJoinedCollabs = {
  all: (user_id: number) => {
    initializeData();
    return participants
      .filter(p => p.user_id === user_id)
      .map(p => {
        const collab = collabs.find(c => c.id === p.collab_id);
        if (!collab) return null;
        const host = users.find(u => u.id === collab.host_id);
        const participantCount = participants.filter(pt => pt.collab_id === collab.id).length;
        return {
          ...collab,
          host_name: host?.name,
          host_avatar: host?.avatar,
          participant_count: participantCount,
          proof_text: p.proof_text,
          proof_image_url: p.proof_image_url,
          joined_at: p.joined_at,
        };
      })
      .filter(Boolean);
  }
};

export const getUserStats = {
  get: (user_id: number, user_id2: number, user_id3: number) => {
    initializeData();
    return {
      collabs_hosted: collabs.filter(c => c.host_id === user_id).length,
      collabs_joined: participants.filter(p => p.user_id === user_id2).length,
      proofs_submitted: participants.filter(p => p.user_id === user_id3 && p.proof_text).length,
    };
  }
};

export const addBadge = {
  run: (user_id: number, badge_type: string) => {
    initializeData();
    const existing = badges.find(b => b.user_id === user_id && b.badge_type === badge_type);
    if (existing) return { changes: 0 };

    const badge: Badge = {
      id: badgeIdCounter++,
      user_id,
      badge_type,
      earned_at: new Date().toISOString(),
    };
    badges.push(badge);
    return { changes: 1 };
  }
};

export const getUserBadges = {
  all: (user_id: number) => {
    initializeData();
    return badges.filter(b => b.user_id === user_id);
  }
};

// For compatibility
export const getAllUsers = {
  all: () => {
    initializeData();
    return users;
  }
};

// Default export (not used but for compatibility)
export default {
  getUserByFid,
  getUserById,
  createUser,
  updateUser,
  getAllCollabs,
  getCollabById,
  createCollab,
  getCollabParticipants,
  joinCollab,
  updateParticipantProof,
  getUserCollabs,
  getUserJoinedCollabs,
  getUserStats,
  addBadge,
  getUserBadges,
  getAllUsers,
};
