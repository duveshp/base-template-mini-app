'use client';

import { useState, useEffect } from 'react';
import { FarcasterCast, FarcasterUser } from '~/lib/neynar-client';
import { Button } from '~/components/ui/Button';

interface FarcasterContentProps {
  fid?: number;
  showUpload?: boolean;
  onCastSelect?: (cast: FarcasterCast) => void;
}

export default function FarcasterContent({ 
  fid, 
  showUpload = true, 
  onCastSelect 
}: FarcasterContentProps) {
  const [casts, setCasts] = useState<FarcasterCast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FarcasterUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<FarcasterUser | null>(null);

  const fetchCasts = async (targetFid?: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/farcaster/feed?fid=${targetFid || fid}&limit=20`);
      if (!response.ok) throw new Error('Failed to fetch casts');
      const data = await response.json();
      setCasts(data.casts || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      const response = await fetch(`/api/farcaster/search?q=${encodeURIComponent(query)}&limit=5`);
      if (!response.ok) throw new Error('Failed to search users');
      const data = await response.json();
      setSearchResults(data.users || []);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleUserSelect = (user: FarcasterUser) => {
    setSelectedUser(user);
    setSearchQuery(user.display_name);
    setSearchResults([]);
    fetchCasts(user.fid);
  };

  const handleUploadToFarcaster = () => {
    // This would open Farcaster's compose interface
    // In a real implementation, you'd integrate with Farcaster's posting API
    window.open('https://warpcast.com/~/compose', '_blank');
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    if (fid) {
      fetchCasts();
    }
  }, [fid]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      {/* Search and Upload Section */}
      <div className="bg-card/80 backdrop-blur-sm border rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Farcaster Content</h2>
          {showUpload && (
            <Button
              onClick={handleUploadToFarcaster}
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <span className="mr-2">📝</span>
              Post to Farcaster
            </Button>
          )}
        </div>

        {/* User Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search Farcaster users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border rounded-xl bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          
          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
              {searchResults.map((user) => (
                <div
                  key={user.fid}
                  onClick={() => handleUserSelect(user)}
                  className="p-3 hover:bg-secondary cursor-pointer border-b last:border-b-0 flex items-center space-x-3"
                >
                  <img
                    src={user.pfp_url}
                    alt={user.display_name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-foreground">{user.display_name}</p>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected User Info */}
        {selectedUser && (
          <div className="mt-4 p-4 bg-secondary/50 rounded-xl flex items-center space-x-3">
            <img
              src={selectedUser.pfp_url}
              alt={selectedUser.display_name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold text-foreground">{selectedUser.display_name}</p>
              <p className="text-sm text-muted-foreground">@{selectedUser.username}</p>
            </div>
            <Button
              onClick={() => {
                setSelectedUser(null);
                setSearchQuery('');
                fetchCasts();
              }}
              variant="outline"
              size="sm"
              className="ml-auto"
            >
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* Content Display */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary/30 border-t-primary"></div>
            <p className="text-muted-foreground">Loading Farcaster content...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6 max-w-md mx-auto">
            <p className="text-destructive font-semibold mb-4">Error: {error}</p>
            <Button onClick={() => fetchCasts()} className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white">
              Try Again
            </Button>
          </div>
        </div>
      ) : casts.length === 0 ? (
        <div className="text-center py-8">
          <div className="bg-card/50 backdrop-blur-sm border rounded-2xl p-8 max-w-md mx-auto">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No content found</h3>
            <p className="text-muted-foreground">Search for a user or check back later for new content.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {casts.map((cast) => (
            <div
              key={cast.hash}
              className="bg-card/80 backdrop-blur-sm border rounded-2xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() => onCastSelect?.(cast)}
            >
              <div className="flex items-start space-x-3">
                <img
                  src={cast.author.pfp_url}
                  alt={cast.author.display_name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {cast.author.display_name}
                    </h4>
                    <span className="text-sm text-muted-foreground">@{cast.author.username}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{formatDate(cast.timestamp)}</span>
                  </div>
                  
                  <p className="text-foreground mb-3 leading-relaxed">{cast.text}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <span>❤️</span>
                      <span>{cast.reactions.likes_count}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span>🔄</span>
                      <span>{cast.reactions.recasts_count}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span>💬</span>
                      <span>{cast.replies.count}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
