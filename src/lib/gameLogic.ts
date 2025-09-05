import { Direction, GameState, TileValue, Position, Tile, GameStatus } from '@/types/game';
import { GAME_CONFIG } from './constants';

export function createEmptyBoard(): TileValue[][] {
  return Array(GAME_CONFIG.boardSize)
    .fill(null)
    .map(() => Array(GAME_CONFIG.boardSize).fill(0));
}

export function getEmptyPositions(board: TileValue[][]): Position[] {
  const empty: Position[] = [];
  for (let row = 0; row < GAME_CONFIG.boardSize; row++) {
    for (let col = 0; col < GAME_CONFIG.boardSize; col++) {
      if (board[row][col] === 0) {
        empty.push({ row, col });
      }
    }
  }
  return empty;
}

export function addRandomTile(board: TileValue[][]): TileValue[][] {
  const newBoard = board.map(row => [...row]);
  const emptyPositions = getEmptyPositions(newBoard);
  
  if (emptyPositions.length === 0) return newBoard;
  
  const randomPosition = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
  const randomValue = Math.random() < GAME_CONFIG.newTileChances[0] ? 
    GAME_CONFIG.newTileValues[0] : GAME_CONFIG.newTileValues[1];
  
  newBoard[randomPosition.row][randomPosition.col] = randomValue as TileValue;
  return newBoard;
}

export function initializeGame(): GameState {
  let board = createEmptyBoard();
  board = addRandomTile(board);
  board = addRandomTile(board);
  
  return {
    board,
    tiles: boardToTiles(board),
    score: 0,
    bestScore: getBestScore(),
    gameStatus: 'playing',
    canUndo: false,
    moveCount: 0,
    startTime: new Date(),
  };
}

export function boardToTiles(board: TileValue[][]): Tile[] {
  const tiles: Tile[] = [];
  for (let row = 0; row < GAME_CONFIG.boardSize; row++) {
    for (let col = 0; col < GAME_CONFIG.boardSize; col++) {
      if (board[row][col] !== 0) {
        tiles.push({
          id: `tile-${row}-${col}-${board[row][col]}`,
          value: board[row][col],
          position: { row, col },
        });
      }
    }
  }
  return tiles;
}

export function slideArray(arr: TileValue[], rowIndex?: number, isVertical?: boolean): { 
  newArr: TileValue[]; 
  score: number; 
  moved: boolean; 
  merges: Array<{ position: number; value: TileValue; rowIndex?: number }>;
} {
  const filtered = arr.filter(val => val !== 0);
  const newArr: TileValue[] = [];
  const merges: Array<{ position: number; value: TileValue; rowIndex?: number }> = [];
  let score = 0;
  let moved = false;
  
  for (let i = 0; i < filtered.length; i++) {
    if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
      // Merge tiles
      const mergedValue = (filtered[i] * 2) as TileValue;
      newArr.push(mergedValue);
      score += mergedValue;
      
      // Record merge info for confetti
      merges.push({
        position: newArr.length - 1,
        value: mergedValue,
        rowIndex,
      });
      
      i++; // Skip the next tile as it's merged
      moved = true;
    } else {
      newArr.push(filtered[i]);
    }
  }
  
  // Fill with zeros
  while (newArr.length < GAME_CONFIG.boardSize) {
    newArr.push(0);
  }
  
  // Check if array changed
  if (!moved) {
    moved = !arr.every((val, idx) => val === newArr[idx]);
  }
  
  return { newArr, score, moved, merges };
}

export function moveBoard(board: TileValue[][], direction: Direction): { 
  newBoard: TileValue[][]; 
  score: number; 
  moved: boolean;
  mergedTiles: Array<{ row: number; col: number; value: TileValue }>;
} {
  const newBoard = board.map(row => [...row]);
  const mergedTiles: Array<{ row: number; col: number; value: TileValue }> = [];
  let totalScore = 0;
  let totalMoved = false;
  
  switch (direction) {
    case 'left': {
      for (let row = 0; row < GAME_CONFIG.boardSize; row++) {
        const { newArr, score, moved, merges } = slideArray(newBoard[row], row);
        newBoard[row] = newArr;
        totalScore += score;
        totalMoved = totalMoved || moved;
        
        // Add merge positions
        merges.forEach(merge => {
          mergedTiles.push({
            row,
            col: merge.position,
            value: merge.value,
          });
        });
      }
      break;
    }
    
    case 'right': {
      for (let row = 0; row < GAME_CONFIG.boardSize; row++) {
        const { newArr, score, moved, merges } = slideArray([...newBoard[row]].reverse(), row);
        newBoard[row] = newArr.reverse();
        totalScore += score;
        totalMoved = totalMoved || moved;
        
        // Add merge positions (adjust for reverse)
        merges.forEach(merge => {
          mergedTiles.push({
            row,
            col: GAME_CONFIG.boardSize - 1 - merge.position,
            value: merge.value,
          });
        });
      }
      break;
    }
    
    case 'up': {
      for (let col = 0; col < GAME_CONFIG.boardSize; col++) {
        const column = newBoard.map(row => row[col]);
        const { newArr, score, moved, merges } = slideArray(column, col, true);
        for (let row = 0; row < GAME_CONFIG.boardSize; row++) {
          newBoard[row][col] = newArr[row];
        }
        totalScore += score;
        totalMoved = totalMoved || moved;
        
        // Add merge positions
        merges.forEach(merge => {
          mergedTiles.push({
            row: merge.position,
            col,
            value: merge.value,
          });
        });
      }
      break;
    }
    
    case 'down': {
      for (let col = 0; col < GAME_CONFIG.boardSize; col++) {
        const column = newBoard.map(row => row[col]);
        const { newArr, score, moved, merges } = slideArray(column.reverse(), col, true);
        const reversedNewArr = newArr.reverse();
        for (let row = 0; row < GAME_CONFIG.boardSize; row++) {
          newBoard[row][col] = reversedNewArr[row];
        }
        totalScore += score;
        totalMoved = totalMoved || moved;
        
        // Add merge positions (adjust for reverse)
        merges.forEach(merge => {
          mergedTiles.push({
            row: GAME_CONFIG.boardSize - 1 - merge.position,
            col,
            value: merge.value,
          });
        });
      }
      break;
    }
  }
  
  return { newBoard, score: totalScore, moved: totalMoved, mergedTiles };
}

export function canMove(board: TileValue[][]): boolean {
  // Check for empty cells
  if (getEmptyPositions(board).length > 0) return true;
  
  // Check for possible merges
  for (let row = 0; row < GAME_CONFIG.boardSize; row++) {
    for (let col = 0; col < GAME_CONFIG.boardSize; col++) {
      const current = board[row][col];
      
      // Check right neighbor
      if (col < GAME_CONFIG.boardSize - 1 && board[row][col + 1] === current) {
        return true;
      }
      
      // Check bottom neighbor
      if (row < GAME_CONFIG.boardSize - 1 && board[row + 1][col] === current) {
        return true;
      }
    }
  }
  
  return false;
}

export function hasWon(board: TileValue[][]): boolean {
  return board.some(row => row.some(cell => cell >= GAME_CONFIG.winTile));
}

export function getGameStatus(board: TileValue[][], previousStatus: GameStatus): GameStatus {
  if (previousStatus === 'won') return 'won';
  if (hasWon(board)) return 'won';
  if (!canMove(board)) return 'lost';
  return 'playing';
}

export function makeMove(state: GameState, direction: Direction): GameState {
  if (state.gameStatus !== 'playing') return state;
  
  const { newBoard, score: moveScore, moved, mergedTiles } = moveBoard(state.board, direction);
  
  if (!moved) return state;
  
  // Add random tile
  const finalBoard = addRandomTile(newBoard);
  const newScore = state.score + moveScore;
  const newBestScore = Math.max(state.bestScore, newScore);
  
  // Update best score in localStorage
  if (newBestScore > state.bestScore) {
    setBestScore(newBestScore);
  }
  
  const newState: GameState = {
    ...state,
    board: finalBoard,
    tiles: boardToTiles(finalBoard),
    score: newScore,
    bestScore: newBestScore,
    gameStatus: getGameStatus(finalBoard, state.gameStatus),
    canUndo: true,
    previousState: { ...state },
    moveCount: state.moveCount + 1,
    // Add merged tiles info for confetti
    lastMergedTiles: mergedTiles,
  };
  
  if (newState.gameStatus === 'lost' || newState.gameStatus === 'won') {
    newState.endTime = new Date();
  }
  
  return newState;
}

export function getBestScore(): number {
  if (typeof window === 'undefined') return 0;
  return parseInt(localStorage.getItem('2048-best-score') || '0', 10);
}

export function setBestScore(score: number): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('2048-best-score', score.toString());
}

export function saveGameState(state: GameState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('2048-game-state', JSON.stringify({
    ...state,
    startTime: state.startTime.toISOString(),
    endTime: state.endTime?.toISOString(),
  }));
}

export function loadGameState(): GameState | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const saved = localStorage.getItem('2048-game-state');
    if (!saved) return null;
    
    const parsed = JSON.parse(saved);
    return {
      ...parsed,
      startTime: new Date(parsed.startTime),
      endTime: parsed.endTime ? new Date(parsed.endTime) : undefined,
    };
  } catch {
    return null;
  }
}