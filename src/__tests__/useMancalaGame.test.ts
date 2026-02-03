// Unit tests for useMancalaGame hook

import { renderHook, act } from '@testing-library/react'
import { useMancalaGame } from '@/hooks/useMancalaGame'
import { P1_STORE, P2_STORE, P1_PITS, P2_PITS } from '@/lib/mancalaRules'

describe('useMancalaGame', () => {
  describe('initial state', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() => useMancalaGame())

      expect(result.current.gameState.status).toBe('setup')
      expect(result.current.gameState.currentPlayer).toBe(1)
      expect(result.current.gameState.winner).toBeNull()
      expect(result.current.gameState.mode).toBe('vsAI')
      expect(result.current.gameState.difficulty).toBe('medium')
      expect(result.current.gameState.moveHistory).toEqual([])
      expect(result.current.gameState.lastMove).toBeNull()
      expect(result.current.gameState.undoState).toBeNull()
    })

    it('should initialize board correctly', () => {
      const { result } = renderHook(() => useMancalaGame())

      const board = result.current.gameState.board
      expect(board.pits.length).toBe(14)

      // P1 pits should have 4 stones each
      P1_PITS.forEach(pit => {
        expect(board.pits[pit]).toBe(4)
      })

      // P2 pits should have 4 stones each
      P2_PITS.forEach(pit => {
        expect(board.pits[pit]).toBe(4)
      })

      // Stores should be empty
      expect(board.pits[P1_STORE]).toBe(0)
      expect(board.pits[P2_STORE]).toBe(0)
    })

    it('should not be animating or AI thinking initially', () => {
      const { result } = renderHook(() => useMancalaGame())

      expect(result.current.isAnimating).toBe(false)
      expect(result.current.isAIThinking).toBe(false)
    })

    it('should have total of 48 stones in initial board', () => {
      const { result } = renderHook(() => useMancalaGame())
      const total = result.current.gameState.board.pits.reduce((sum, s) => sum + s, 0)
      expect(total).toBe(48)
    })
  })

  describe('startGame', () => {
    it('should start game with default settings', () => {
      const { result } = renderHook(() => useMancalaGame())

      act(() => {
        result.current.startGame()
      })

      expect(result.current.gameState.status).toBe('playing')
      expect(result.current.gameState.mode).toBe('vsAI')
      expect(result.current.gameState.difficulty).toBe('medium')
      expect(result.current.gameState.currentPlayer).toBe(1)
    })

    it('should start game with custom mode', () => {
      const { result } = renderHook(() => useMancalaGame())

      act(() => {
        result.current.startGame('vsHuman')
      })

      expect(result.current.gameState.status).toBe('playing')
      expect(result.current.gameState.mode).toBe('vsHuman')
    })

    it('should start game with custom difficulty', () => {
      const { result } = renderHook(() => useMancalaGame())

      act(() => {
        result.current.startGame('vsAI', 'hard')
      })

      expect(result.current.gameState.status).toBe('playing')
      expect(result.current.gameState.difficulty).toBe('hard')
    })

    it('should start game with easy difficulty', () => {
      const { result } = renderHook(() => useMancalaGame())

      act(() => {
        result.current.startGame('vsAI', 'easy')
      })

      expect(result.current.gameState.difficulty).toBe('easy')
    })

    it('should reset move history when starting new game', () => {
      const { result } = renderHook(() => useMancalaGame())

      act(() => {
        result.current.startGame()
      })

      expect(result.current.gameState.moveHistory).toEqual([])
      expect(result.current.gameState.lastMove).toBeNull()
    })

    it('should clear winner when starting new game', () => {
      const { result } = renderHook(() => useMancalaGame())

      act(() => {
        result.current.startGame()
      })

      expect(result.current.gameState.winner).toBeNull()
    })

    it('should set currentPlayer to 1 when starting new game', () => {
      const { result } = renderHook(() => useMancalaGame())

      act(() => {
        result.current.startGame()
      })

      expect(result.current.gameState.currentPlayer).toBe(1)
    })

    it('should reset board when starting after restore', () => {
      const { result } = renderHook(() => useMancalaGame())

      // Restore a modified state
      act(() => {
        result.current.restoreGameState({
          board: { pits: [0, 8, 8, 0, 0, 0, 10, 4, 4, 4, 4, 4, 4, 6] },
          currentPlayer: 2,
          status: 'playing',
          winner: null,
          mode: 'vsAI',
          difficulty: 'easy',
          moveHistory: [],
          lastMove: null,
          undoState: null,
        })
      })

      // Start a new game
      act(() => {
        result.current.startGame('vsHuman', 'hard')
      })

      // Board should be reset
      expect(result.current.gameState.board.pits[0]).toBe(4)
      expect(result.current.gameState.currentPlayer).toBe(1)
    })
  })

  describe('makeMove - validation', () => {
    it('should not allow moves when game is not playing', () => {
      const { result } = renderHook(() => useMancalaGame(0))

      // Game is in setup state
      const boardBefore = [...result.current.gameState.board.pits]

      act(() => {
        result.current.makeMove(0)
      })

      // Board should be unchanged
      expect(result.current.gameState.board.pits).toEqual(boardBefore)
    })

    it('should not allow player 1 to play player 2 pits', () => {
      const { result } = renderHook(() => useMancalaGame(0))

      act(() => {
        result.current.startGame('vsHuman')
      })

      const boardBefore = [...result.current.gameState.board.pits]

      act(() => {
        result.current.makeMove(7) // P2 pit
      })

      // Board should be unchanged (invalid move rejected immediately)
      expect(result.current.gameState.board.pits).toEqual(boardBefore)
    })

    it('should not allow moves from stores', () => {
      const { result } = renderHook(() => useMancalaGame(0))

      act(() => {
        result.current.startGame('vsHuman')
      })

      const boardBefore = [...result.current.gameState.board.pits]

      act(() => {
        result.current.makeMove(P1_STORE) // Store, not a valid pit
      })

      expect(result.current.gameState.board.pits).toEqual(boardBefore)
    })

    it('should not allow player 2 to play player 1 pits', () => {
      const { result } = renderHook(() => useMancalaGame(0))

      act(() => {
        result.current.startGame('vsHuman')
      })

      // Force player 2's turn via restoreGameState
      act(() => {
        result.current.restoreGameState({
          ...result.current.gameState,
          currentPlayer: 2,
        })
      })

      const boardBefore = [...result.current.gameState.board.pits]

      act(() => {
        result.current.makeMove(0) // P1 pit
      })

      expect(result.current.gameState.board.pits).toEqual(boardBefore)
    })

    it('should not allow moves from empty pits', () => {
      const { result } = renderHook(() => useMancalaGame(0))

      act(() => {
        result.current.startGame('vsHuman')
      })

      // Set up board with empty pit 0
      act(() => {
        result.current.restoreGameState({
          ...result.current.gameState,
          board: {
            pits: [0, 8, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0],
          },
        })
      })

      const boardBefore = [...result.current.gameState.board.pits]

      act(() => {
        result.current.makeMove(0) // Empty pit
      })

      expect(result.current.gameState.board.pits).toEqual(boardBefore)
    })
  })

  describe('getValidMovesForCurrentPlayer', () => {
    it('should return all valid moves for player 1 at game start', () => {
      const { result } = renderHook(() => useMancalaGame())

      act(() => {
        result.current.startGame('vsHuman')
      })

      const validMoves = result.current.getValidMovesForCurrentPlayer()

      expect(validMoves).toEqual([0, 1, 2, 3, 4, 5])
    })

    it('should return all valid moves for player 2', () => {
      const { result } = renderHook(() => useMancalaGame(0))

      act(() => {
        result.current.startGame('vsHuman')
      })

      // Force player 2's turn
      act(() => {
        result.current.restoreGameState({
          ...result.current.gameState,
          currentPlayer: 2,
        })
      })

      const validMoves = result.current.getValidMovesForCurrentPlayer()

      expect(validMoves).toEqual([7, 8, 9, 10, 11, 12])
    })

    it('should exclude empty pits', () => {
      const { result } = renderHook(() => useMancalaGame(0))

      act(() => {
        result.current.startGame('vsHuman')
      })

      // Set up board with empty pit 0
      act(() => {
        result.current.restoreGameState({
          ...result.current.gameState,
          currentPlayer: 1,
          board: {
            pits: [0, 5, 5, 5, 5, 4, 0, 4, 4, 4, 4, 4, 4, 0],
          },
        })
      })

      const validMoves = result.current.getValidMovesForCurrentPlayer()

      expect(validMoves).not.toContain(0)
      expect(validMoves).toEqual([1, 2, 3, 4, 5])
    })

    it('should return empty array when no valid moves for player', () => {
      const { result } = renderHook(() => useMancalaGame())

      act(() => {
        result.current.startGame('vsHuman')
      })

      // Set up board with no stones on P1 side
      act(() => {
        result.current.restoreGameState({
          ...result.current.gameState,
          currentPlayer: 1,
          board: {
            pits: [0, 0, 0, 0, 0, 0, 24, 4, 4, 4, 4, 4, 4, 0],
          },
        })
      })

      const validMoves = result.current.getValidMovesForCurrentPlayer()

      expect(validMoves).toEqual([])
    })
  })

  describe('setDifficulty', () => {
    it('should update difficulty to easy', () => {
      const { result } = renderHook(() => useMancalaGame())

      act(() => {
        result.current.setDifficulty('easy')
      })

      expect(result.current.gameState.difficulty).toBe('easy')
    })

    it('should update difficulty to medium', () => {
      const { result } = renderHook(() => useMancalaGame())

      act(() => {
        result.current.setDifficulty('medium')
      })

      expect(result.current.gameState.difficulty).toBe('medium')
    })

    it('should update difficulty to hard', () => {
      const { result } = renderHook(() => useMancalaGame())

      act(() => {
        result.current.setDifficulty('hard')
      })

      expect(result.current.gameState.difficulty).toBe('hard')
    })
  })

  describe('setMode', () => {
    it('should update game mode to vsHuman', () => {
      const { result } = renderHook(() => useMancalaGame())

      act(() => {
        result.current.setMode('vsHuman')
      })

      expect(result.current.gameState.mode).toBe('vsHuman')
    })

    it('should update game mode to vsAI', () => {
      const { result } = renderHook(() => useMancalaGame())

      act(() => {
        result.current.setMode('vsAI')
      })

      expect(result.current.gameState.mode).toBe('vsAI')
    })

    it('should update game mode to tutorial', () => {
      const { result } = renderHook(() => useMancalaGame())

      act(() => {
        result.current.setMode('tutorial')
      })

      expect(result.current.gameState.mode).toBe('tutorial')
    })
  })

  describe('resetGame', () => {
    it('should reset to playing status', () => {
      const { result } = renderHook(() => useMancalaGame())

      act(() => {
        result.current.startGame('vsHuman', 'hard')
      })

      act(() => {
        result.current.resetGame()
      })

      expect(result.current.gameState.status).toBe('playing')
    })

    it('should preserve mode setting', () => {
      const { result } = renderHook(() => useMancalaGame())

      act(() => {
        result.current.startGame('vsHuman', 'hard')
      })

      act(() => {
        result.current.resetGame()
      })

      expect(result.current.gameState.mode).toBe('vsHuman')
    })

    it('should preserve difficulty setting', () => {
      const { result } = renderHook(() => useMancalaGame())

      act(() => {
        result.current.startGame('vsAI', 'hard')
      })

      act(() => {
        result.current.resetGame()
      })

      expect(result.current.gameState.difficulty).toBe('hard')
    })

    it('should reset board to initial state', () => {
      const { result } = renderHook(() => useMancalaGame())

      act(() => {
        result.current.startGame('vsHuman')
      })

      // Modify board via restore
      act(() => {
        result.current.restoreGameState({
          ...result.current.gameState,
          board: {
            pits: [0, 8, 8, 8, 0, 0, 10, 0, 0, 0, 4, 4, 4, 6],
          },
        })
      })

      act(() => {
        result.current.resetGame()
      })

      // All P1 pits should have 4 stones
      P1_PITS.forEach(pit => {
        expect(result.current.gameState.board.pits[pit]).toBe(4)
      })

      // All P2 pits should have 4 stones
      P2_PITS.forEach(pit => {
        expect(result.current.gameState.board.pits[pit]).toBe(4)
      })

      // Stores should be empty
      expect(result.current.gameState.board.pits[P1_STORE]).toBe(0)
      expect(result.current.gameState.board.pits[P2_STORE]).toBe(0)
    })

    it('should clear move history', () => {
      const { result } = renderHook(() => useMancalaGame())

      act(() => {
        result.current.startGame('vsHuman')
      })

      act(() => {
        result.current.resetGame()
      })

      expect(result.current.gameState.moveHistory).toEqual([])
    })

    it('should reset current player to 1', () => {
      const { result } = renderHook(() => useMancalaGame())

      act(() => {
        result.current.startGame('vsHuman')
      })

      // Force player 2's turn
      act(() => {
        result.current.restoreGameState({
          ...result.current.gameState,
          currentPlayer: 2,
        })
      })

      act(() => {
        result.current.resetGame()
      })

      expect(result.current.gameState.currentPlayer).toBe(1)
    })
  })

  describe('undoMove', () => {
    it('should not undo if no undo state available', () => {
      const { result } = renderHook(() => useMancalaGame(0))

      act(() => {
        result.current.startGame('vsHuman')
      })

      const boardBefore = [...result.current.gameState.board.pits]

      act(() => {
        result.current.undoMove()
      })

      expect(result.current.gameState.board.pits).toEqual(boardBefore)
    })

    it('should not undo when game is in setup status', () => {
      const { result } = renderHook(() => useMancalaGame())

      const boardBefore = [...result.current.gameState.board.pits]

      act(() => {
        result.current.undoMove()
      })

      expect(result.current.gameState.board.pits).toEqual(boardBefore)
    })

    it('should not undo when it is player 1 turn', () => {
      const { result } = renderHook(() => useMancalaGame())

      act(() => {
        result.current.startGame('vsHuman')
      })

      // Set up undo state but keep player 1's turn
      act(() => {
        result.current.restoreGameState({
          ...result.current.gameState,
          currentPlayer: 1,
          undoState: {
            board: { pits: [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0] },
            currentPlayer: 1,
            lastMove: null,
          },
        })
      })

      const boardBefore = [...result.current.gameState.board.pits]

      act(() => {
        result.current.undoMove()
      })

      // Should not change since it's P1's turn
      expect(result.current.gameState.board.pits).toEqual(boardBefore)
    })

    it('should undo when it is player 2 turn and undo state exists', () => {
      const { result } = renderHook(() => useMancalaGame())

      act(() => {
        result.current.startGame('vsHuman')
      })

      // Set up: player 2's turn with valid undo state
      const undoBoard = { pits: [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0] }
      act(() => {
        result.current.restoreGameState({
          ...result.current.gameState,
          currentPlayer: 2,
          board: {
            pits: [0, 5, 5, 5, 5, 4, 0, 4, 4, 4, 4, 4, 4, 0],
          },
          undoState: {
            board: undoBoard,
            currentPlayer: 1,
            lastMove: null,
          },
        })
      })

      act(() => {
        result.current.undoMove()
      })

      // Should restore undo state
      expect(result.current.gameState.board.pits).toEqual(undoBoard.pits)
      expect(result.current.gameState.currentPlayer).toBe(1)
      expect(result.current.gameState.undoState).toBeNull()
    })
  })

  describe('restoreGameState', () => {
    it('should restore board state', () => {
      const { result } = renderHook(() => useMancalaGame())

      const customBoard = { pits: [0, 0, 0, 0, 0, 0, 24, 4, 4, 4, 4, 4, 4, 0] }

      act(() => {
        result.current.restoreGameState({
          ...result.current.gameState,
          board: customBoard,
        })
      })

      expect(result.current.gameState.board.pits).toEqual(customBoard.pits)
    })

    it('should restore current player', () => {
      const { result } = renderHook(() => useMancalaGame())

      act(() => {
        result.current.restoreGameState({
          ...result.current.gameState,
          currentPlayer: 2,
        })
      })

      expect(result.current.gameState.currentPlayer).toBe(2)
    })

    it('should restore game status', () => {
      const { result } = renderHook(() => useMancalaGame())

      act(() => {
        result.current.restoreGameState({
          ...result.current.gameState,
          status: 'finished',
          winner: 1,
        })
      })

      expect(result.current.gameState.status).toBe('finished')
      expect(result.current.gameState.winner).toBe(1)
    })

    it('should restore difficulty', () => {
      const { result } = renderHook(() => useMancalaGame())

      act(() => {
        result.current.restoreGameState({
          ...result.current.gameState,
          difficulty: 'hard',
        })
      })

      expect(result.current.gameState.difficulty).toBe('hard')
    })

    it('should restore mode', () => {
      const { result } = renderHook(() => useMancalaGame())

      act(() => {
        result.current.restoreGameState({
          ...result.current.gameState,
          mode: 'vsHuman',
        })
      })

      expect(result.current.gameState.mode).toBe('vsHuman')
    })

    it('should restore move history', () => {
      const { result } = renderHook(() => useMancalaGame())

      const moveHistory = [
        { player: 1 as const, pitIndex: 0, timestamp: Date.now() },
        { player: 2 as const, pitIndex: 7, timestamp: Date.now() },
      ]

      act(() => {
        result.current.restoreGameState({
          ...result.current.gameState,
          moveHistory,
        })
      })

      expect(result.current.gameState.moveHistory).toEqual(moveHistory)
    })

    it('should restore last move', () => {
      const { result } = renderHook(() => useMancalaGame())

      const lastMove = { player: 1 as const, pitIndex: 2, extraTurn: true, timestamp: Date.now() }

      act(() => {
        result.current.restoreGameState({
          ...result.current.gameState,
          lastMove,
        })
      })

      expect(result.current.gameState.lastMove).toEqual(lastMove)
    })
  })

  describe('animation delay parameter', () => {
    it('should accept custom animation delay', () => {
      const { result } = renderHook(() => useMancalaGame(100))

      expect(result.current.gameState).toBeDefined()
    })

    it('should accept zero animation delay', () => {
      const { result } = renderHook(() => useMancalaGame(0))

      expect(result.current.gameState).toBeDefined()
    })

    it('should accept default animation delay', () => {
      const { result } = renderHook(() => useMancalaGame())

      expect(result.current.gameState).toBeDefined()
    })
  })

  describe('hook cleanup', () => {
    it('should not throw on unmount', () => {
      const { unmount } = renderHook(() => useMancalaGame(100))

      expect(() => unmount()).not.toThrow()
    })

    it('should not throw on unmount after starting game', () => {
      const { result, unmount } = renderHook(() => useMancalaGame(100))

      act(() => {
        result.current.startGame('vsHuman')
      })

      expect(() => unmount()).not.toThrow()
    })
  })

  describe('returned interface', () => {
    it('should return all expected functions', () => {
      const { result } = renderHook(() => useMancalaGame())

      expect(typeof result.current.startGame).toBe('function')
      expect(typeof result.current.makeMove).toBe('function')
      expect(typeof result.current.undoMove).toBe('function')
      expect(typeof result.current.resetGame).toBe('function')
      expect(typeof result.current.setDifficulty).toBe('function')
      expect(typeof result.current.setMode).toBe('function')
      expect(typeof result.current.getValidMovesForCurrentPlayer).toBe('function')
      expect(typeof result.current.restoreGameState).toBe('function')
    })

    it('should return isAIThinking state', () => {
      const { result } = renderHook(() => useMancalaGame())

      expect(typeof result.current.isAIThinking).toBe('boolean')
    })

    it('should return isAnimating state', () => {
      const { result } = renderHook(() => useMancalaGame())

      expect(typeof result.current.isAnimating).toBe('boolean')
    })

    it('should return gameState object', () => {
      const { result } = renderHook(() => useMancalaGame())

      expect(result.current.gameState).toBeDefined()
      expect(result.current.gameState.board).toBeDefined()
      expect(result.current.gameState.status).toBeDefined()
      expect(result.current.gameState.currentPlayer).toBeDefined()
    })
  })

  describe('game state consistency', () => {
    it('should maintain valid board size after restore', () => {
      const { result } = renderHook(() => useMancalaGame())

      act(() => {
        result.current.restoreGameState({
          ...result.current.gameState,
          board: { pits: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] },
        })
      })

      expect(result.current.gameState.board.pits.length).toBe(14)
    })

    it('should maintain status integrity', () => {
      const { result } = renderHook(() => useMancalaGame())

      act(() => {
        result.current.startGame('vsHuman')
      })
      expect(result.current.gameState.status).toBe('playing')

      act(() => {
        result.current.restoreGameState({
          ...result.current.gameState,
          status: 'finished',
        })
      })
      expect(result.current.gameState.status).toBe('finished')

      act(() => {
        result.current.startGame()
      })
      expect(result.current.gameState.status).toBe('playing')
    })
  })
})
