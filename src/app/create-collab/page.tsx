'use client';

import { useState } from 'react';
import { useApp } from '~/contexts/AppContext';
import { useRouter } from 'next/navigation';
import { AppHeader } from '~/components/AppHeader';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import FarcasterContent from '~/components/FarcasterContent';
import { FarcasterCast } from '~/lib/neynar-client';

const CATEGORIES = [
  'Fitness',
  'Reading',
  'Games',
  'Networking',
  'Learning',
  'Cooking',
  'Art',
  'Music',
  'Sports',
  'Travel',
  'Technology',
  'Other'
];

export default function CreateCollabPage() {
  const { state, createCollab } = useApp();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    emoji: '🎯',
    description: '',
    category: 'Other',
    start_time: '',
    end_time: '',
    max_participants: 10,
    media_url: '',
  });
  const [selectedCast, setSelectedCast] = useState<FarcasterCast | null>(null);
  const [showFarcasterContent, setShowFarcasterContent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.user) {
      alert('Please log in to create a collab');
      return;
    }

    // Validate form
    if (!formData.title || !formData.description || !formData.start_time || !formData.end_time) {
      alert('Please fill in all required fields');
      return;
    }

    if (new Date(formData.start_time) >= new Date(formData.end_time)) {
      alert('End time must be after start time');
      return;
    }

    if (formData.max_participants < 2) {
      alert('Maximum participants must be at least 2');
      return;
    }

    setIsCreating(true);
    try {
      // If a Farcaster cast is selected, use its content
      const finalDescription = selectedCast 
        ? `${formData.description}\n\n---\n\n📱 **Farcaster Content:**\n"${selectedCast.text}"\n\n*By @${selectedCast.author.username}*`
        : formData.description;

      await createCollab({
        title: formData.title,
        emoji: formData.emoji,
        description: finalDescription,
        category: formData.category,
        start_time: formData.start_time,
        end_time: formData.end_time,
        max_participants: formData.max_participants,
        host_id: state.user.id,
        media_url: formData.media_url || undefined,
      });
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating collab:', error);
      alert('Failed to create collab. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!state.user) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Please log in to create a collab.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create New Collab</h1>
            <p className="text-muted-foreground">
              Start an amazing collaboration and bring people together!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-card border rounded-lg p-6 space-y-6">
              {/* Title and Emoji */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter collab title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="emoji">Emoji</Label>
                  <Input
                    id="emoji"
                    placeholder="🎯"
                    value={formData.emoji}
                    onChange={(e) => handleInputChange('emoji', e.target.value)}
                    maxLength={2}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  placeholder="Describe what this collab is about..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full p-3 border rounded-md bg-background text-foreground min-h-[100px] resize-y"
                  required
                />
              </div>

              {/* Category and Max Participants */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full p-3 border rounded-md bg-background text-foreground"
                    required
                  >
                    {CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="max_participants">Max Participants *</Label>
                  <Input
                    id="max_participants"
                    type="number"
                    min="2"
                    max="100"
                    value={formData.max_participants}
                    onChange={(e) => handleInputChange('max_participants', parseInt(e.target.value))}
                    required
                  />
                </div>
              </div>

              {/* Start and End Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_time">Start Time *</Label>
                  <Input
                    id="start_time"
                    type="datetime-local"
                    value={formData.start_time}
                    onChange={(e) => handleInputChange('start_time', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="end_time">End Time *</Label>
                  <Input
                    id="end_time"
                    type="datetime-local"
                    value={formData.end_time}
                    onChange={(e) => handleInputChange('end_time', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Media URL */}
              <div>
                <Label htmlFor="media_url">Media URL (optional)</Label>
                <Input
                  id="media_url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.media_url}
                  onChange={(e) => handleInputChange('media_url', e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Add an image or video URL to make your collab more engaging
                </p>
              </div>

              {/* Farcaster Content Integration */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Farcaster Content (optional)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFarcasterContent(!showFarcasterContent)}
                    className="text-primary hover:text-primary/80"
                  >
                    {showFarcasterContent ? 'Hide' : 'Browse'} Farcaster
                  </Button>
                </div>
                
                {selectedCast && (
                  <div className="bg-secondary/50 border rounded-xl p-4 mb-4">
                    <div className="flex items-start space-x-3">
                      <img
                        src={selectedCast.author.pfp_url}
                        alt={selectedCast.author.display_name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-foreground text-sm">
                            {selectedCast.author.display_name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            @{selectedCast.author.username}
                          </span>
                        </div>
                        <p className="text-sm text-foreground line-clamp-2">
                          {selectedCast.text}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCast(null)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                )}

                {showFarcasterContent && (
                  <div className="border rounded-xl p-4 bg-card/50">
                    <FarcasterContent
                      onCastSelect={(cast) => {
                        setSelectedCast(cast);
                        setShowFarcasterContent(false);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating}
              >
                {isCreating ? 'Creating...' : 'Create Collab'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
