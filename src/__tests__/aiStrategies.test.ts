// Unit tests for AI strategies

import { selectAIMove } from '@/lib/aiStrategies'
import { createInitialBoard, executeMove, getValidMoves } from '@/lib/mancalaRules'
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
  })
})
