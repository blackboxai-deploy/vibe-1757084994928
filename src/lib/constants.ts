import { GameConfig, TileValue } from '@/types/game';

export const GAME_CONFIG: GameConfig = {
  boardSize: 4,
  winTile: 2048,
  newTileValues: [2, 4],
  newTileChances: [0.9, 0.1],
  animationDuration: 150,
};

export const TILE_COLORS: Record<TileValue, { bg: string; text: string; border: string }> = {
  0: { bg: 'bg-gray-200/50', text: 'text-transparent', border: 'border-gray-300' },
  2: { bg: 'bg-gradient-to-br from-blue-100 to-blue-200', text: 'text-blue-900', border: 'border-blue-300' },
  4: { bg: 'bg-gradient-to-br from-blue-200 to-blue-300', text: 'text-blue-900', border: 'border-blue-400' },
  8: { bg: 'bg-gradient-to-br from-purple-200 to-purple-300', text: 'text-white', border: 'border-purple-400' },
  16: { bg: 'bg-gradient-to-br from-purple-300 to-pink-300', text: 'text-white', border: 'border-purple-500' },
  32: { bg: 'bg-gradient-to-br from-pink-300 to-red-300', text: 'text-white', border: 'border-pink-500' },
  64: { bg: 'bg-gradient-to-br from-red-400 to-orange-400', text: 'text-white', border: 'border-red-500' },
  128: { bg: 'bg-gradient-to-br from-orange-400 to-yellow-400', text: 'text-white', border: 'border-orange-500' },
  256: { bg: 'bg-gradient-to-br from-yellow-400 to-green-400', text: 'text-white', border: 'border-yellow-500' },
  512: { bg: 'bg-gradient-to-br from-green-400 to-teal-400', text: 'text-white', border: 'border-green-500' },
  1024: { bg: 'bg-gradient-to-br from-teal-500 to-indigo-500', text: 'text-white', border: 'border-teal-600' },
  2048: { bg: 'bg-gradient-to-br from-indigo-500 to-purple-600 animate-pulse', text: 'text-yellow-300', border: 'border-indigo-600' },
  4096: { bg: 'bg-gradient-to-br from-purple-600 to-pink-600 animate-pulse', text: 'text-yellow-200', border: 'border-purple-700' },
  8192: { bg: 'bg-gradient-to-br from-pink-600 to-red-600 animate-pulse', text: 'text-yellow-100', border: 'border-pink-700' },
};

export const KEY_CODES = {
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  W: 'KeyW',
  A: 'KeyA',
  S: 'KeyS',
  D: 'KeyD',
  SPACE: 'Space',
  ENTER: 'Enter',
  Z: 'KeyZ',
  U: 'KeyU',
  ESCAPE: 'Escape',
} as const;

export const ACHIEVEMENTS = [
  {
    id: 'first-merge',
    name: 'First Merge',
    description: 'Combine two tiles for the first time',
    icon: '🎯',
  },
  {
    id: 'reach-128',
    name: 'Century Club',
    description: 'Reach the 128 tile',
    icon: '💯',
  },
  {
    id: 'reach-512',
    name: 'Power User',
    description: 'Reach the 512 tile',
    icon: '⚡',
  },
  {
    id: 'reach-1024',
    name: 'Kilobyte Master',
    description: 'Reach the 1024 tile',
    icon: '🚀',
  },
  {
    id: 'reach-2048',
    name: 'Winner!',
    description: 'Reach the legendary 2048 tile',
    icon: '👑',
  },
  {
    id: 'score-10k',
    name: 'High Scorer',
    description: 'Score 10,000 points in a single game',
    icon: '🎖️',
  },
  {
    id: 'efficient-player',
    name: 'Efficiency Expert',
    description: 'Win with fewer than 500 moves',
    icon: '🎲',
  },
  {
    id: 'streak-5',
    name: 'On Fire',
    description: 'Win 5 games in a row',
    icon: '🔥',
  },
] as const;

export const STORAGE_KEYS = {
  GAME_STATE: '2048-game-state',
  LEADERBOARD: '2048-leaderboard',
  SETTINGS: '2048-settings',
  STATS: '2048-stats',
} as const;