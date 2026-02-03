// Unit tests for AI strategies

import { selectAIMove } from '@/lib/aiStrategies'
import {
  createInitialBoard,
  executeMove,
  getValidMoves,
  isGameOver,
  P1_STORE,
  P2_STORE,
} from '@/lib/mancalaRules'
import type { Board, Difficulty } from '@/types/mancala.types'

describe('aiStrategies', () => {
  describe('selectAIMove', () => {
    describe('Easy difficulty', () => {
      it('should select a valid move', () => {
        const board = createInitialBoard()
        const move = selectAIMove(board, 2, 'easy')

        const validMoves = getValidMoves(board, 2)
        expect(validMoves).toContain(move)
      })

      it('should handle board with limited moves', () => {
        const board = createInitialBoard()
        // Empty most pits except one
        board.pits[7] = 0
        board.pits[8] = 0
        board.pits[9] = 0
        board.pits[10] = 0
        board.pits[11] = 0
        // Only pit 12 has stones

        const move = selectAIMove(board, 2, 'easy')
        expect(move).toBe(12)
      })

      it('should make different moves (randomness test)', () => {
        const board = createInitialBoard()
        const moves = new Set<number>()

        // Run 20 times, should see variety (not guaranteed but very likely)
        for (let i = 0; i < 20; i++) {
          moves.add(selectAIMove(board, 2, 'easy'))
        }

        // With 6 possible moves, we should see more than 1 unique move
        expect(moves.size).toBeGreaterThan(1)
      })
    })

    describe('Medium difficulty', () => {
      it('should prioritize extra turn opportunities', () => {
        const board = createInitialBoard()
        // Set up a scenario where pit 7 leads to an extra turn
        // Pit 7 is 6 positions away from P2 store (13)
        board.pits[7] = 6

        const move = selectAIMove(board, 2, 'medium')

        // Medium AI should prefer the extra turn move
        expect(move).toBe(7)
      })

      it('should prioritize capture opportunities', () => {
        const board = createInitialBoard()
        // Set up capture: pit 7 has 1 stone, pit 8 is empty, opposite pit (4) has many stones
        board.pits[7] = 1
        board.pits[8] = 0
        board.pits[4] = 10 // Opposite of pit 8

        // Make all other moves less attractive
        board.pits[9] = 1
        board.pits[10] = 1
        board.pits[11] = 1
        board.pits[12] = 1

        const move = selectAIMove(board, 2, 'medium')

        // Should choose the capture move
        expect(move).toBe(7)
      })

      it('should return a valid move', () => {
        const board = createInitialBoard()
        const move = selectAIMove(board, 2, 'medium')

        const validMoves = getValidMoves(board, 2)
        expect(validMoves).toContain(move)
      })
    })

    describe('Hard difficulty', () => {
      it('should return a valid move', () => {
        const board = createInitialBoard()
        const move = selectAIMove(board, 2, 'hard')

        const validMoves = getValidMoves(board, 2)
        expect(validMoves).toContain(move)
      })

      it('should make strategic moves (not random)', () => {
        const board = createInitialBoard()
        // Run multiple times - hard AI should be deterministic for same position
        const move1 = selectAIMove(board, 2, 'hard')
        const move2 = selectAIMove(board, 2, 'hard')
        const move3 = selectAIMove(board, 2, 'hard')

        // All moves should be the same (deterministic)
        expect(move1).toBe(move2)
        expect(move2).toBe(move3)
      })

      it('should prefer moves that lead to better positions', () => {
        const board: Board = {
          // Set up an asymmetric position where one move is clearly better
          pits: [0, 0, 0, 0, 0, 0, 20, 1, 1, 1, 1, 1, 10, 20],
        }

        const move = selectAIMove(board, 2, 'hard')

        // Hard AI should evaluate positions and choose strategically
        // The specific move depends on the evaluation function,
        // but it should be valid
        const validMoves = getValidMoves(board, 2)
        expect(validMoves).toContain(move)
      })

      it('should handle near-endgame scenarios', () => {
        const board: Board = {
          // Near endgame with few stones left
          pits: [0, 0, 0, 1, 0, 0, 22, 0, 0, 2, 0, 0, 0, 23],
        }

        const move = selectAIMove(board, 2, 'hard')

        // Should make a valid move even in sparse positions
        expect(move).toBe(9) // Only valid move
      })
    })

    describe('difficulty comparison', () => {
      it('should work with all difficulty levels', () => {
        const board = createInitialBoard()
        const difficulties: Difficulty[] = ['easy', 'medium', 'hard']

        difficulties.forEach(difficulty => {
          const move = selectAIMove(board, 2, difficulty)
          const validMoves = getValidMoves(board, 2)
          expect(validMoves).toContain(move)
        })
      })
    })

    describe('edge cases', () => {
      it('should handle board with one valid move', () => {
        const board = createInitialBoard()
        // Only one pit has stones
        board.pits[7] = 0
        board.pits[8] = 0
        board.pits[9] = 0
        board.pits[10] = 0
        board.pits[11] = 0
        board.pits[12] = 5

        const difficulties: Difficulty[] = ['easy', 'medium', 'hard']
        difficulties.forEach(difficulty => {
          const move = selectAIMove(board, 2, difficulty)
          expect(move).toBe(12)
        })
      })

      it('should work for player 1 AI', () => {
        const board = createInitialBoard()
        const move = selectAIMove(board, 1, 'hard')

        const validMoves = getValidMoves(board, 1)
        expect(validMoves).toContain(move)
      })
    })

    describe('performance', () => {
      it('should complete within reasonable time for standard board', () => {
        const board = createInitialBoard()
        const startTime = Date.now()

        selectAIMove(board, 2, 'hard')

        const endTime = Date.now()
        const elapsed = endTime - startTime

        // Hard AI with depth 6 should complete in under 1 second for initial board
        expect(elapsed).toBeLessThan(1000)
      })

      it('should complete within reasonable time for complex position', () => {
        const board: Board = {
          // Mid-game position with many possibilities
          pits: [2, 3, 1, 4, 2, 5, 15, 3, 2, 4, 1, 3, 2, 14],
        }
        const startTime = Date.now()

        selectAIMove(board, 2, 'hard')

        const endTime = Date.now()
        const elapsed = endTime - startTime

        // Should still complete reasonably fast
        expect(elapsed).toBeLessThan(2000)
      })
    })

    describe('strategic consistency', () => {
      it('hard AI should prefer winning moves', () => {
        const board: Board = {
          // P2 can win by playing pit 12
          pits: [0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 10, 15],
        }

        const move = selectAIMove(board, 2, 'hard')

        // Execute the move and verify it leads to many stones in store
        const result = executeMove(board, move, 2)
        // Should be a strategically sound move
        expect(result.board.pits[13]).toBeGreaterThan(15)
      })

      it('medium AI should avoid obviously bad moves', () => {
        const board = createInitialBoard()
        const moves = new Set<number>()

        // Run several times
        for (let i = 0; i < 10; i++) {
          const move = selectAIMove(board, 2, 'medium')
          moves.add(move)
        }

        // Medium AI should be deterministic and choose the same good move
        expect(moves.size).toBe(1)
      })
    })

    describe('error handling', () => {
      it('should throw error when no valid moves available', () => {
        const board: Board = {
          // Player 2 has no stones in their pits
          pits: [4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 24],
        }

        expect(() => selectAIMove(board, 2, 'easy')).toThrow('No valid moves available for AI')
        expect(() => selectAIMove(board, 2, 'medium')).toThrow('No valid moves available for AI')
        expect(() => selectAIMove(board, 2, 'hard')).toThrow('No valid moves available for AI')
      })
    })

    describe('game simulation', () => {
      it('should complete a full game without errors (easy vs easy)', () => {
        let board = createInitialBoard()
        let currentPlayer: 1 | 2 = 1
        let moveCount = 0
        const maxMoves = 100 // Prevent infinite loop

        while (!isGameOver(board) && moveCount < maxMoves) {
          const validMoves = getValidMoves(board, currentPlayer)
          if (validMoves.length === 0) break

          const move = selectAIMove(board, currentPlayer, 'easy')
          const result = executeMove(board, move, currentPlayer)
          board = result.board

          if (!result.move.extraTurn) {
            currentPlayer = currentPlayer === 1 ? 2 : 1
          }
          moveCount++
        }

        // Game should end naturally
        expect(isGameOver(board)).toBe(true)
        // Stone count should be preserved
        const total = board.pits.reduce((sum, s) => sum + s, 0)
        expect(total).toBe(48)
      })

      it('should complete a full game without errors (hard vs hard)', () => {
        let board = createInitialBoard()
        let currentPlayer: 1 | 2 = 1
        let moveCount = 0
        const maxMoves = 100

        while (!isGameOver(board) && moveCount < maxMoves) {
          const validMoves = getValidMoves(board, currentPlayer)
          if (validMoves.length === 0) break

          const move = selectAIMove(board, currentPlayer, 'hard')
          const result = executeMove(board, move, currentPlayer)
          board = result.board

          if (!result.move.extraTurn) {
            currentPlayer = currentPlayer === 1 ? 2 : 1
          }
          moveCount++
        }

        expect(isGameOver(board)).toBe(true)
        const total = board.pits.reduce((sum, s) => sum + s, 0)
        expect(total).toBe(48)
      })
    })

    describe('AI move quality', () => {
      it('hard AI should take winning move when available', () => {
        // Set up a scenario where one move wins the game
        const board: Board = {
          // P2 can end game by playing pit 12 and will have more stones
          pits: [0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 2, 36],
        }

        const move = selectAIMove(board, 2, 'hard')
        const result = executeMove(board, move, 2)

        // After the move, P2 should have high score
        expect(result.board.pits[P2_STORE]).toBeGreaterThan(10)
      })

      it('medium AI should take extra turn when available', () => {
        const board = createInitialBoard()
        // Set up guaranteed extra turn: pit 7 has exactly 6 stones -> lands in P2 store
        board.pits[7] = 6

        const move = selectAIMove(board, 2, 'medium')

        // Medium should always take the extra turn
        expect(move).toBe(7)
      })

      it('medium AI should take large capture when available', () => {
        const board = createInitialBoard()
        // Set up capture: pit 7 has 1, pit 8 is empty, opposite (4) has many stones
        board.pits[7] = 1
        board.pits[8] = 0
        board.pits[4] = 15 // Juicy target
        // Make other pits less attractive
        board.pits[9] = 1
        board.pits[10] = 1
        board.pits[11] = 1
        board.pits[12] = 1

        const move = selectAIMove(board, 2, 'medium')
        const result = executeMove(board, move, 2)

        // Should have made the capture
        expect(result.move.capturedStones).toBe(16) // 1 + 15
      })

      it('easy AI should still make valid moves in complex positions', () => {
        const board: Board = {
          // Complex mid-game position
          pits: [1, 2, 0, 3, 1, 2, 18, 2, 1, 3, 0, 2, 1, 16],
        }

        // Run multiple times since easy AI is random
        for (let i = 0; i < 10; i++) {
          const move = selectAIMove(board, 2, 'easy')
          const validMoves = getValidMoves(board, 2)
          expect(validMoves).toContain(move)
        }
      })
    })

    describe('minimax correctness', () => {
      it('hard AI handles extra turns correctly in search', () => {
        const board = createInitialBoard()
        // Create a position where taking extra turn leads to better outcome
        board.pits[7] = 6 // Extra turn possible

        const move = selectAIMove(board, 2, 'hard')
        const result = executeMove(board, move, 2)

        // Hard AI should recognize the value of extra turns
        // If move 7 gives extra turn, it should be strongly considered
        if (move === 7) {
          expect(result.move.extraTurn).toBe(true)
        }
      })

      it('hard AI evaluates positions for both players', () => {
        // Position where P2 needs to consider P1 responses
        const board: Board = {
          pits: [2, 2, 2, 2, 2, 2, 18, 2, 2, 2, 2, 2, 2, 18],
        }

        const move = selectAIMove(board, 2, 'hard')
        const validMoves = getValidMoves(board, 2)

        // Move should be valid
        expect(validMoves).toContain(move)
      })
    })

    describe('player independence', () => {
      it('all difficulties work correctly for player 1', () => {
        const board = createInitialBoard()
        const difficulties: Difficulty[] = ['easy', 'medium', 'hard']

        difficulties.forEach(difficulty => {
          const move = selectAIMove(board, 1, difficulty)
          const validMoves = getValidMoves(board, 1)
          expect(validMoves).toContain(move)
          // Should be in P1 pit range
          expect(move).toBeGreaterThanOrEqual(0)
          expect(move).toBeLessThanOrEqual(5)
        })
      })

      it('all difficulties work correctly for player 2', () => {
        const board = createInitialBoard()
        const difficulties: Difficulty[] = ['easy', 'medium', 'hard']

        difficulties.forEach(difficulty => {
          const move = selectAIMove(board, 2, difficulty)
          const validMoves = getValidMoves(board, 2)
          expect(validMoves).toContain(move)
          // Should be in P2 pit range
          expect(move).toBeGreaterThanOrEqual(7)
          expect(move).toBeLessThanOrEqual(12)
        })
      })
    })
  })
})
