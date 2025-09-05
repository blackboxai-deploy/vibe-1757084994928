'use client';

import { memo, useState, useEffect } from 'react';
import { GameState } from '@/types/game';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PlayTimeProps {
  gameState: GameState;
  className?: string;
}

export const PlayTime = memo(function PlayTime({ gameState, className }: PlayTimeProps) {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      if (gameState.gameStatus === 'playing') {
        const now = new Date().getTime();
        const elapsed = Math.floor((now - gameState.startTime.getTime()) / 1000);
        setCurrentTime(elapsed);
      } else if (gameState.endTime) {
        // Game ended, show final time
        const finalTime = Math.floor((gameState.endTime.getTime() - gameState.startTime.getTime()) / 1000);
        setCurrentTime(finalTime);
      }
    };

    // Update immediately
    updateTime();

    // Update every second if game is playing
    if (gameState.gameStatus === 'playing') {
      const interval = setInterval(updateTime, 1000);
      return () => clearInterval(interval);
    }
    
    // Return empty cleanup function for other states
    return () => {};
  }, [gameState.gameStatus, gameState.startTime, gameState.endTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (gameState.gameStatus === 'won') return 'text-green-900';
    if (gameState.gameStatus === 'lost') return 'text-red-900';
    if (gameState.gameStatus === 'paused') return 'text-yellow-900';
    return 'text-purple-900';
  };

  const getBackgroundColor = () => {
    if (gameState.gameStatus === 'won') return 'from-green-50 to-green-100 border-green-200';
    if (gameState.gameStatus === 'lost') return 'from-red-50 to-red-100 border-red-200';
    if (gameState.gameStatus === 'paused') return 'from-yellow-50 to-yellow-100 border-yellow-200';
    return 'from-purple-50 to-purple-100 border-purple-200';
  };

  return (
    <Card className={cn(
      'p-4 bg-gradient-to-br',
      getBackgroundColor(),
      className
    )}>
      <div className="text-center">
        <div className="text-sm font-medium uppercase tracking-wide opacity-75">
          {gameState.gameStatus === 'paused' ? 'Paused' : 
           gameState.gameStatus === 'won' ? 'Final Time' :
           gameState.gameStatus === 'lost' ? 'Final Time' : 'Time'}
        </div>
        <div className={cn(
          'text-2xl font-bold tabular-nums',
          getTimeColor()
        )}>
          {formatTime(currentTime)}
        </div>
        {gameState.gameStatus === 'playing' && currentTime > 0 && (
          <div className="text-xs opacity-60 mt-1">
            {currentTime < 60 ? 'Just started!' : 
             currentTime < 300 ? 'Getting warmed up' :
             currentTime < 600 ? 'In the zone' :
             currentTime < 1200 ? 'Marathon mode!' : 'Epic session!'}
          </div>
        )}
      </div>
    </Card>
  );
});

PlayTime.displayName = 'PlayTime';