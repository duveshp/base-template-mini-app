'use client';

import { useApp } from '~/contexts/AppContext';
import { useRouter } from 'next/navigation';
import { Button } from '~/components/ui/Button';
import { ThemeToggle } from '~/components/ui/ThemeToggle';

export function AppHeader() {
  const { state, logout } = useApp();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-6">
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => router.push('/dashboard')}
            >
              <div className="text-2xl">🎉</div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Collab & Fun
              </h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <button 
                onClick={() => router.push('/dashboard')}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 hover:scale-105"
              >
                Dashboard
              </button>
              <button 
                onClick={() => router.push('/farcaster')}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 hover:scale-105"
              >
                Farcaster
              </button>
              <button 
                onClick={() => router.push('/profile')}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 hover:scale-105"
              >
                Profile
              </button>
            </nav>
          </div>
          
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            {state.user && (
              <div className="flex items-center space-x-3 pl-3 border-l">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-foreground">{state.user.name}</p>
                  <p className="text-xs text-muted-foreground">{state.user.role}</p>
                </div>
                {state.user.avatar ? (
                  <img 
                    src={state.user.avatar} 
                    alt={state.user.name}
                    className="w-8 h-8 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-200"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-primary-foreground font-semibold text-sm">
                    {state.user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="hover:bg-destructive hover:text-destructive-foreground transition-colors duration-200"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
