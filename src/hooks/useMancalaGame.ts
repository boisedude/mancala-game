// Custom hook for Mancala game state management

import { useState, useCallback, useEffect, useRef } from 'react'
import type { GameState, Player, GameMode, Difficulty, Move, Board } from '@/types/mancala.types'
import {
  createInitialBoard,
  executeMoveAnimated,
  isValidMove,
  isGameOver,
  finalizeGame,
  getValidMoves,
} from '@/lib/mancalaRules'
import { selectAIMove } from '@/lib/aiStrategies'

// AI thinking time constants (in milliseconds)
const AI_THINKING_TIME = {
  EASY_BASE: 400,
  EASY_VARIANCE: 200,
  MEDIUM_BASE: 700,
  MEDIUM_VARIANCE: 300,
  HARD_BASE: 1200,
  HARD_VARIANCE: 400,
} as const

export function useMancalaGame(animationDelayMs: number = 150) {
  const [gameState, setGameState] = useState<GameState>({
    board: createInitialBoard(),
    currentPlayer: 1,
    status: 'setup',
    winner: null,
    mode: 'vsAI',
    difficulty: 'medium',
    moveHistory: [],
    lastMove: null,
    undoState: null,
  })

  const [isAIThinking, setIsAIThinking] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  // Track all animation timeouts for proper cleanup
  const animationTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const aiMoveScheduledRef = useRef(false)

  /**
   * Start a new game
   */
  const startGame = useCallback((mode: GameMode = 'vsAI', difficulty: Difficulty = 'medium') => {
    setGameState({
      board: createInitialBoard(),
      currentPlayer: 1,
      status: 'playing',
      winner: null,
      mode,
      difficulty,
      moveHistory: [],
      lastMove: null,
      undoState: null,
    })
  }, [])

  /**
   * Cancel any active animations
   */
  const cancelAnimations = useCallback(() => {
    animationTimeoutsRef.current.forEach(clearTimeout)
    animationTimeoutsRef.current = []
    setIsAnimating(false)
  }, [])

  /**
   * Animate through board state steps
   */
  const animateMove = useCallback(
    (
      steps: Board[],
      finalMove: Move,
      savedUndoState: { board: Board; currentPlayer: Player; lastMove: Move | null } | null
    ) => {
      if (steps.length === 0) return

      // Cancel any existing animations to prevent race conditions
      cancelAnimations()

      // If animation is off (0ms), apply final state immediately
      if (animationDelayMs === 0) {
        const finalBoard = steps[steps.length - 1]

        setGameState(prev => {
          // Check if game is over
          if (isGameOver(finalBoard)) {
            const { board: gameOverBoard, winner } = finalizeGame(finalBoard)
            return {
              ...prev,
              board: gameOverBoard,
              status: 'finished',
              winner,
              moveHistory: [...prev.moveHistory, finalMove],
              lastMove: finalMove,
              undoState: null,
            }
          }

          // Determine next player
          const nextPlayer: Player = finalMove.extraTurn
            ? prev.currentPlayer
            : prev.currentPlayer === 1
              ? 2
              : 1

          return {
            ...prev,
            board: finalBoard,
            currentPlayer: nextPlayer,
            moveHistory: [...prev.moveHistory, finalMove],
            lastMove: finalMove,
            undoState: savedUndoState,
          }
        })
        return
      }

      setIsAnimating(true)
      const stepRef = { current: 0 } // Use ref to avoid stale closure

      const animateNextStep = () => {
        if (stepRef.current < steps.length) {
          // Update board with current step
          setGameState(prev => ({
            ...prev,
            board: steps[stepRef.current],
          }))

          stepRef.current++
          const timeout = setTimeout(animateNextStep, animationDelayMs)
          animationTimeoutsRef.current.push(timeout)
        } else {
          // Animation complete - finalize the move
          try {
            setGameState(prev => {
              const finalBoard = steps[steps.length - 1]

              // Check if game is over
              if (isGameOver(finalBoard)) {
                const { board: gameOverBoard, winner } = finalizeGame(finalBoard)
                setIsAnimating(false)
                animationTimeoutsRef.current = []
                return {
                  ...prev,
                  board: gameOverBoard,
                  status: 'finished',
                  winner,
                  moveHistory: [...prev.moveHistory, finalMove],
                  lastMove: finalMove,
                  undoState: null, // Clear undo on game over
                }
              }

              // Determine next player (extra turn if last stone in own store)
              const nextPlayer: Player = finalMove.extraTurn
                ? prev.currentPlayer
                : prev.currentPlayer === 1
                  ? 2
                  : 1

              setIsAnimating(false)
              animationTimeoutsRef.current = []
              return {
                ...prev,
                board: finalBoard,
                currentPlayer: nextPlayer,
                moveHistory: [...prev.moveHistory, finalMove],
                lastMove: finalMove,
                undoState: savedUndoState,
              }
            })
          } catch {
            // Animation cleanup on error - reset state
            setIsAnimating(false)
            animationTimeoutsRef.current = []
          }
        }
      }

      animateNextStep()
    },
    [cancelAnimations, animationDelayMs]
  )

  /**
   * Make a move with animation
   */
  const makeMove = useCallback(
    (pitIndex: number) => {
      // Don't allow moves during animation
      if (isAnimating) return

      setGameState(prev => {
        // Validate move
        if (prev.status !== 'playing') return prev
        if (!isValidMove(prev.board, pitIndex, prev.currentPlayer)) return prev

        // Save undo state for player 1 moves only
        const newUndoState =
          prev.currentPlayer === 1
            ? {
                board: prev.board,
                currentPlayer: prev.currentPlayer,
                lastMove: prev.lastMove,
              }
            : null

        // Execute move with animation
        const { steps, finalMove } = executeMoveAnimated(prev.board, pitIndex, prev.currentPlayer)

        // Start animation
        animateMove(steps, finalMove, newUndoState)

        return prev
      })
    },
    [isAnimating, animateMove]
  )

  /**
   * Undo the last player move
   */
  const undoMove = useCallback(() => {
    setGameState(prev => {
      if (!prev.undoState) return prev
      if (prev.status !== 'playing') return prev
      if (prev.currentPlayer !== 2) return prev // Can only undo when it's AI's turn (after player moved)

      return {
        ...prev,
        board: prev.undoState.board,
        currentPlayer: prev.undoState.currentPlayer,
        lastMove: prev.undoState.lastMove,
        undoState: null, // Clear undo state after using it
      }
    })
  }, [])

  /**
   * AI makes a move (triggered by useEffect) with animation
   */
  const makeAIMove = useCallback(() => {
    // Don't allow AI moves during animation
    if (isAnimating) return

    setGameState(prev => {
      if (prev.status !== 'playing') return prev
      if (prev.mode !== 'vsAI') return prev
      if (prev.currentPlayer !== 2) return prev // AI is player 2

      const validMoves = getValidMoves(prev.board, 2)
      if (validMoves.length === 0) return prev

      // Select AI move
      const aiMove = selectAIMove(prev.board, 2, prev.difficulty)

      // Execute move with animation
      const { steps, finalMove } = executeMoveAnimated(prev.board, aiMove, 2)

      // Start animation
      animateMove(steps, finalMove, null)

      return prev
    })
  }, [isAnimating, animateMove])

  /**
   * Trigger AI move after a delay
   */
  useEffect(() => {
    if (
      gameState.status === 'playing' &&
      gameState.mode === 'vsAI' &&
      gameState.currentPlayer === 2 &&
      !isAnimating &&
      !aiMoveScheduledRef.current // Prevent duplicate scheduling
    ) {
      aiMoveScheduledRef.current = true
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAIThinking(true)

      // Variable thinking time based on difficulty
      const thinkingTime = {
        easy: AI_THINKING_TIME.EASY_BASE + Math.random() * AI_THINKING_TIME.EASY_VARIANCE,
        medium: AI_THINKING_TIME.MEDIUM_BASE + Math.random() * AI_THINKING_TIME.MEDIUM_VARIANCE,
        hard: AI_THINKING_TIME.HARD_BASE + Math.random() * AI_THINKING_TIME.HARD_VARIANCE,
      }[gameState.difficulty]

      const timeout = setTimeout(() => {
        makeAIMove()
        setIsAIThinking(false)
        aiMoveScheduledRef.current = false
      }, thinkingTime)

      return () => {
        clearTimeout(timeout)
        setIsAIThinking(false)
        aiMoveScheduledRef.current = false
      }
    } else {
      // Ensure thinking state is false when not AI's turn
      setIsAIThinking(false)
      aiMoveScheduledRef.current = false
    }
  }, [
    gameState.status,
    gameState.mode,
    gameState.currentPlayer,
    gameState.difficulty,
    isAnimating,
    makeAIMove,
  ])

  /**
   * Cleanup animation timeouts on unmount
   */
  useEffect(() => {
    return () => {
      animationTimeoutsRef.current.forEach(clearTimeout)
      animationTimeoutsRef.current = []
    }
  }, [])

  /**
   * Reset game
   */
  const resetGame = useCallback(() => {
    // Cancel any active animations before resetting
    cancelAnimations()
    startGame(gameState.mode, gameState.difficulty)
  }, [gameState.mode, gameState.difficulty, startGame, cancelAnimations])

  /**
   * Change difficulty
   */
  const setDifficulty = useCallback((difficulty: Difficulty) => {
    setGameState(prev => ({ ...prev, difficulty }))
  }, [])

  /**
   * Change game mode
   */
  const setMode = useCallback((mode: GameMode) => {
    setGameState(prev => ({ ...prev, mode }))
  }, [])

  /**
   * Get valid moves for current player
   */
  const getValidMovesForCurrentPlayer = useCallback(() => {
    return getValidMoves(gameState.board, gameState.currentPlayer)
  }, [gameState.board, gameState.currentPlayer])

  /**
   * Restore a saved game state
   */
  const restoreGameState = useCallback((savedState: GameState) => {
    setGameState(savedState)
  }, [])

  return {
    gameState,
    isAIThinking,
    isAnimating,
    startGame,
    makeMove,
    undoMove,
    resetGame,
    setDifficulty,
    setMode,
    getValidMovesForCurrentPlayer,
    restoreGameState,
  }
}
