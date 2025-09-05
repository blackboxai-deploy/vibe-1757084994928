'use client';

import { memo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GameState } from '@/types/game';
import { cn } from '@/lib/utils';

interface AddScoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameState: GameState;
  onSaveScore: (playerName: string) => void;
  className?: string;
}

export const AddScoreDialog = memo(function AddScoreDialog({
  open,
  onOpenChange,
  gameState,
  onSaveScore,
  className,
}: AddScoreDialogProps) {
  const [playerName, setPlayerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      const name = playerName.trim() || 'Anonymous';
      onSaveScore(name);
      setPlayerName('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    onSaveScore('Anonymous');
    setPlayerName('');
  };

  const getGameStatusMessage = () => {
    if (gameState.gameStatus === 'won') {
      return {
        title: '🎉 Congratulations!',
        message: 'You reached 2048! Amazing work!',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
      };
    } else {
      return {
        title: '💪 Good Game!',
        message: 'Better luck next time!',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
      };
    }
  };

  const statusInfo = getGameStatusMessage();
  const finalTile = Math.max(...gameState.board.flat());
  const gameTime = gameState.endTime && gameState.startTime 
    ? (gameState.endTime.getTime() - gameState.startTime.getTime()) / 1000
    : 0;

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn('max-w-md', className)}>
        <DialogHeader>
          <DialogTitle className={cn('text-2xl font-bold text-center', statusInfo.color)}>
            {statusInfo.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Game Summary */}
          <div className={cn(
            'p-4 rounded-lg border',
            statusInfo.bgColor,
            statusInfo.borderColor
          )}>
            <p className={cn('text-center mb-3', statusInfo.color)}>
              {statusInfo.message}
            </p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-gray-700">Final Score</div>
                <div className="text-xl font-bold text-blue-600">
                  {gameState.score.toLocaleString()}
                </div>
              </div>
              
              <div className="text-center">
                <div className="font-semibold text-gray-700">Best Tile</div>
                <div className={cn(
                  'text-xl font-bold px-2 py-1 rounded text-white inline-block',
                  finalTile >= 2048 ? 'bg-yellow-500' :
                  finalTile >= 1024 ? 'bg-purple-500' :
                  finalTile >= 512 ? 'bg-green-500' :
                  'bg-blue-500'
                )}>
                  {finalTile}
                </div>
              </div>
              
              <div className="text-center">
                <div className="font-semibold text-gray-700">Moves</div>
                <div className="text-lg font-bold text-gray-800">
                  {gameState.moveCount}
                </div>
              </div>
              
              <div className="text-center">
                <div className="font-semibold text-gray-700">Time</div>
                <div className="text-lg font-bold text-gray-800">
                  {formatDuration(gameTime)}
                </div>
              </div>
            </div>
          </div>

          {/* Score Entry Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="playerName" className="text-sm font-medium">
                Enter your name for the leaderboard:
              </Label>
              <Input
                id="playerName"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Your name (optional)"
                maxLength={20}
                className="mt-1"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave blank to save as "Anonymous"
              </p>
            </div>
          </form>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleSkip}
            disabled={isSubmitting}
          >
            Skip
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="min-w-[100px]"
          >
            {isSubmitting ? 'Saving...' : 'Save Score'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

AddScoreDialog.displayName = 'AddScoreDialog';