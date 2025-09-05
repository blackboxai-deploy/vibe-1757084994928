'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, Direction, TileValue } from '@/types/game';
import { 
  initializeGame, 
  makeMove, 
  saveGameState, 
  loadGameState 
} from '@/lib/gameLogic';
import { saveToLeaderboard, updateGameStats } from '@/lib/storage';

export function useGame() {
  const [gameState, setGameState] = useState<GameState>(() => {
    // Initialize with a fresh game, will be replaced by saved state if available
    return initializeGame();
  });
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [showNewGameDialog, setShowNewGameDialog] = useState(false);
  const [showLeaderboardDialog, setShowLeaderboardDialog] = useState(false);
  const [gameEndProcessed, setGameEndProcessed] = useState(false);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Load saved game state on mount
  useEffect(() => {
    const savedState = loadGameState();
    if (savedState) {
      setGameState(savedState);
    }
  }, []);

  // Save game state whenever it changes
  useEffect(() => {
    if (gameState.moveCount > 0) {
      saveGameState(gameState);
    }
  }, [gameState]);

  // Handle game end logic
  useEffect(() => {
    if ((gameState.gameStatus === 'won' || gameState.gameStatus === 'lost') && !gameEndProcessed) {
      setGameEndProcessed(true);
      
      // Update statistics
      updateGameStats(
        gameState.score,
        gameState.moveCount,
        gameState.gameStatus === 'won',
        Math.max(...gameState.board.flat())
      );
      
      // Show leaderboard if score is high enough
      setTimeout(() => {
        setShowLeaderboardDialog(true);
      }, 2000);
    }
  }, [gameState.gameStatus, gameEndProcessed]);

  const move = useCallback((direction: Direction, onMerge?: (row: number, col: number, value: TileValue) => void) => {
    if (isAnimating || gameState.gameStatus !== 'playing') return;
    
    setIsAnimating(true);
    
    // Clear any existing animation timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    
    const newState = makeMove(gameState, direction);
    
    if (newState !== gameState) {
      setGameState(newState);
      
      // Trigger confetti for merged tiles
      if (newState.lastMergedTiles && onMerge) {
        newState.lastMergedTiles.forEach(({ row, col, value }) => {
          onMerge(row, col, value);
        });
      }
      
      // Reset animation state after animation duration
      animationTimeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
      }, 150);
    } else {
      setIsAnimating(false);
    }
  }, [gameState, isAnimating]);

  const newGame = useCallback(() => {
    if (gameState.moveCount > 0 && gameState.gameStatus === 'playing') {
      setShowNewGameDialog(true);
    } else {
      startNewGame();
    }
  }, [gameState.moveCount, gameState.gameStatus]);

  const startNewGame = useCallback(() => {
    const freshGame = initializeGame();
    setGameState(freshGame);
    setIsAnimating(false);
    setShowNewGameDialog(false);
    setGameEndProcessed(false);
    
    // Clear animation timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
  }, []);

  const undo = useCallback(() => {
    if (gameState.canUndo && gameState.previousState && !isAnimating) {
      setGameState({
        ...gameState.previousState,
        canUndo: false,
        bestScore: gameState.bestScore, // Keep the current best score
      });
    }
  }, [gameState, isAnimating]);

  const pause = useCallback(() => {
    if (gameState.gameStatus === 'playing') {
      setGameState(prev => ({
        ...prev,
        gameStatus: 'paused',
      }));
    } else if (gameState.gameStatus === 'paused') {
      setGameState(prev => ({
        ...prev,
        gameStatus: 'playing',
      }));
    }
  }, [gameState.gameStatus]);

  const saveScore = useCallback((playerName: string) => {
    if (!gameState.endTime) return;
    
    const gameTime = (gameState.endTime.getTime() - gameState.startTime.getTime()) / 1000;
    
    saveToLeaderboard({
      playerName: playerName || 'Anonymous',
      score: gameState.score,
      finalTile: Math.max(...gameState.board.flat()) as any,
      moveCount: gameState.moveCount,
      timestamp: new Date(),
      gameTime,
      boardState: gameState.board,
    });
    
    setShowLeaderboardDialog(false);
  }, [gameState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  return {
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
  };
}