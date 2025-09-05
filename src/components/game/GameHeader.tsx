'use client';

import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GameState } from '@/types/game';
import { PlayTime } from './PlayTime';
import { cn } from '@/lib/utils';

interface GameHeaderProps {
  gameState: GameState;
  onNewGame: () => void;
  onUndo: () => void;
  onToggleLeaderboard: () => void;
  className?: string;
}

export const GameHeader = memo(function GameHeader({
  gameState,
  onNewGame,
  onUndo,
  onToggleLeaderboard,
  className,
}: GameHeaderProps) {
  const scoreIncrease = gameState.previousState ? 
    gameState.score - gameState.previousState.score : 0;

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {/* Title and New Game */}
      <div className="flex justify-between items-center">
        <h1 className="text-6xl font-bold text-gray-800">2048</h1>
        <div className="flex gap-3">
          <Button
            onClick={onToggleLeaderboard}
            variant="outline"
            size="lg"
            className="px-6 py-3 text-lg"
          >
            Leaderboard
          </Button>
          <Button
            onClick={onNewGame}
            size="lg"
            className="px-8 py-3 text-lg bg-amber-600 hover:bg-amber-700"
          >
            New Game
          </Button>
        </div>
      </div>

      {/* Game Description */}
      <div className="text-lg text-gray-600 max-w-lg">
        <p>
          Join the tiles, get to <strong className="text-amber-600">2048</strong>!
        </p>
        <p className="text-sm mt-1">
          Use your arrow keys or WASD to move tiles. When two tiles with the same number touch, they merge into one!
        </p>
      </div>

      {/* Score Cards */}
      <div className="flex gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="text-center">
            <div className="text-sm font-medium text-blue-700 uppercase tracking-wide">
              Score
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="text-2xl font-bold text-blue-900">
                {gameState.score.toLocaleString()}
              </div>
              {scoreIncrease > 0 && (
                <div className="text-sm font-bold text-green-600 animate-bounce">
                  +{scoreIncrease}
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <div className="text-center">
            <div className="text-sm font-medium text-amber-700 uppercase tracking-wide">
              Best
            </div>
            <div className="text-2xl font-bold text-amber-900">
              {gameState.bestScore.toLocaleString()}
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="text-center">
            <div className="text-sm font-medium text-green-700 uppercase tracking-wide">
              Moves
            </div>
            <div className="text-2xl font-bold text-green-900">
              {gameState.moveCount}
            </div>
          </div>
        </Card>

        <PlayTime gameState={gameState} />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onUndo}
          variant="outline"
          disabled={!gameState.canUndo}
          className="flex items-center gap-2"
        >
          ↶ Undo
        </Button>
        
        {gameState.gameStatus === 'paused' && (
          <div className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded-md text-sm font-medium">
            Game Paused - Press ESC to resume
          </div>
        )}
        
        {gameState.gameStatus === 'won' && (
          <div className="px-3 py-2 bg-green-100 text-green-800 rounded-md text-sm font-medium">
            🎉 You Won! Keep playing for a higher score!
          </div>
        )}
        
        {gameState.gameStatus === 'lost' && (
          <div className="px-3 py-2 bg-red-100 text-red-800 rounded-md text-sm font-medium">
            Game Over - Try again!
          </div>
        )}
      </div>
    </div>
  );
});

GameHeader.displayName = 'GameHeader';