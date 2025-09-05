// Game type definitions for 2048 clone
export type Direction = 'up' | 'down' | 'left' | 'right';
export type GameStatus = 'playing' | 'won' | 'lost' | 'paused';
export type TileValue = 0 | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 | 8192;

export interface Position {
  row: number;
  col: number;
}

export interface Tile {
  id: string;
  value: TileValue;
  position: Position;
  isNew?: boolean;
  isMerged?: boolean;
  previousPosition?: Position;
}

export interface GameState {
  board: TileValue[][];
  tiles: Tile[];
  score: number;
  bestScore: number;
  gameStatus: GameStatus;
  canUndo: boolean;
  previousState?: GameState;
  moveCount: number;
  startTime: Date;
  endTime?: Date;
  lastMergedTiles?: Array<{ row: number; col: number; value: TileValue }>;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  finalTile: TileValue;
  moveCount: number;
  timestamp: Date;
  gameTime: number; // in seconds
  boardState: TileValue[][];
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  totalScore: number;
  bestScore: number;
  averageScore: number;
  totalMoves: number;
  averageMovesPerGame: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  condition: (stats: GameStats, gameState: GameState) => boolean;
}

export interface AnimationState {
  isAnimating: boolean;
  direction?: Direction;
  mergedTiles: Set<string>;
  newTiles: Set<string>;
}

export interface GameConfig {
  boardSize: number;
  winTile: TileValue;
  newTileValues: TileValue[];
  newTileChances: number[];
  animationDuration: number;
}