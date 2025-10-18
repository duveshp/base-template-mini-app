# Environment Setup for Farcaster Integration

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Neynar API Key for Farcaster integration
NEYNAR_API_KEY=your_neynar_api_key_here

# Next.js URL for Farcaster mini app
NEXT_PUBLIC_URL=http://localhost:3000
```

## Getting Your Neynar API Key

1. Visit [Neynar Dashboard](https://neynar.com/)
2. Create an account or log in
3. Navigate to the API section
4. Generate a new API key
5. Copy the key and add it to your `.env.local` file

## Features Enabled with Neynar Integration

- ✅ Fetch Farcaster user profiles
- ✅ Browse Farcaster feeds and casts
- ✅ Search Farcaster users
- ✅ Integrate Farcaster content into collabs
- ✅ Direct posting to Farcaster (via Warpcast)

## API Endpoints Added

- `GET /api/farcaster/feed?fid={fid}&limit={limit}` - Fetch user feed
- `GET /api/farcaster/user/{fid}?includeCasts=true` - Fetch user profile and casts
- `GET /api/farcaster/search?q={query}&limit={limit}` - Search users

## Usage in Collab Creation

When creating a collab, users can now:
1. Click "Browse Farcaster" to search and select content
2. Select a Farcaster cast to include in their collab
3. The cast content will be embedded in the collab description
4. Users can also post directly to Farcaster via the "Post to Farcaster" button
