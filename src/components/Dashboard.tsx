'use client';

import { useApp } from '~/contexts/AppContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CollabCard from '~/components/CollabCard';
import { AppHeader } from '~/components/AppHeader';
import { Button } from '~/components/ui/Button';

export default function Dashboard() {
  const { state, fetchCollabs } = useApp();
  const router = useRouter();

  useEffect(() => {
    fetchCollabs();
  }, [fetchCollabs]);

  if (!state.user) {
    return <div>Please log in to access the dashboard.</div>;
  }

  return (
    <div className="min-h-screen relative">
      <AppHeader />

      <main className="container mx-auto px-4 py-8 animate-fadeIn">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 space-y-4 sm:space-y-0">
          <div className="space-y-3 animate-slideInRight">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
              Welcome back, {state.user.name}! 👋
            </h1>
            <p className="text-muted-foreground text-lg font-medium">
              Discover and join amazing collaborations
            </p>
          </div>
          <Button
            onClick={() => router.push('/create-collab')}
            className="group relative overflow-hidden bg-gradient-to-r from-primary via-purple-600 to-pink-600 hover:from-primary/90 hover:via-purple-600/90 hover:to-pink-600/90 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/25 shadow-lg"
          >
            <span className="relative z-10 flex items-center">
              <span className="mr-2 text-xl group-hover:rotate-12 transition-transform duration-300">✨</span>
              Create Collab
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </Button>
        </div>

        {state.loading ? (
          <div className="text-center py-20 animate-fadeIn">
            <div className="inline-flex items-center space-x-4 glass-strong rounded-2xl px-8 py-6">
              <div className="relative">
                <div className="animate-spin rounded-full h-10 w-10 border-3 border-primary/20 border-t-primary"></div>
                <div className="absolute inset-0 animate-ping rounded-full h-10 w-10 border-2 border-primary/40"></div>
              </div>
              <p className="text-foreground text-lg font-medium">Loading collabs...</p>
            </div>
          </div>
        ) : state.error ? (
          <div className="text-center py-20 animate-scaleIn">
            <div className="glass-strong rounded-3xl p-10 max-w-md mx-auto border-destructive/30 shadow-xl">
              <div className="text-6xl mb-6 animate-bounce">⚠️</div>
              <p className="text-destructive text-xl font-bold mb-6">Error: {state.error}</p>
              <Button
                onClick={fetchCollabs}
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold px-6 py-3 rounded-xl hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {state.collabs.length === 0 ? (
              <div className="col-span-full text-center py-20 animate-scaleIn">
                <div className="glass-strong rounded-3xl p-12 max-w-lg mx-auto shadow-2xl">
                  <div className="text-7xl mb-8 animate-bounce">🎯</div>
                  <h3 className="text-3xl font-bold text-foreground mb-4">
                    No collabs yet
                  </h3>
                  <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                    Be the first to create an amazing collaboration!
                  </p>
                  <Button
                    onClick={() => router.push('/create-collab')}
                    className="group bg-gradient-to-r from-primary via-purple-600 to-pink-600 hover:from-primary/90 hover:via-purple-600/90 hover:to-pink-600/90 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl"
                  >
                    <span className="flex items-center">
                      <span className="mr-2 text-xl group-hover:rotate-12 transition-transform duration-300">✨</span>
                      Create First Collab
                    </span>
                  </Button>
                </div>
              </div>
            ) : (
              state.collabs.map((collab, index) => (
                <div
                  key={collab.id}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CollabCard collab={collab} />
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
