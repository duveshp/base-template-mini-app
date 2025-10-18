'use client';

import { useRouter } from 'next/navigation';
import { Collab } from '~/contexts/AppContext';
import { Button } from '~/components/ui/Button';

interface CollabCardProps {
  collab: Collab;
}

export default function CollabCard({ collab }: CollabCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/collab/${collab.id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isActive = new Date(collab.end_time) > new Date();

  return (
    <div
      className="group relative glass rounded-3xl p-6 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 cursor-pointer hover:scale-[1.02] hover:border-primary/30 overflow-hidden"
      onClick={handleCardClick}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="relative w-14 h-14 bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
              {collab.emoji}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-foreground text-lg group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 truncate">
                {collab.title}
              </h3>
              <p className="text-sm text-muted-foreground font-medium">by {collab.host_name}</p>
            </div>
          </div>
          <span
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm ${
              isActive
                ? 'bg-gradient-to-r from-green-400/20 to-emerald-500/20 text-green-700 dark:text-green-400 border border-green-400/30 backdrop-blur-sm'
                : 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 text-gray-600 dark:text-gray-400 border border-gray-400/30 backdrop-blur-sm'
            }`}
          >
            {isActive ? '🟢 Active' : '🔴 Ended'}
          </span>
        </div>

        <p className="text-muted-foreground text-sm mb-5 line-clamp-2 leading-relaxed">
          {collab.description}
        </p>

        <div className="flex items-center justify-between text-sm mb-5">
          <span className="px-3 py-2 bg-gradient-to-r from-primary/15 via-purple-500/15 to-pink-500/15 text-primary dark:text-purple-400 font-bold rounded-xl border border-primary/25 backdrop-blur-sm shadow-sm">
            {collab.category}
          </span>
          <span className="text-muted-foreground font-bold text-base">
            👥 {collab.participant_count}/{collab.max_participants}
          </span>
        </div>

        <div className="space-y-2.5 mb-5 glass-strong rounded-xl p-3">
          <div className="text-xs text-muted-foreground flex items-center">
            <span className="font-bold mr-2">🕐 Starts:</span>
            <span>{formatDate(collab.start_time)}</span>
          </div>
          <div className="text-xs text-muted-foreground flex items-center">
            <span className="font-bold mr-2">🏁 Ends:</span>
            <span>{formatDate(collab.end_time)}</span>
          </div>
        </div>

        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          className="relative w-full bg-gradient-to-r from-primary via-purple-600 to-pink-600 hover:from-primary/90 hover:via-purple-600/90 hover:to-pink-600/90 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl overflow-hidden group/button"
        >
          <span className="relative z-10">View Details</span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/button:translate-x-[100%] transition-transform duration-700"></div>
        </Button>
      </div>
    </div>
  );
}
