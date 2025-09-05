'use client';

import { useEffect, useCallback } from 'react';
import { Direction } from '@/types/game';
import { KEY_CODES } from '@/lib/constants';

interface UseKeyboardProps {
  onMove: (direction: Direction) => void;
  onNewGame: () => void;
  onUndo: () => void;
  onPause: () => void;
  enabled?: boolean;
}

export function useKeyboard({
  onMove,
  onNewGame,
  onUndo,
  onPause,
  enabled = true,
}: UseKeyboardProps) {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;
      
      // Prevent default behavior for game keys
      const gameKeys = Object.values(KEY_CODES);
      if (gameKeys.includes(event.code as any)) {
        event.preventDefault();
      }
      
      switch (event.code) {
        case KEY_CODES.ARROW_UP:
        case KEY_CODES.W:
          onMove('up');
          break;
        case KEY_CODES.ARROW_DOWN:
        case KEY_CODES.S:
          onMove('down');
          break;
        case KEY_CODES.ARROW_LEFT:
        case KEY_CODES.A:
          onMove('left');
          break;
        case KEY_CODES.ARROW_RIGHT:
        case KEY_CODES.D:
          onMove('right');
          break;
        case KEY_CODES.SPACE:
        case KEY_CODES.ENTER:
          onNewGame();
          break;
        case KEY_CODES.Z:
        case KEY_CODES.U:
          onUndo();
          break;
        case KEY_CODES.ESCAPE:
          onPause();
          break;
        default:
          break;
      }
    },
    [onMove, onNewGame, onUndo, onPause, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress, enabled]);
}