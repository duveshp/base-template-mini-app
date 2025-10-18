import { FarcasterCast } from './neynar-client';

// Extract hashtags and mentions from text
export function extractHashtags(text: string): string[] {
  const hashtagRegex = /#[\w\u0590-\u05ff]+/g;
  return text.match(hashtagRegex) || [];
}

export function extractMentions(text: string): string[] {
  const mentionRegex = /@[\w.]+/g;
  return text.match(mentionRegex) || [];
}

// Find relevant Farcaster content based on collab description
export async function findRelevantFarcasterContent(description: string): Promise<FarcasterCast[]> {
  const hashtags = extractHashtags(description);
  const mentions = extractMentions(description);
  
  if (hashtags.length === 0 && mentions.length === 0) {
    return [];
  }

  try {
    // Search for content with matching hashtags or mentions
    const searchQueries = [...hashtags, ...mentions];
    const allCasts: FarcasterCast[] = [];

    for (const query of searchQueries) {
      try {
        const response = await fetch(`/api/farcaster/search-casts?q=${encodeURIComponent(query)}&limit=5`);
        if (response.ok) {
          const data = await response.json();
          allCasts.push(...(data.casts || []));
        }
      } catch (error) {
        console.error(`Error searching for ${query}:`, error);
      }
    }

    // Remove duplicates and return
    const uniqueCasts = allCasts.filter((cast, index, self) => 
      index === self.findIndex(c => c.hash === cast.hash)
    );

    return uniqueCasts.slice(0, 10); // Limit to 10 most relevant
  } catch (error) {
    console.error('Error finding relevant Farcaster content:', error);
    return [];
  }
}

// Score how relevant a cast is to the collab
export function scoreCastRelevance(cast: FarcasterCast, description: string): number {
  const descriptionLower = description.toLowerCase();
  const castTextLower = cast.text.toLowerCase();
  
  let score = 0;
  
  // Check for hashtag matches
  const hashtags = extractHashtags(description);
  hashtags.forEach(hashtag => {
    if (castTextLower.includes(hashtag.toLowerCase())) {
      score += 10;
    }
  });
  
  // Check for mention matches
  const mentions = extractMentions(description);
  mentions.forEach(mention => {
    if (castTextLower.includes(mention.toLowerCase())) {
      score += 8;
    }
  });
  
  // Check for keyword matches (simple word matching)
  const descriptionWords = descriptionLower.split(/\s+/).filter(word => word.length > 3);
  descriptionWords.forEach(word => {
    if (castTextLower.includes(word)) {
      score += 2;
    }
  });
  
  // Boost score for recent content
  const castDate = new Date(cast.timestamp);
  const now = new Date();
  const daysDiff = (now.getTime() - castDate.getTime()) / (1000 * 60 * 60 * 24);
  if (daysDiff < 7) score += 5;
  if (daysDiff < 1) score += 10;
  
  // Boost score for high engagement
  score += Math.min(cast.reactions.likes_count * 0.1, 5);
  score += Math.min(cast.reactions.recasts_count * 0.2, 5);
  
  return score;
}
