'use client';

import { useState } from 'react';
import { useApp } from '~/contexts/AppContext';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

export default function Login() {
  const { login } = useApp();
  const [isConnecting, setIsConnecting] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    avatar: '',
    role: 'User' as 'User' | 'Organization',
    interests: '',
  });

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // In a real app, this would connect to Base wallet
      // For now, we'll simulate the connection
      const mockUser = {
        id: 1,
        fid: 12345,
        address: '0x1234567890123456789012345678901234567890',
        name: profileData.name || 'Anonymous User',
        avatar: profileData.avatar || undefined,
        role: profileData.role,
        interests: profileData.interests || undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Create/update user profile (using demo endpoint for testing)
      const response = await fetch('/api/user/profile-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profileData,
          address: mockUser.address,
        }),
      });

      if (response.ok) {
        const user = await response.json();
        login(user);
      } else {
        throw new Error('Failed to create user profile');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Failed to connect. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated floating shapes in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10 animate-scaleIn">
        <div className="text-center space-y-5 animate-fadeIn">
          <div className="relative mx-auto w-24 h-24 group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-600 to-pink-600 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-60 group-hover:opacity-100"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-primary via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center text-4xl shadow-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              🎉
            </div>
          </div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
            Collab & Fun
          </h1>
          <p className="text-muted-foreground text-xl font-medium">
            Connect your Base wallet to start collaborating!
          </p>
        </div>

        <div className="glass-strong p-8 rounded-3xl shadow-2xl space-y-6 backdrop-blur-xl border-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground font-bold">Name *</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              className="glass border-2 focus:border-primary/50 transition-all duration-200 h-12 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar" className="text-foreground font-bold">Avatar URL (optional)</Label>
            <Input
              id="avatar"
              placeholder="https://example.com/avatar.jpg"
              value={profileData.avatar}
              onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
              className="glass border-2 focus:border-primary/50 transition-all duration-200 h-12 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-foreground font-bold">Role</Label>
            <select
              id="role"
              className="w-full p-3 glass border-2 rounded-xl bg-background/50 backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 font-medium h-12"
              value={profileData.role}
              onChange={(e) => setProfileData({ ...profileData, role: e.target.value as 'User' | 'Organization' })}
            >
              <option value="User">User</option>
              <option value="Organization">Organization</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interests" className="text-foreground font-bold">Interests (optional)</Label>
            <Input
              id="interests"
              placeholder="Fitness, Reading, Games, etc."
              value={profileData.interests}
              onChange={(e) => setProfileData({ ...profileData, interests: e.target.value })}
              className="glass border-2 focus:border-primary/50 transition-all duration-200 h-12 rounded-xl"
            />
          </div>

          <Button
            onClick={handleConnect}
            disabled={isConnecting || !profileData.name}
            className="relative w-full bg-gradient-to-r from-primary via-purple-600 to-pink-600 hover:from-primary/90 hover:via-purple-600/90 hover:to-pink-600/90 text-white font-bold py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-xl overflow-hidden group h-14"
          >
            {isConnecting ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="relative">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
                <span className="font-bold text-lg">Connecting...</span>
              </div>
            ) : (
              <>
                <span className="relative z-10 font-bold text-lg">Connect Base Wallet</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </>
            )}
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground glass-strong p-5 rounded-2xl shadow-lg animate-fadeIn">
          <p className="font-medium">💡 This is a demo app. In production, this would connect to your actual Base wallet.</p>
        </div>
      </div>
    </div>
  );
}
