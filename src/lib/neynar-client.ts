import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";

// Initialize Neynar client
const config = new Configuration({
  apiKey: process.env.NEYNAR_API_KEY || "YOUR_NEYNAR_API_KEY",
});

export const neynarClient = new NeynarAPIClient(config);

// Types for Farcaster data
export interface FarcasterUser {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  bio: string;
  follower_count: number;
  following_count: number;
  verified_addresses: any;
  power_badge: boolean;
}

export interface FarcasterCast {
  hash: string;
  author: FarcasterUser;
  text: string;
  timestamp: string;
  embeds: any[];
  reactions: {
    likes: any[];
    recasts: any[];
    likes_count: number;
    recasts_count: number;
  };
  replies: {
    count: number;
  };
  mentioned_profiles: FarcasterUser[];
  viewer_context?: {
    liked: boolean;
    recasted: boolean;
  };
}

export interface FarcasterFeed {
  casts: FarcasterCast[];
  next?: {
    cursor: string;
  };
}

// Helper functions for fetching Farcaster data
export async function fetchUserProfile(fid: number): Promise<FarcasterUser | null> {
  try {
    const response = await neynarClient.fetchBulkUsers({ fids: [fid] });
    return response.users[0] || null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export async function fetchUserCasts(fid: number, limit: number = 20): Promise<FarcasterCast[]> {
  try {
    const response = await neynarClient.fetchCastsForUser({ fid, limit });
    return response.casts || [];
  } catch (error) {
    console.error('Error fetching user casts:', error);
    return [];
  }
}

export async function fetchFeed(fid: number, limit: number = 20): Promise<FarcasterFeed> {
  try {
    const response = await neynarClient.fetchFeed({
      feedType: 'following' as any,
      fid,
      limit,
      withRecasts: true
    });
    return response;
  } catch (error) {
    console.error('Error fetching feed:', error);
    return { casts: [] };
  }
}

export async function searchUsers(query: string, limit: number = 10): Promise<FarcasterUser[]> {
  try {
    const response = await neynarClient.searchUser({ q: query, limit });
    return response.result?.users || [];
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
}

export async function getCastByHash(hash: string): Promise<FarcasterCast | null> {
  try {
    const response = await neynarClient.lookUpCastByHash({ hash });
    return response.cast || null;
  } catch (error) {
    console.error('Error fetching cast by hash:', error);
    return null;
  }
}

export async function searchCasts(query: string, limit: number = 10): Promise<FarcasterCast[]> {
  try {
    const response = await neynarClient.searchCasts({
      q: query,
      limit,
      withRecasts: true
    });
    return response.casts || [];
  } catch (error) {
    console.error('Error searching casts:', error);
    return [];
  }
}
