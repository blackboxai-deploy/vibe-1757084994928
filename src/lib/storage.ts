import { LeaderboardEntry, GameStats } from '@/types/game';
import { STORAGE_KEYS } from './constants';

export function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return parsed.map((entry: any) => ({
      ...entry,
      timestamp: new Date(entry.timestamp),
    }));
  } catch {
    return [];
  }
}

export function saveToLeaderboard(entry: Omit<LeaderboardEntry, 'id'>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const leaderboard = getLeaderboard();
    const newEntry: LeaderboardEntry = {
      ...entry,
      id: `score-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    leaderboard.push(newEntry);
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Keep only top 10
    const topTen = leaderboard.slice(0, 10);
    
    localStorage.setItem(
      STORAGE_KEYS.LEADERBOARD,
      JSON.stringify(topTen.map(entry => ({
        ...entry,
        timestamp: entry.timestamp.toISOString(),
      })))
    );
  } catch (error) {
    console.error('Failed to save to leaderboard:', error);
  }
}

export function getGameStats(): GameStats {
  if (typeof window === 'undefined') {
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      totalScore: 0,
      bestScore: 0,
      averageScore: 0,
      totalMoves: 0,
      averageMovesPerGame: 0,
      achievements: [],
    };
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.STATS);
    if (!stored) {
      return {
        gamesPlayed: 0,
        gamesWon: 0,
        totalScore: 0,
        bestScore: 0,
        averageScore: 0,
        totalMoves: 0,
        averageMovesPerGame: 0,
        achievements: [],
      };
    }
    
    const parsed = JSON.parse(stored);
    return {
      ...parsed,
      achievements: parsed.achievements?.map((achievement: any) => ({
        ...achievement,
        unlockedAt: achievement.unlockedAt ? new Date(achievement.unlockedAt) : undefined,
      })) || [],
    };
  } catch {
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      totalScore: 0,
      bestScore: 0,
      averageScore: 0,
      totalMoves: 0,
      averageMovesPerGame: 0,
      achievements: [],
    };
  }
}

export function updateGameStats(
  score: number,
  moves: number,
  won: boolean,
  _finalTile: number
): void {
  if (typeof window === 'undefined') return;
  
  try {
    const stats = getGameStats();
    
    const newStats: GameStats = {
      ...stats,
      gamesPlayed: stats.gamesPlayed + 1,
      gamesWon: stats.gamesWon + (won ? 1 : 0),
      totalScore: stats.totalScore + score,
      bestScore: Math.max(stats.bestScore, score),
      totalMoves: stats.totalMoves + moves,
      averageScore: Math.round((stats.totalScore + score) / (stats.gamesPlayed + 1)),
      averageMovesPerGame: Math.round((stats.totalMoves + moves) / (stats.gamesPlayed + 1)),
    };
    
    localStorage.setItem(
      STORAGE_KEYS.STATS,
      JSON.stringify({
        ...newStats,
        achievements: newStats.achievements.map(achievement => ({
          ...achievement,
          unlockedAt: achievement.unlockedAt?.toISOString(),
        })),
      })
    );
  } catch (error) {
    console.error('Failed to update game stats:', error);
  }
}

export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  localStorage.removeItem('2048-best-score');
}

export function exportData(): string {
  if (typeof window === 'undefined') return '';
  
  try {
    const data = {
      leaderboard: getLeaderboard(),
      stats: getGameStats(),
      bestScore: parseInt(localStorage.getItem('2048-best-score') || '0', 10),
      exportDate: new Date().toISOString(),
    };
    
    return JSON.stringify(data, null, 2);
  } catch {
    return '';
  }
}

export function importData(jsonData: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const data = JSON.parse(jsonData);
    
    if (data.leaderboard) {
      localStorage.setItem(
        STORAGE_KEYS.LEADERBOARD,
        JSON.stringify(data.leaderboard)
      );
    }
    
    if (data.stats) {
      localStorage.setItem(
        STORAGE_KEYS.STATS,
        JSON.stringify(data.stats)
      );
    }
    
    if (typeof data.bestScore === 'number') {
      localStorage.setItem('2048-best-score', data.bestScore.toString());
    }
    
    return true;
  } catch {
    return false;
  }
}