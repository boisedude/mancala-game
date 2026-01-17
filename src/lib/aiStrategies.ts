// AI Strategies for Mancala

import type { Board, Player, Difficulty } from '@/types/mancala.types'
import {
  getValidMoves,
  executeMove,
  calculateScore,
  isGameOver,
  finalizeGame,
  getPlayerStore,
} from './mancalaRules'

// AI Strategy Constants
const AI_CONSTANTS = {
  // Minimax search depth for hard AI
  HARD_AI_DEPTH: 6,

  // Easy AI scoring weights
  EASY_STONE_GAIN_WEIGHT: 2,
  EASY_EXTRA_TURN_BONUS: 10,
  EASY_CAPTURE_MULTIPLIER: 3,
  EASY_RANDOMNESS_FACTOR: 15,
  EASY_EXTRA_TURN_NOTICE_CHANCE: 0.3,
  EASY_CAPTURE_NOTICE_CHANCE: 0.3,

  // Medium AI scoring weights
  MEDIUM_EXTRA_TURN_BONUS: 50,
  MEDIUM_CAPTURE_MULTIPLIER: 10,

  // Board evaluation weights
  MOBILITY_WEIGHT: 0.5,
} as const

/**
 * Selects best move for AI based on difficulty
 */
export function selectAIMove(board: Board, player: Player, difficulty: Difficulty): number {
  const validMoves = getValidMoves(board, player)

  if (validMoves.length === 0) {
    throw new Error('No valid moves available for AI')
  }

  switch (difficulty) {
    case 'easy':
      return selectRandomMove(validMoves, board, player)
    case 'medium':
      return selectGreedyMove(board, player, validMoves)
    case 'hard':
      return selectMinimaxMove(board, player, validMoves)
    default:
      return selectRandomMove(validMoves, board, player)
  }
}

/**
 * Easy AI: Simple strategy with some randomness
 * - Prefers moves that add stones to own store
 * - Sometimes misses captures (70% of the time)
 * - Doesn't plan ahead
 */
function selectRandomMove(validMoves: number[], board: Board, player: Player): number {
  const playerStore = getPlayerStore(player)
  const movesWithScores = validMoves.map(move => {
    const { board: newBoard, move: moveInfo } = executeMove(board, move, player)
    let score = 0

    // Slightly prefer moves that add to store
    const stoneGain = newBoard.pits[playerStore] - board.pits[playerStore]
    score += stoneGain * AI_CONSTANTS.EASY_STONE_GAIN_WEIGHT

    // Chance to notice and take extra turns
    if (moveInfo.extraTurn && Math.random() < AI_CONSTANTS.EASY_EXTRA_TURN_NOTICE_CHANCE) {
      score += AI_CONSTANTS.EASY_EXTRA_TURN_BONUS
    }

    // Chance to notice and take captures
    if (moveInfo.capturedStones && Math.random() < AI_CONSTANTS.EASY_CAPTURE_NOTICE_CHANCE) {
      score += moveInfo.capturedStones * AI_CONSTANTS.EASY_CAPTURE_MULTIPLIER
    }

    // Add significant randomness
    score += Math.random() * AI_CONSTANTS.EASY_RANDOMNESS_FACTOR

    return { move, score }
  })

  // Sort by score and pick from top 50%
  movesWithScores.sort((a, b) => b.score - a.score)
  const topHalf = movesWithScores.slice(0, Math.max(1, Math.ceil(movesWithScores.length / 2)))
  const selected = topHalf[Math.floor(Math.random() * topHalf.length)]

  return selected.move
}

/**
 * Medium AI: Greedy strategy with some heuristics
 */
function selectGreedyMove(board: Board, player: Player, validMoves: number[]): number {
  let bestMove = validMoves[0]
  let bestScore = -Infinity

  for (const move of validMoves) {
    const { board: newBoard, move: moveInfo } = executeMove(board, move, player)
    let score = 0

    // Prioritize extra turns
    if (moveInfo.extraTurn) {
      score += AI_CONSTANTS.MEDIUM_EXTRA_TURN_BONUS
    }

    // Prioritize captures
    if (moveInfo.capturedStones) {
      score += moveInfo.capturedStones * AI_CONSTANTS.MEDIUM_CAPTURE_MULTIPLIER
    }

    // Consider immediate stone gain
    const playerStore = getPlayerStore(player)
    score += newBoard.pits[playerStore] - board.pits[playerStore]

    if (score > bestScore) {
      bestScore = score
      bestMove = move
    }
  }

  return bestMove
}

/**
 * Hard AI: Minimax with alpha-beta pruning (limited depth)
 */
function selectMinimaxMove(board: Board, player: Player, validMoves: number[]): number {
  let bestMove = validMoves[0]
  let bestValue = -Infinity

  for (const move of validMoves) {
    const { board: newBoard, move: moveInfo } = executeMove(board, move, player)

    // If extra turn, same player goes again (max node)
    const value = moveInfo.extraTurn
      ? minimax(newBoard, player, player, AI_CONSTANTS.HARD_AI_DEPTH - 1, -Infinity, Infinity, true)
      : minimax(newBoard, player, player === 1 ? 2 : 1, AI_CONSTANTS.HARD_AI_DEPTH - 1, -Infinity, Infinity, false)

    if (value > bestValue) {
      bestValue = value
      bestMove = move
    }
  }

  return bestMove
}

/**
 * Minimax algorithm with alpha-beta pruning
 */
function minimax(
  board: Board,
  aiPlayer: Player,
  currentPlayer: Player,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number {
  // Terminal conditions
  if (depth === 0 || isGameOver(board)) {
    if (isGameOver(board)) {
      const { board: finalBoard } = finalizeGame(board)
      return evaluateBoard(finalBoard, aiPlayer)
    }
    return evaluateBoard(board, aiPlayer)
  }

  const validMoves = getValidMoves(board, currentPlayer)

  // No valid moves (shouldn't happen in normal game flow)
  if (validMoves.length === 0) {
    return evaluateBoard(board, aiPlayer)
  }

  if (isMaximizing) {
    let maxValue = -Infinity

    for (const move of validMoves) {
      const { board: newBoard, move: moveInfo } = executeMove(board, move, currentPlayer)

      const value = moveInfo.extraTurn
        ? minimax(newBoard, aiPlayer, currentPlayer, depth - 1, alpha, beta, true)
        : minimax(newBoard, aiPlayer, currentPlayer === 1 ? 2 : 1, depth - 1, alpha, beta, false)

      maxValue = Math.max(maxValue, value)
      alpha = Math.max(alpha, value)

      if (beta <= alpha) break // Beta cutoff
    }

    return maxValue
  } else {
    let minValue = Infinity

    for (const move of validMoves) {
      const { board: newBoard, move: moveInfo } = executeMove(board, move, currentPlayer)

      const value = moveInfo.extraTurn
        ? minimax(newBoard, aiPlayer, currentPlayer, depth - 1, alpha, beta, false)
        : minimax(newBoard, aiPlayer, currentPlayer === 1 ? 2 : 1, depth - 1, alpha, beta, true)

      minValue = Math.min(minValue, value)
      beta = Math.min(beta, value)

      if (beta <= alpha) break // Alpha cutoff
    }

    return minValue
  }
}

/**
 * Evaluates board position for AI
 */
function evaluateBoard(board: Board, aiPlayer: Player): number {
  // Base score: difference in stores
  const baseScore = calculateScore(board, aiPlayer)

  // Bonus for stones in pits (mobility)
  const aiPitStones = (aiPlayer === 1 ? [0, 1, 2, 3, 4, 5] : [7, 8, 9, 10, 11, 12]).reduce(
    (sum, pit) => sum + board.pits[pit],
    0
  )

  const opponentPitStones = (aiPlayer === 1 ? [7, 8, 9, 10, 11, 12] : [0, 1, 2, 3, 4, 5]).reduce(
    (sum, pit) => sum + board.pits[pit],
    0
  )

  const mobilityScore = (aiPitStones - opponentPitStones) * AI_CONSTANTS.MOBILITY_WEIGHT

  return baseScore + mobilityScore
}
