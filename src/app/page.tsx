'use client';

import { useState, useRef } from 'react';
import { GameHeader } from '@/components/game/GameHeader';
import { GameBoard } from '@/components/game/GameBoard';
import { GameControls } from '@/components/game/GameControls';
import { ConfettiEffect } from '@/components/effects/ConfettiEffect';
import { Leaderboard } from '@/components/leaderboard/Leaderboard';
import { AddScoreDialog } from '@/components/leaderboard/AddScoreDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useGame } from '@/hooks/useGame';
import { useKeyboard } from '@/hooks/useKeyboard';
import { useConfetti } from '@/hooks/useConfetti';

export default function GamePage() {
  const {
    gameState,
    isAnimating,
    showNewGameDialog,
    showLeaderboardDialog,
    move,
    newGame,
    startNewGame,
    undo,
    pause,
    saveScore,
    setShowNewGameDialog,
    setShowLeaderboardDialog,
  } = useGame();

  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  
  // Confetti system
  const { confettiTriggers, triggerConfetti } = useConfetti();

  // Keyboard controls
  useKeyboard({
    onMove: (direction) => {
      move(direction, (row, col, value) => {
        // Trigger confetti from the specific tile position
        triggerConfetti(row, col, value, boardRef.current || undefined);
      });
    },
    onNewGame: newGame,
    onUndo: undo,
    onPause: pause,
    enabled: !showNewGameDialog && !showLeaderboard && !showLeaderboardDialog,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Game Header */}
          <GameHeader
            gameState={gameState}
            onNewGame={newGame}
            onUndo={undo}
            onToggleLeaderboard={() => setShowLeaderboard(true)}
            className="mb-8"
          />

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Game Board */}
            <div className="flex flex-col items-center gap-6">
              <div ref={boardRef}>
                <GameBoard 
                  gameState={gameState} 
                  isAnimating={isAnimating}
                />
              </div>
              
              {/* Game Status Messages */}
              {gameState.gameStatus === 'won' && (
                <div className="text-center p-6 bg-green-100 border border-green-300 rounded-xl max-w-md">
                  <div className="text-4xl mb-2">🎉</div>
                  <h2 className="text-2xl font-bold text-green-800 mb-2">
                    You Won!
                  </h2>
                  <p className="text-green-700">
                    Congratulations! You reached 2048!
                  </p>
                  <p className="text-green-600 text-sm mt-2">
                    Keep playing to get an even higher score!
                  </p>
                </div>
              )}
              
              {gameState.gameStatus === 'lost' && (
                <div className="text-center p-6 bg-red-100 border border-red-300 rounded-xl max-w-md">
                  <div className="text-4xl mb-2">💪</div>
                  <h2 className="text-2xl font-bold text-red-800 mb-2">
                    Game Over
                  </h2>
                  <p className="text-red-700">
                    No more moves available!
                  </p>
                  <p className="text-red-600 text-sm mt-2">
                    Final score: <strong>{gameState.score.toLocaleString()}</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Game Controls & Instructions */}
            <GameControls />
          </div>
        </div>
      </div>

      {/* Confetti Effects */}
      {confettiTriggers.map((trigger) => (
        <ConfettiEffect 
          key={trigger.id}
          trigger={true}
          duration={4000} // Longer duration for slower confetti
          particleCount={trigger.tileValue >= 1024 ? 60 : trigger.tileValue >= 512 ? 40 : 30}
          originX={trigger.originX}
          originY={trigger.originY}
          tileValue={trigger.tileValue}
        />
      ))}

      {/* New Game Confirmation Dialog */}
      <AlertDialog open={showNewGameDialog} onOpenChange={setShowNewGameDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start New Game?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to start a new game? Your current progress will be lost.
              <br />
              <br />
              Current Score: <strong>{gameState.score.toLocaleString()}</strong>
              <br />
              Moves: <strong>{gameState.moveCount}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={startNewGame}>
              Start New Game
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Leaderboard Dialog */}
      <Leaderboard
        open={showLeaderboard}
        onOpenChange={setShowLeaderboard}
      />

      {/* Score Entry Dialog */}
      <AddScoreDialog
        open={showLeaderboardDialog}
        onOpenChange={setShowLeaderboardDialog}
        gameState={gameState}
        onSaveScore={saveScore}
      />
    </div>
  );
}