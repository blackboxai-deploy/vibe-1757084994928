'use client';

import { memo } from 'react';
import { TileValue } from '@/types/game';
import { TILE_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface GameTileProps {
  value: TileValue;
  isNew?: boolean;
  isMerged?: boolean;
  className?: string;
}

export const GameTile = memo(function GameTile({ 
  value, 
  isNew = false, 
  isMerged = false,
  className 
}: GameTileProps) {
  if (value === 0) return null;

  const colors = TILE_COLORS[value];
  const displayValue = value.toLocaleString();
  
  // Determine font size based on value length
  const getFontSize = (val: TileValue) => {
    if (val >= 1024) return 'text-2xl';
    if (val >= 128) return 'text-3xl';
    if (val >= 16) return 'text-4xl';
    return 'text-5xl';
  };

  return (
    <div
      className={cn(
        'w-full h-full rounded-lg flex items-center justify-center font-bold transition-all duration-150 ease-in-out border-2',
        colors.bg,
        colors.text,
        colors.border,
        getFontSize(value),
        {
          'animate-pulse scale-110': isMerged,
          'animate-bounce': isNew,
          'shadow-lg': value >= 128,
          'shadow-xl shadow-yellow-500/50': value >= 2048,
        },
        className
      )}
      style={{
        animationDuration: isNew ? '0.3s' : isMerged ? '0.2s' : undefined,
        animationFillMode: 'forwards',
      }}
    >
      <span 
        className={cn(
          'select-none',
          value >= 2048 && 'drop-shadow-lg'
        )}
      >
        {displayValue}
      </span>
    </div>
  );
});

GameTile.displayName = 'GameTile';