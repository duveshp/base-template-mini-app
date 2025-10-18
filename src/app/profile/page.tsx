'use client';

import { useApp } from '~/contexts/AppContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '~/components/AppHeader';
import { Button } from '~/components/ui/Button';
import CollabCard from '~/components/CollabCard';

export default function ProfilePage() {
  const { state, fetchUserCollabs, fetchUserJoinedCollabs, fetchUserStats, fetchUserBadges } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (state.user) {
      fetchUserCollabs();
      fetchUserJoinedCollabs();
      fetchUserStats();
      fetchUserBadges();
    }
  }, [state.user, fetchUserCollabs, fetchUserJoinedCollabs, fetchUserStats, fetchUserBadges]);

  if (!state.user) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Please log in to view your profile.</p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="container mx-auto px-4 py-8 animate-fadeIn">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="glass-strong rounded-3xl p-8 mb-8 shadow-xl animate-scaleIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-6 sm:space-y-0 sm:space-x-8">
              <div className="flex-shrink-0">
                {state.user.avatar ? (
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-500 to-pink-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                    <img
                      src={state.user.avatar}
                      alt={state.user.name}
                      className="relative w-28 h-28 rounded-full border-4 border-white/20 shadow-2xl"
                    />
                  </div>
                ) : (
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-500 to-pink-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                    <div className="relative w-28 h-28 bg-gradient-to-br from-primary via-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-4xl font-black shadow-2xl border-4 border-white/20">
                      {state.user.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-black bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent mb-3">{state.user.name}</h1>
                <p className="text-muted-foreground font-bold text-lg mb-2">{state.user.role}</p>
                {state.user.interests && (
                  <p className="text-sm text-muted-foreground mb-3 font-medium glass rounded-lg px-3 py-2 inline-block">
                    💫 Interests: {state.user.interests}
                  </p>
                )}
                <p className="text-sm text-muted-foreground font-medium">
                  📅 Member since {formatDate(state.user.created_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          {state.userStats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
              <div className="glass-strong rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300 shadow-lg group">
                <div className="text-5xl font-black bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                  {state.userStats.collabs_hosted}
                </div>
                <div className="text-muted-foreground font-bold text-lg">Collabs Hosted</div>
              </div>
              <div className="glass-strong rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300 shadow-lg group">
                <div className="text-5xl font-black bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                  {state.userStats.collabs_joined}
                </div>
                <div className="text-muted-foreground font-bold text-lg">Collabs Joined</div>
              </div>
              <div className="glass-strong rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300 shadow-lg group">
                <div className="text-5xl font-black bg-gradient-to-r from-pink-500 to-primary bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                  {state.userStats.proofs_submitted}
                </div>
                <div className="text-muted-foreground font-bold text-lg">Proofs Submitted</div>
              </div>
            </div>
          )}

          {/* Badges */}
          {state.userBadges.length > 0 && (
            <div className="glass-strong rounded-2xl p-6 mb-8 shadow-lg animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                <span className="mr-2 text-3xl">🏆</span>
                Badges
              </h2>
              <div className="flex flex-wrap gap-3">
                {state.userBadges.map((badge, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl text-sm font-bold shadow-md hover:scale-110 transition-transform duration-200"
                  >
                    {badge.badge_type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Hosted Collabs */}
          <div className="mb-10 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
              <h2 className="text-3xl font-black bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">My Collabs</h2>
              <Button
                onClick={() => router.push('/create-collab')}
                className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 hover:from-primary/90 hover:via-purple-600/90 hover:to-pink-600/90 text-white font-bold px-6 py-3 rounded-xl hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <span className="mr-2">✨</span>
                Create New Collab
              </Button>
            </div>

            {state.userCollabs.length === 0 ? (
              <div className="glass-strong rounded-3xl p-12 text-center shadow-xl">
                <div className="text-6xl mb-6 animate-bounce">🎯</div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  No collabs created yet
                </h3>
                <p className="text-muted-foreground mb-6 text-lg">
                  Start your first collaboration and bring people together!
                </p>
                <Button
                  onClick={() => router.push('/create-collab')}
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-bold px-6 py-3 rounded-xl hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Create First Collab
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {state.userCollabs.map((collab, index) => (
                  <div key={collab.id} className="animate-fadeIn" style={{ animationDelay: `${index * 0.05}s` }}>
                    <CollabCard collab={collab} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Joined Collabs */}
          <div className="mb-8 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-3xl font-black bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent mb-6">Joined Collabs</h2>

            {state.userJoinedCollabs.length === 0 ? (
              <div className="glass-strong rounded-3xl p-12 text-center shadow-xl">
                <div className="text-6xl mb-6 animate-bounce">🤝</div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  No collabs joined yet
                </h3>
                <p className="text-muted-foreground mb-6 text-lg">
                  Discover amazing collaborations on the dashboard!
                </p>
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-500/90 hover:to-pink-600/90 text-white font-bold px-6 py-3 rounded-xl hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Browse Collabs
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {state.userJoinedCollabs.map((collab, index) => (
                  <div key={collab.id} className="animate-fadeIn" style={{ animationDelay: `${index * 0.05}s` }}>
                    <CollabCard collab={collab} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
