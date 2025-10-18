'use client';

import { useParams } from 'next/navigation';
import { useApp } from '~/contexts/AppContext';
import { useEffect, useState } from 'react';
import { AppHeader } from '~/components/AppHeader';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { FarcasterCast } from '~/lib/neynar-client';
import { findRelevantFarcasterContent, scoreCastRelevance } from '~/lib/farcaster-content-matcher';

interface CollabDetails {
  id: number;
  title: string;
  emoji: string;
  description: string;
  category: string;
  start_time: string;
  end_time: string;
  max_participants: number;
  host_name: string;
  host_avatar?: string;
  media_url?: string;
  participants: Array<{
    id: number;
    name: string;
    avatar?: string;
    proof_text?: string;
    proof_image_url?: string;
    joined_at: string;
  }>;
}

export default function CollabDetailsPage() {
  const params = useParams();
  const { state, joinCollab, updateParticipantProof } = useApp();
  const [collab, setCollab] = useState<CollabDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [proofText, setProofText] = useState('');
  const [proofImageUrl, setProofImageUrl] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [isUpdatingProof, setIsUpdatingProof] = useState(false);
  const [relevantCasts, setRelevantCasts] = useState<FarcasterCast[]>([]);
  const [loadingCasts, setLoadingCasts] = useState(false);

  const collabId = params.id as string;

  useEffect(() => {
    fetchCollabDetails();
  }, [collabId]);

  useEffect(() => {
    if (collab) {
      fetchRelevantCasts();
    }
  }, [collab]);

  const fetchCollabDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/collabs/${collabId}`);
      if (!response.ok) throw new Error('Failed to fetch collab details');
      const data = await response.json();
      setCollab(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelevantCasts = async () => {
    if (!collab) return;
    
    setLoadingCasts(true);
    try {
      const casts = await findRelevantFarcasterContent(collab.description);
      // Sort by relevance score
      const sortedCasts = casts.sort((a, b) => 
        scoreCastRelevance(b, collab.description) - scoreCastRelevance(a, collab.description)
      );
      setRelevantCasts(sortedCasts);
    } catch (error) {
      console.error('Error fetching relevant casts:', error);
    } finally {
      setLoadingCasts(false);
    }
  };

  const handleJoinCollab = async () => {
    if (!state.user || !collab) return;
    
    setIsJoining(true);
    try {
      await joinCollab(collab.id, proofText || undefined, proofImageUrl || undefined);
      await fetchCollabDetails(); // Refresh to show updated participant count
      setProofText('');
      setProofImageUrl('');
    } catch (error) {
      console.error('Error joining collab:', error);
      alert('Failed to join collab. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleUpdateProof = async () => {
    if (!state.user || !collab) return;
    
    setIsUpdatingProof(true);
    try {
      await updateParticipantProof(collab.id, proofText || undefined, proofImageUrl || undefined);
      await fetchCollabDetails(); // Refresh to show updated proof
    } catch (error) {
      console.error('Error updating proof:', error);
      alert('Failed to update proof. Please try again.');
    } finally {
      setIsUpdatingProof(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isUserParticipant = collab?.participants.some(p => p.name === state.user?.name);
  const isActive = collab ? new Date(collab.end_time) > new Date() : false;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading collab details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !collab) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8">
            <p className="text-destructive">Error: {error || 'Collab not found'}</p>
            <Button onClick={fetchCollabDetails} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Collab Header */}
          <div className="bg-card border rounded-lg p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <span className="text-4xl">{collab.emoji}</span>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">{collab.title}</h1>
                  <p className="text-muted-foreground">by {collab.host_name}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isActive 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
              }`}>
                {isActive ? 'Active' : 'Ended'}
              </span>
            </div>

            <p className="text-muted-foreground mb-4">{collab.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-foreground">Category:</span>
                <span className="ml-2 px-2 py-1 bg-secondary rounded-md">
                  {collab.category}
                </span>
              </div>
              <div>
                <span className="font-medium text-foreground">Participants:</span>
                <span className="ml-2">{collab.participants.length}/{collab.max_participants}</span>
              </div>
              <div>
                <span className="font-medium text-foreground">Starts:</span>
                <span className="ml-2">{formatDate(collab.start_time)}</span>
              </div>
            </div>
          </div>

          {/* Join/Proof Section */}
          {state.user && (
            <div className="bg-card border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {isUserParticipant ? 'Update Your Proof' : 'Join This Collab'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="proofText">Proof Text (optional)</Label>
                  <Input
                    id="proofText"
                    placeholder="Share your experience or proof of participation..."
                    value={proofText}
                    onChange={(e) => setProofText(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="proofImage">Proof Image URL (optional)</Label>
                  <Input
                    id="proofImage"
                    placeholder="https://example.com/proof-image.jpg"
                    value={proofImageUrl}
                    onChange={(e) => setProofImageUrl(e.target.value)}
                  />
                </div>

                <Button
                  onClick={isUserParticipant ? handleUpdateProof : handleJoinCollab}
                  disabled={isJoining || isUpdatingProof || !isActive}
                  className="w-full"
                >
                  {isJoining ? 'Joining...' : 
                   isUpdatingProof ? 'Updating...' :
                   isUserParticipant ? 'Update Proof' : 'Join Collab'}
                </Button>
              </div>
            </div>
          )}

          {/* Participants */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Participants ({collab.participants.length})
            </h2>
            
            {collab.participants.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No participants yet. Be the first to join!
              </p>
            ) : (
              <div className="space-y-4">
                {collab.participants.map((participant) => (
                  <div key={participant.id} className="flex items-start space-x-3 p-3 bg-secondary rounded-lg">
                    <div className="flex-shrink-0">
                      {participant.avatar ? (
                        <img 
                          src={participant.avatar} 
                          alt={participant.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                          {participant.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-foreground">{participant.name}</p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(participant.joined_at).toLocaleDateString()}
                        </span>
                      </div>
                      {participant.proof_text && (
                        <p className="text-sm text-muted-foreground mt-1">
                          "{participant.proof_text}"
                        </p>
                      )}
                      {participant.proof_image_url && (
                        <img 
                          src={participant.proof_image_url} 
                          alt="Proof"
                          className="mt-2 max-w-xs rounded-lg"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Relevant Farcaster Content */}
          {relevantCasts.length > 0 && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                <span className="mr-3">📱</span>
                Related Farcaster Content
              </h3>
              
              {loadingCasts ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary/30 border-t-primary"></div>
                    <p className="text-muted-foreground">Finding relevant content...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {relevantCasts.map((cast) => (
                    <div
                      key={cast.hash}
                      className="bg-card/80 backdrop-blur-sm border rounded-2xl p-6 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-start space-x-3">
                        <img
                          src={cast.author.pfp_url}
                          alt={cast.author.display_name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-foreground">
                              {cast.author.display_name}
                            </h4>
                            <span className="text-sm text-muted-foreground">@{cast.author.username}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(cast.timestamp).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
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
                            <a
                              href={`https://warpcast.com/${cast.author.username}/${cast.hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80 text-sm font-medium"
                            >
                              View on Farcaster →
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
