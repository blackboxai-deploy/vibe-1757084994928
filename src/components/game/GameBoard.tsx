'use client';

import { memo } from 'react';
import { GameState, TileValue } from '@/types/game';
import { GameTile } from './GameTile';
import { GAME_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  gameState: GameState;
  isAnimating: boolean;
  className?: string;
}

export const GameBoard = memo(function GameBoard({ 
  gameState, 
  isAnimating,
  className 
}: GameBoardProps) {
  const { board } = gameState;

  return (
    <div 
      className={cn(
        'relative bg-gray-300 rounded-2xl p-4 shadow-xl mx-auto',
        'w-[400px] h-[400px]',
        'transition-all duration-200',
        {
          'scale-[0.98]': isAnimating,
        },
        className
      )}
    >
      {/* Background grid - properly spaced */}
      <div className="grid grid-cols-4 gap-3 w-full h-full">
        {Array.from({ length: GAME_CONFIG.boardSize * GAME_CONFIG.boardSize }).map((_, index) => (
          <div
            key={`bg-${index}`}
            className="bg-gray-200 rounded-lg"
          />
        ))}
      </div>
      
      {/* Game tiles - positioned to match grid */}
      {board.map((row, rowIndex) =>
        row.map((value, colIndex) => {
          if (value === 0) return null;
          
          const key = `tile-${rowIndex}-${colIndex}`;
          // Calculate position based on grid layout with gaps
          const cellSize = (400 - 32 - 36) / 4; // (total - padding - gaps) / cells
          const gapSize = 12; // 3 * 4px gap
          const left = 16 + colIndex * (cellSize + gapSize);
          const top = 16 + rowIndex * (cellSize + gapSize);
          
          return (
            <div
              key={key}
              className="absolute transition-all duration-150 ease-in-out rounded-lg"
              style={{
                left: `${left}px`,
                top: `${top}px`,
                width: `${cellSize}px`,
                height: `${cellSize}px`,
              }}
            >
              <GameTile
                value={value}
                isNew={isNewTile(rowIndex, colIndex, value)}
                isMerged={isMergedTile(rowIndex, colIndex, value)}
              />
            </div>
          );
        })
      )}
      
      {/* Game status overlay */}
      {gameState.gameStatus === 'paused' && (
        <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
          <div className="text-white text-3xl font-bold">PAUSED</div>
        </div>
      )}
    </div>
  );
});

// Helper functions to determine tile states
function isNewTile(_row: number, _col: number, _value: TileValue): boolean {
  // In a real implementation, you'd track which tiles are new
  // For now, we'll use a simple heuristic
  return false;
}

function isMergedTile(_row: number, _col: number, _value: TileValue): boolean {
  // In a real implementation, you'd track which tiles were merged
  // For now, we'll use a simple heuristic
  return false;
}

GameBoard.displayName = 'GameBoard';