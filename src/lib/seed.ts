import db, { 
  createUser, 
  createCollab, 
  joinCollab, 
  addBadge 
} from './database';

export function seedDatabase() {
  console.log('Seeding database...');

  // Create demo users
  const users = [
    {
      fid: 12345,
      address: '0x1234567890123456789012345678901234567890',
      name: 'Alice Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      role: 'User' as const,
      interests: 'Fitness, Reading, Technology'
    },
    {
      fid: 23456,
      address: '0x2345678901234567890123456789012345678901',
      name: 'Bob Smith',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      role: 'Organization' as const,
      interests: 'Networking, Business, Leadership'
    },
    {
      fid: 34567,
      address: '0x3456789012345678901234567890123456789012',
      name: 'Carol Davis',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      role: 'User' as const,
      interests: 'Art, Music, Cooking'
    },
    {
      fid: 45678,
      address: '0x4567890123456789012345678901234567890123',
      name: 'David Wilson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      role: 'User' as const,
      interests: 'Gaming, Sports, Technology'
    }
  ];

  const userIds: number[] = [];
  users.forEach(user => {
    try {
      const result = createUser.run(
        user.fid,
        user.address,
        user.name,
        user.avatar,
        user.role,
        user.interests
      );
      userIds.push(result.lastInsertRowid as number);
      console.log(`Created user: ${user.name}`);
    } catch (error) {
      console.log(`User ${user.name} might already exist, skipping...`);
    }
  });

  // Create demo collabs
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const collabs = [
    {
      title: 'Morning Yoga Challenge',
      emoji: '🧘‍♀️',
      description: 'Join us for a 30-day morning yoga challenge! We\'ll start each day with 20 minutes of yoga and share our progress. Perfect for beginners and experienced yogis alike.',
      category: 'Fitness',
      start_time: tomorrow.toISOString(),
      end_time: new Date(tomorrow.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      max_participants: 20,
      host_id: userIds[0] || 1,
      media_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=400&fit=crop'
    },
    {
      title: 'Book Club: Sci-Fi Month',
      emoji: '📚',
      description: 'Reading "Dune" by Frank Herbert this month. Weekly discussions every Sunday at 7 PM. Share your thoughts, theories, and favorite quotes!',
      category: 'Reading',
      start_time: now.toISOString(),
      end_time: nextWeek.toISOString(),
      max_participants: 15,
      host_id: userIds[1] || 2,
      media_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop'
    },
    {
      title: 'Weekly Game Night',
      emoji: '🎮',
      description: 'Online gaming session every Friday night! We play various games including Among Us, Jackbox, and more. All skill levels welcome!',
      category: 'Games',
      start_time: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      end_time: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
      max_participants: 12,
      host_id: userIds[2] || 3,
      media_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop'
    },
    {
      title: 'Cooking Masterclass',
      emoji: '👨‍🍳',
      description: 'Learn to cook authentic Italian pasta from scratch! We\'ll cover everything from making fresh pasta to perfect sauces. Ingredients list provided.',
      category: 'Cooking',
      start_time: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      end_time: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
      max_participants: 8,
      host_id: userIds[3] || 4,
      media_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop'
    },
    {
      title: 'Tech Networking Meetup',
      emoji: '💼',
      description: 'Connect with fellow developers, designers, and tech entrepreneurs. Share projects, discuss trends, and build meaningful professional relationships.',
      category: 'Networking',
      start_time: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      end_time: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
      max_participants: 25,
      host_id: userIds[1] || 2,
      media_url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=400&fit=crop'
    }
  ];

  const collabIds: number[] = [];
  collabs.forEach(collab => {
    try {
      const result = createCollab.run(
        collab.title,
        collab.emoji,
        collab.description,
        collab.category,
        collab.start_time,
        collab.end_time,
        collab.max_participants,
        collab.host_id,
        collab.media_url
      );
      collabIds.push(result.lastInsertRowid as number);
      console.log(`Created collab: ${collab.title}`);
    } catch (error) {
      console.log(`Collab ${collab.title} might already exist, skipping...`);
    }
  });

  // Add some participants to collabs
  const participants = [
    { collabId: collabIds[0], userId: userIds[1], proofText: 'Day 1 complete! Feeling energized! 🌅' },
    { collabId: collabIds[0], userId: userIds[2], proofText: 'Great start to the challenge! 🧘‍♀️' },
    { collabId: collabIds[1], userId: userIds[0], proofText: 'Just finished Chapter 1 - amazing world-building!' },
    { collabId: collabIds[1], userId: userIds[3], proofText: 'The spice must flow! 🌶️' },
    { collabId: collabIds[2], userId: userIds[0], proofText: 'Ready for game night! 🎮' },
    { collabId: collabIds[2], userId: userIds[1], proofText: 'This is going to be epic!' },
    { collabId: collabIds[3], userId: userIds[0], proofText: 'Can\'t wait to learn authentic Italian cooking! 🇮🇹' },
    { collabId: collabIds[4], userId: userIds[0], proofText: 'Looking forward to networking with fellow tech enthusiasts!' },
    { collabId: collabIds[4], userId: userIds[2], proofText: 'Great opportunity to share my latest project!' }
  ];

  participants.forEach(participant => {
    try {
      joinCollab.run(
        participant.collabId,
        participant.userId,
        participant.proofText,
        null
      );
      console.log(`Added participant to collab ${participant.collabId}`);
    } catch (error) {
      console.log(`Participant might already exist, skipping...`);
    }
  });

  // Add some badges
  const badges = [
    { userId: userIds[0], badgeType: 'First Collab' },
    { userId: userIds[0], badgeType: 'Active Participant' },
    { userId: userIds[1], badgeType: 'Collab Host' },
    { userId: userIds[1], badgeType: 'Community Builder' },
    { userId: userIds[2], badgeType: 'First Collab' },
    { userId: userIds[3], badgeType: 'First Collab' }
  ];

  badges.forEach(badge => {
    try {
      addBadge.run(badge.userId, badge.badgeType);
      console.log(`Added badge: ${badge.badgeType} to user ${badge.userId}`);
    } catch (error) {
      console.log(`Badge might already exist, skipping...`);
    }
  });

  console.log('Database seeding completed!');
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}
