'use client';

import { useState, useEffect, useCallback } from 'react';
import { TileValue } from '@/types/game';

interface ConfettiTrigger {
  id: string;
  originX: number;
  originY: number;
  tileValue: TileValue;
  timestamp: number;
}

export function useConfetti() {
  const [confettiTriggers, setConfettiTriggers] = useState<ConfettiTrigger[]>([]);

  const triggerConfetti = useCallback((
    row: number, 
    col: number, 
    tileValue: TileValue,
    boardElement?: HTMLElement
  ) => {
    // Only trigger confetti for significant merges
    if (tileValue < 128) return;

    // Calculate position relative to the board
    let originX = 50; // Default center
    let originY = 50;

    if (boardElement) {
      const boardRect = boardElement.getBoundingClientRect();
      // Calculate tile position within the board
      const cellSize = (400 - 32 - 36) / 4; // Same calculation as GameBoard
      const gapSize = 12;
      const tileLeft = 16 + col * (cellSize + gapSize) + cellSize / 2;
      const tileTop = 16 + row * (cellSize + gapSize) + cellSize / 2;
      
      // Convert to viewport percentages
      originX = ((boardRect.left + tileLeft) / window.innerWidth) * 100;
      originY = ((boardRect.top + tileTop) / window.innerHeight) * 100;
    }

    const newTrigger: ConfettiTrigger = {
      id: `confetti-${Date.now()}-${Math.random()}`,
      originX,
      originY,
      tileValue,
      timestamp: Date.now(),
    };

    setConfettiTriggers(prev => [...prev, newTrigger]);

    // Remove trigger after animation completes
    setTimeout(() => {
      setConfettiTriggers(prev => prev.filter(t => t.id !== newTrigger.id));
    }, 4500); // Longer timeout for slower confetti
  }, []);

  // Clean up old triggers periodically
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setConfettiTriggers(prev => prev.filter(t => now - t.timestamp < 5000)); // Longer cleanup time
    }, 1000);

    return () => clearInterval(cleanup);
  }, []);

  return {
    confettiTriggers,
    triggerConfetti,
  };
}