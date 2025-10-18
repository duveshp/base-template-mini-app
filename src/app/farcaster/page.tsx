'use client';

import dynamic from 'next/dynamic';
import { AppHeader } from '~/components/AppHeader';

// Dynamically import FarcasterContent to avoid SSR issues
const FarcasterContent = dynamic(() => import('~/components/FarcasterContent'), {
  ssr: false,
  loading: () => (
    <div className="text-center py-8">
      <div className="inline-flex items-center space-x-3">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary/30 border-t-primary"></div>
        <p className="text-muted-foreground">Loading Farcaster content...</p>
      </div>
    </div>
  )
});

export default function FarcasterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4">
              Farcaster Content
            </h1>
            <p className="text-muted-foreground text-lg">
              Browse and discover amazing content from the Farcaster community
            </p>
          </div>

          <FarcasterContent showUpload={true} />
        </div>
      </main>
    </div>
  );
}
