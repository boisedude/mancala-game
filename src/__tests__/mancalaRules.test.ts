// Unit tests for Mancala game rules engine

import {
  createInitialBoard,
  executeMove,
  isValidMove,
  isGameOver,
  finalizeGame,
  getValidMoves,
  getPlayerStore,
  getOppositePit,
  isPitOwnedBy,
  P1_PITS,
  P2_PITS,
  P1_STORE,
  P2_STORE,
} from '@/lib/mancalaRules'
import type { Board } from '@/types/mancala.types'

describe('mancalaRules', () => {
  describe('createInitialBoard', () => {
    it('should create a board with 4 stones in each pit', () => {
      const board = createInitialBoard()

      // Check player 1 pits
      P1_PITS.forEach(pit => {
        expect(board.pits[pit]).toBe(4)
      })

      // Check player 2 pits
      P2_PITS.forEach(pit => {
        expect(board.pits[pit]).toBe(4)
      })

      // Check stores are empty
      expect(board.pits[P1_STORE]).toBe(0)
      expect(board.pits[P2_STORE]).toBe(0)
    })

    it('should create a board with exactly 14 pits', () => {
      const board = createInitialBoard()
      expect(board.pits.length).toBe(14)
    })
  })

  describe('getPlayerStore', () => {
    it('should return correct store index for player 1', () => {
      expect(getPlayerStore(1)).toBe(P1_STORE)
      expect(getPlayerStore(1)).toBe(6)
    })

    it('should return correct store index for player 2', () => {
      expect(getPlayerStore(2)).toBe(P2_STORE)
      expect(getPlayerStore(2)).toBe(13)
    })
  })

  describe('getOppositePit', () => {
    it('should return opposite pit correctly', () => {
      expect(getOppositePit(0)).toBe(12)
      expect(getOppositePit(1)).toBe(11)
      expect(getOppositePit(5)).toBe(7)
      expect(getOppositePit(7)).toBe(5)
      expect(getOppositePit(12)).toBe(0)
    })
  })

  describe('isPitOwnedBy', () => {
    it('should correctly identify player 1 pits', () => {
      P1_PITS.forEach(pit => {
        expect(isPitOwnedBy(pit, 1)).toBe(true)
        expect(isPitOwnedBy(pit, 2)).toBe(false)
      })
    })

    it('should correctly identify player 2 pits', () => {
      P2_PITS.forEach(pit => {
        expect(isPitOwnedBy(pit, 2)).toBe(true)
        expect(isPitOwnedBy(pit, 1)).toBe(false)
      })
    })

    it('should return false for stores', () => {
      expect(isPitOwnedBy(P1_STORE, 1)).toBe(false)
      expect(isPitOwnedBy(P1_STORE, 2)).toBe(false)
      expect(isPitOwnedBy(P2_STORE, 1)).toBe(false)
      expect(isPitOwnedBy(P2_STORE, 2)).toBe(false)
    })
  })

  describe('isValidMove', () => {
    it('should allow moves from pits with stones belonging to the player', () => {
      const board = createInitialBoard()

      // Player 1 can play their own pits
      P1_PITS.forEach(pit => {
        expect(isValidMove(board, pit, 1)).toBe(true)
      })

      // Player 2 can play their own pits
      P2_PITS.forEach(pit => {
        expect(isValidMove(board, pit, 2)).toBe(true)
      })
    })

    it('should not allow moves from empty pits', () => {
      const board = createInitialBoard()
      board.pits[0] = 0 // Empty player 1's first pit

      expect(isValidMove(board, 0, 1)).toBe(false)
    })

    it('should not allow moves from opponent pits', () => {
      const board = createInitialBoard()

      // Player 1 cannot play player 2 pits
      P2_PITS.forEach(pit => {
        expect(isValidMove(board, pit, 1)).toBe(false)
      })

      // Player 2 cannot play player 1 pits
      P1_PITS.forEach(pit => {
        expect(isValidMove(board, pit, 2)).toBe(false)
      })
    })
  })

  describe('getValidMoves', () => {
    it('should return all pits with stones for the player', () => {
      const board = createInitialBoard()

      const p1Moves = getValidMoves(board, 1)
      expect(p1Moves).toEqual(P1_PITS)

      const p2Moves = getValidMoves(board, 2)
      expect(p2Moves).toEqual(P2_PITS)
    })

    it('should exclude empty pits from valid moves', () => {
      const board = createInitialBoard()
      board.pits[0] = 0
      board.pits[2] = 0
      board.pits[7] = 0

      const p1Moves = getValidMoves(board, 1)
      expect(p1Moves).toEqual([1, 3, 4, 5])

      const p2Moves = getValidMoves(board, 2)
      expect(p2Moves).toEqual([8, 9, 10, 11, 12])
    })
  })

  describe('executeMove', () => {
    it('should distribute stones counter-clockwise', () => {
      const board = createInitialBoard()

      // Player 1 plays pit 0 (4 stones)
      const { board: newBoard } = executeMove(board, 0, 1)

      // Pit 0 should be empty
      expect(newBoard.pits[0]).toBe(0)

      // Stones distributed to pits 1, 2, 3, 4
      expect(newBoard.pits[1]).toBe(5)
      expect(newBoard.pits[2]).toBe(5)
      expect(newBoard.pits[3]).toBe(5)
      expect(newBoard.pits[4]).toBe(5)

      // Other pits unchanged
      expect(newBoard.pits[5]).toBe(4)
    })

    it('should skip opponent store during distribution', () => {
      const board = createInitialBoard()
      // Give player 1 enough stones to reach player 2 store
      board.pits[5] = 10

      const { board: newBoard } = executeMove(board, 5, 1)

      // Player 2's store should still be 0
      expect(newBoard.pits[P2_STORE]).toBe(0)
    })

    it('should award extra turn when landing in own store', () => {
      const board = createInitialBoard()
      // Set up so player 1 lands exactly in their store
      board.pits[2] = 4

      const { move } = executeMove(board, 2, 1)

      expect(move.extraTurn).toBe(true)
    })

    it('should not award extra turn when not landing in own store', () => {
      const board = createInitialBoard()

      const { move } = executeMove(board, 0, 1)

      expect(move.extraTurn).toBe(false)
    })

    it('should capture opposite stones when landing in empty own pit', () => {
      const board = createInitialBoard()
      // Set up capture scenario
      board.pits[0] = 1 // Player 1's first pit has 1 stone
      board.pits[1] = 0 // Player 1's second pit is empty (will land here)
      board.pits[11] = 5 // Opposite pit (player 2) has 5 stones

      const { board: newBoard, move } = executeMove(board, 0, 1)

      // Should capture 1 (own stone) + 5 (opposite) = 6 stones
      expect(move.capturedStones).toBe(6)
      expect(newBoard.pits[P1_STORE]).toBe(6)
      expect(newBoard.pits[1]).toBe(0) // Landing pit should be empty
      expect(newBoard.pits[11]).toBe(0) // Opposite pit should be empty
    })

    it('should capture when landing in empty own pit (player 2)', () => {
      const board = createInitialBoard()
      board.pits[7] = 1 // Player 2's first pit has 1 stone
      board.pits[8] = 0 // Player 2's second pit is empty (will land here)
      // Opposite of pit 8 is pit 4 (12 - 8 = 4), which has 4 stones from initial setup

      const { move, board: newBoard } = executeMove(board, 7, 2)

      // Should capture 1 (own stone) + 4 (opposite) = 5 stones
      expect(move.capturedStones).toBe(5)
      expect(newBoard.pits[P2_STORE]).toBe(5)
      expect(newBoard.pits[8]).toBe(0) // Landing pit should be empty after capture
      expect(newBoard.pits[4]).toBe(0) // Opposite pit should be empty after capture
    })

    it('should not capture when opposite pit is empty', () => {
      const board = createInitialBoard()
      board.pits[0] = 1
      board.pits[1] = 0
      board.pits[11] = 0 // Opposite pit is empty

      const { move } = executeMove(board, 0, 1)

      // No capture because opposite pit is empty
      expect(move.capturedStones).toBeUndefined()
    })
  })

  describe('isGameOver', () => {
    it('should return false when both sides have stones', () => {
      const board = createInitialBoard()
      expect(isGameOver(board)).toBe(false)
    })

    it('should return true when player 1 side is empty', () => {
      const board = createInitialBoard()
      P1_PITS.forEach(pit => {
        board.pits[pit] = 0
      })

      expect(isGameOver(board)).toBe(true)
    })

    it('should return true when player 2 side is empty', () => {
      const board = createInitialBoard()
      P2_PITS.forEach(pit => {
        board.pits[pit] = 0
      })

      expect(isGameOver(board)).toBe(true)
    })
  })

  describe('finalizeGame', () => {
    it('should collect remaining stones to respective stores', () => {
      const board: Board = {
        pits: [0, 0, 0, 0, 0, 0, 10, 3, 2, 0, 0, 0, 0, 15],
      }
      // P1 pits (0-5): all 0, P1 store (6): 10
      // P2 pits (7-12): 3, 2, 0, 0, 0, 0 = 5 remaining, P2 store (13): 15

      const { board: finalBoard } = finalizeGame(board)

      // Player 1 has no remaining stones, store stays at 10
      expect(finalBoard.pits[P1_STORE]).toBe(10)

      // Player 2's remaining stones (3+2=5) should be added to their store
      expect(finalBoard.pits[P2_STORE]).toBe(20) // 15 + 5

      // All pits should be empty
      P1_PITS.forEach(pit => {
        expect(finalBoard.pits[pit]).toBe(0)
      })
      P2_PITS.forEach(pit => {
        expect(finalBoard.pits[pit]).toBe(0)
      })
    })

    it('should determine winner correctly', () => {
      const board: Board = {
        pits: [0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 10],
      }

      const { winner } = finalizeGame(board)

      expect(winner).toBe(1)
    })

    it('should return null for a tie', () => {
      const board: Board = {
        pits: [0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 24],
      }

      const { winner } = finalizeGame(board)

      expect(winner).toBeNull()
    })

    it('should handle player 2 winning', () => {
      const board: Board = {
        pits: [0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 30],
      }

      const { winner } = finalizeGame(board)

      expect(winner).toBe(2)
    })
  })

  describe('integration: full game move sequence', () => {
    it('should maintain board integrity through multiple moves', () => {
      let board = createInitialBoard()

      // Initial total stones: 48
      const initialTotal = board.pits.reduce((sum, stones) => sum + stones, 0)
      expect(initialTotal).toBe(48)

      // Execute several moves
      const moves = [
        { pit: 0, player: 1 as const },
        { pit: 7, player: 2 as const },
        { pit: 1, player: 1 as const },
      ]

      moves.forEach(({ pit, player }) => {
        const result = executeMove(board, pit, player)
        board = result.board

        // Total stones should remain constant
        const total = board.pits.reduce((sum, stones) => sum + stones, 0)
        expect(total).toBe(48)
      })
    })

    it('should handle wrapping around the board', () => {
      const board = createInitialBoard()
      // Give player 2's last pit many stones to wrap around
      board.pits[12] = 15

      const { board: newBoard } = executeMove(board, 12, 2)

      // Should wrap around to player 1's side
      expect(newBoard.pits[P2_STORE]).toBeGreaterThan(0)
      expect(newBoard.pits[0]).toBeGreaterThan(4) // Should have received stones
    })
  })
})
