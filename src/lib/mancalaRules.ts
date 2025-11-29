// Mancala Game Rules Engine

import type { Board, Player, Move } from '@/types/mancala.types'

// Board layout:
// P2 Store [13]
// P2 Pits: [12] [11] [10] [9] [8] [7]
// P1 Pits: [0]  [1]  [2]  [3] [4] [5]
// P1 Store [6]

export const INITIAL_STONES_PER_PIT = 4
export const PITS_PER_SIDE = 6

export const P1_PITS = [0, 1, 2, 3, 4, 5]
export const P1_STORE = 6
export const P2_PITS = [7, 8, 9, 10, 11, 12]
export const P2_STORE = 13

/**
 * Creates initial game board
 */
export function createInitialBoard(): Board {
  const pits = new Array(14).fill(INITIAL_STONES_PER_PIT)
  pits[P1_STORE] = 0
  pits[P2_STORE] = 0
  return { pits }
}

/**
 * Gets the store index for a player
 */
export function getPlayerStore(player: Player): number {
  return player === 1 ? P1_STORE : P2_STORE
}

/**
 * Gets the opponent's store index
 */
export function getOpponentStore(player: Player): number {
  return player === 1 ? P2_STORE : P1_STORE
}

/**
 * Gets pit indices owned by a player
 */
export function getPlayerPits(player: Player): number[] {
  return player === 1 ? P1_PITS : P2_PITS
}

/**
 * Gets the opposite pit index (for captures)
 */
export function getOppositePit(pitIndex: number): number {
  return 12 - pitIndex
}

/**
 * Checks if a pit belongs to a player
 */
export function isPitOwnedBy(pitIndex: number, player: Player): boolean {
  return getPlayerPits(player).includes(pitIndex)
}

/**
 * Checks if a move is valid
 */
export function isValidMove(board: Board, pitIndex: number, player: Player): boolean {
  // Must be player's pit
  if (!isPitOwnedBy(pitIndex, player)) return false

  // Must have stones
  if (board.pits[pitIndex] === 0) return false

  return true
}

/**
 * Gets all valid moves for a player
 */
export function getValidMoves(board: Board, player: Player): number[] {
  return getPlayerPits(player).filter(pit => board.pits[pit] > 0)
}

/**
 * Executes a move and returns new board state and move info
 */
export function executeMove(
  board: Board,
  pitIndex: number,
  player: Player
): { board: Board; move: Move } {
  const newPits = [...board.pits]
  let stones = newPits[pitIndex]
  newPits[pitIndex] = 0

  let currentPit = pitIndex
  const opponentStore = getOpponentStore(player)
  const playerStore = getPlayerStore(player)
  const affectedPits: number[] = []

  // Distribute stones counter-clockwise
  while (stones > 0) {
    currentPit = (currentPit + 1) % 14

    // Skip opponent's store
    if (currentPit === opponentStore) continue

    newPits[currentPit]++
    affectedPits.push(currentPit)
    stones--
  }

  // Check for capture
  let capturedStones = 0
  const lastPit = currentPit
  const isOwnPit = isPitOwnedBy(lastPit, player)
  const isEmptyBeforeDrop = newPits[lastPit] === 1
  const oppositePit = getOppositePit(lastPit)

  if (isOwnPit && isEmptyBeforeDrop && lastPit !== playerStore && newPits[oppositePit] > 0) {
    // Capture own stone + opposite stones
    capturedStones = newPits[lastPit] + newPits[oppositePit]
    newPits[playerStore] += capturedStones
    newPits[lastPit] = 0
    newPits[oppositePit] = 0
  }

  // Check for extra turn (last stone landed in own store)
  const extraTurn = lastPit === playerStore

  const move: Move = {
    player,
    pitIndex,
    capturedStones: capturedStones > 0 ? capturedStones : undefined,
    extraTurn,
    timestamp: Date.now(),
    affectedPits,
  }

  return { board: { pits: newPits }, move }
}

/**
 * Checks if the game is over
 */
export function isGameOver(board: Board): boolean {
  const p1Empty = P1_PITS.every(pit => board.pits[pit] === 0)
  const p2Empty = P2_PITS.every(pit => board.pits[pit] === 0)
  return p1Empty || p2Empty
}

/**
 * Collects remaining stones and determines winner
 */
export function finalizeGame(board: Board): { board: Board; winner: Player | null } {
  const newPits = [...board.pits]

  // Collect remaining stones to respective stores
  P1_PITS.forEach(pit => {
    newPits[P1_STORE] += newPits[pit]
    newPits[pit] = 0
  })

  P2_PITS.forEach(pit => {
    newPits[P2_STORE] += newPits[pit]
    newPits[pit] = 0
  })

  // Determine winner
  let winner: Player | null = null
  if (newPits[P1_STORE] > newPits[P2_STORE]) {
    winner = 1
  } else if (newPits[P2_STORE] > newPits[P1_STORE]) {
    winner = 2
  }
  // null means tie

  return { board: { pits: newPits }, winner }
}

/**
 * Calculates score for a player (for AI evaluation)
 */
export function calculateScore(board: Board, player: Player): number {
  const playerStore = getPlayerStore(player)
  const opponentStore = getOpponentStore(player)
  return board.pits[playerStore] - board.pits[opponentStore]
}

/**
 * Simulates a move to preview the result without executing it
 * Returns which pits will receive stones and move info
 */
export function simulateMove(
  board: Board,
  pitIndex: number,
  player: Player
): {
  affectedPits: number[]
  lastPit: number
  extraTurn: boolean
  capturedStones: number
  willCapture: boolean
} {
  const opponentStore = getOpponentStore(player)
  const playerStore = getPlayerStore(player)

  let stones = board.pits[pitIndex]
  let currentPit = pitIndex
  const affectedPits: number[] = []

  // Simulate distribution counter-clockwise
  while (stones > 0) {
    currentPit = (currentPit + 1) % 14

    // Skip opponent's store
    if (currentPit === opponentStore) continue

    affectedPits.push(currentPit)
    stones--
  }

  const lastPit = currentPit
  const extraTurn = lastPit === playerStore

  // Check if it would capture
  const isOwnPit = isPitOwnedBy(lastPit, player)
  const isEmptyBeforeDrop = board.pits[lastPit] === 0
  const oppositePit = getOppositePit(lastPit)
  const willCapture =
    isOwnPit && isEmptyBeforeDrop && lastPit !== playerStore && board.pits[oppositePit] > 0

  let capturedStones = 0
  if (willCapture) {
    capturedStones = 1 + board.pits[oppositePit]
  }

  return {
    affectedPits,
    lastPit,
    extraTurn,
    capturedStones,
    willCapture,
  }
}

/**
 * Creates step-by-step board states for animated move execution
 * Returns an array of board states showing each stone being placed
 */
export function executeMoveAnimated(
  board: Board,
  pitIndex: number,
  player: Player
): {
  steps: Board[]
  finalMove: Move
} {
  const steps: Board[] = []
  const currentPits = [...board.pits]

  // Pick up stones
  let stones = currentPits[pitIndex]
  currentPits[pitIndex] = 0
  steps.push({ pits: [...currentPits] })

  let currentPit = pitIndex
  const opponentStore = getOpponentStore(player)
  const playerStore = getPlayerStore(player)
  const affectedPits: number[] = []

  // Distribute stones counter-clockwise, one at a time
  while (stones > 0) {
    currentPit = (currentPit + 1) % 14

    // Skip opponent's store
    if (currentPit === opponentStore) continue

    currentPits[currentPit]++
    affectedPits.push(currentPit)
    stones--

    // Add a step for each stone placed
    steps.push({ pits: [...currentPits] })
  }

  // Check for capture
  let capturedStones = 0
  const lastPit = currentPit
  const isOwnPit = isPitOwnedBy(lastPit, player)
  const isEmptyBeforeDrop = currentPits[lastPit] === 1
  const oppositePit = getOppositePit(lastPit)

  if (isOwnPit && isEmptyBeforeDrop && lastPit !== playerStore && currentPits[oppositePit] > 0) {
    // Capture own stone + opposite stones
    capturedStones = currentPits[lastPit] + currentPits[oppositePit]
    currentPits[playerStore] += capturedStones
    currentPits[lastPit] = 0
    currentPits[oppositePit] = 0

    // Add a step for the capture
    steps.push({ pits: [...currentPits] })
  }

  // Check for extra turn (last stone landed in own store)
  const extraTurn = lastPit === playerStore

  const finalMove: Move = {
    player,
    pitIndex,
    capturedStones: capturedStones > 0 ? capturedStones : undefined,
    extraTurn,
    timestamp: Date.now(),
    affectedPits,
  }

  return { steps, finalMove }
}
