// Mancala Game Types

export type Player = 1 | 2

export type GameStatus = 'setup' | 'playing' | 'finished'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type GameMode = 'vsAI' | 'vsHuman' | 'tutorial'

export interface Board {
  pits: number[] // Array of 14: [0-5: P1 pits, 6: P1 store, 7-12: P2 pits, 13: P2 store]
}

export interface GameState {
  board: Board
  currentPlayer: Player
  status: GameStatus
  winner: Player | null
  mode: GameMode
  difficulty: Difficulty
  moveHistory: Move[]
  lastMove: Move | null
  undoState: {
    board: Board
    currentPlayer: Player
    lastMove: Move | null
  } | null
}

export interface Move {
  player: Player
  pitIndex: number
  capturedStones?: number
  extraTurn?: boolean
  timestamp: number
  affectedPits?: number[] // Pits that received stones during distribution
}

export interface LeaderboardEntry {
  id: string
  playerName: string
  wins: number
  losses: number
  winStreak: number
  highestCapture: number
  fastestWin: number // in seconds
  totalGamesPlayed: number
  lastPlayed: number // timestamp
}

export interface AnimationState {
  animatingPit: number | null
  animatingStones: StoneAnimation[]
}

export interface StoneAnimation {
  id: string
  fromPit: number
  toPit: number
  progress: number // 0 to 1
}

export type AchievementId =
  | 'perfect_capture'
  | 'chain_master'
  | 'comeback_king'
  | 'speed_demon'
  | 'undefeated'
  | 'stone_master'
  | 'first_win'
  | 'perfect_game'

export interface Achievement {
  id: AchievementId
  name: string
  description: string
  icon: string
  unlockedAt: number | null
  progress?: number
  target?: number
}

export interface AchievementProgress {
  totalStonesCaptured: number
  currentWinStreak: number
  maxCaptureInSingleMove: number
  currentExtraTurnChain: number
  maxExtraTurnChain: number
}
