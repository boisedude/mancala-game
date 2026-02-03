// Unit tests for Mancala game rules engine

import {
  createInitialBoard,
  executeMove,
  executeMoveAnimated,
  isValidMove,
  isGameOver,
  finalizeGame,
  getValidMoves,
  getPlayerStore,
  getOpponentStore,
  getPlayerPits,
  getOppositePit,
  isPitOwnedBy,
  calculateScore,
  simulateMove,
  P1_PITS,
  P2_PITS,
  P1_STORE,
  P2_STORE,
  INITIAL_STONES_PER_PIT,
  PITS_PER_SIDE,
} from '@/lib/mancalaRules'
import type { Board } from '@/types/mancala.types'

describe('mancalaRules', () => {
  describe('constants', () => {
    it('should have correct initial stones per pit', () => {
      expect(INITIAL_STONES_PER_PIT).toBe(4)
    })

    it('should have correct pits per side', () => {
      expect(PITS_PER_SIDE).toBe(6)
    })

    it('should have correct pit indices', () => {
      expect(P1_PITS).toEqual([0, 1, 2, 3, 4, 5])
      expect(P2_PITS).toEqual([7, 8, 9, 10, 11, 12])
      expect(P1_STORE).toBe(6)
      expect(P2_STORE).toBe(13)
    })
  })

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

    it('should have total of 48 stones', () => {
      const board = createInitialBoard()
      const total = board.pits.reduce((sum, stones) => sum + stones, 0)
      expect(total).toBe(48)
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

  describe('getOpponentStore', () => {
    it('should return opponent store index for player 1', () => {
      expect(getOpponentStore(1)).toBe(P2_STORE)
      expect(getOpponentStore(1)).toBe(13)
    })

    it('should return opponent store index for player 2', () => {
      expect(getOpponentStore(2)).toBe(P1_STORE)
      expect(getOpponentStore(2)).toBe(6)
    })
  })

  describe('getPlayerPits', () => {
    it('should return correct pit indices for player 1', () => {
      expect(getPlayerPits(1)).toEqual(P1_PITS)
      expect(getPlayerPits(1)).toEqual([0, 1, 2, 3, 4, 5])
    })

    it('should return correct pit indices for player 2', () => {
      expect(getPlayerPits(2)).toEqual(P2_PITS)
      expect(getPlayerPits(2)).toEqual([7, 8, 9, 10, 11, 12])
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

    it('should not capture when landing in opponent pit', () => {
      const board = createInitialBoard()
      // Player 1 has many stones that will land in player 2 territory
      board.pits[5] = 8 // Will distribute past own store into P2 territory

      const { board: newBoard, move } = executeMove(board, 5, 1)

      // No capture should happen even if landing in "empty" opponent pit
      expect(move.capturedStones).toBeUndefined()
      // Player 1 store should have 1 stone (passed through it)
      expect(newBoard.pits[P1_STORE]).toBe(1)
    })

    it('should not capture when landing in own store', () => {
      const board = createInitialBoard()
      // Set up so player 1 lands in own store (extra turn scenario)
      board.pits[2] = 4 // Exactly lands in P1 store (pit 6)

      const { move } = executeMove(board, 2, 1)

      // No capture, just extra turn
      expect(move.capturedStones).toBeUndefined()
      expect(move.extraTurn).toBe(true)
    })

    it('should track affected pits during distribution', () => {
      const board = createInitialBoard()

      const { move } = executeMove(board, 0, 1)

      // Should have 4 affected pits (1, 2, 3, 4)
      expect(move.affectedPits).toEqual([1, 2, 3, 4])
    })

    it('should correctly set player in move record', () => {
      const board = createInitialBoard()

      const { move: move1 } = executeMove(board, 0, 1)
      const { move: move2 } = executeMove(board, 7, 2)

      expect(move1.player).toBe(1)
      expect(move2.player).toBe(2)
    })

    it('should record correct pitIndex in move', () => {
      const board = createInitialBoard()

      const { move } = executeMove(board, 3, 1)

      expect(move.pitIndex).toBe(3)
    })

    it('should set timestamp in move', () => {
      const board = createInitialBoard()
      const beforeTime = Date.now()

      const { move } = executeMove(board, 0, 1)

      const afterTime = Date.now()
      expect(move.timestamp).toBeGreaterThanOrEqual(beforeTime)
      expect(move.timestamp).toBeLessThanOrEqual(afterTime)
    })

    it('should handle multiple laps around the board', () => {
      const board: Board = {
        pits: [0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0],
      }

      const { board: newBoard } = executeMove(board, 5, 1)

      // 15 stones distributed: wraps around entire board and more
      // Should skip P2 store (13) so distribution covers 13 positions per lap
      // Starting from pit 5, distributing counter-clockwise:
      // pit 6(store), 7, 8, 9, 10, 11, 12, [skip 13], 0, 1, 2, 3, 4, 5, 6(store again)
      // That's 14 positions (skipping store 13), so with 15 stones:
      // First lap: 6,7,8,9,10,11,12,0,1,2,3,4,5 (13 stones), then 6 again (14th), then 7 (15th)
      expect(newBoard.pits[5]).toBe(1) // Received 1 stone on the wrap
      expect(newBoard.pits[P1_STORE]).toBe(2) // Passed through twice
      expect(newBoard.pits[P2_STORE]).toBe(0) // Should never receive stones
    })

    it('should handle player 2 skipping player 1 store', () => {
      const board: Board = {
        pits: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0],
      }

      const { board: newBoard } = executeMove(board, 12, 2)

      // Player 2's stones should skip P1 store (6)
      expect(newBoard.pits[P1_STORE]).toBe(0)
      expect(newBoard.pits[P2_STORE]).toBeGreaterThan(0)
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

    it('should preserve total stone count', () => {
      const board: Board = {
        pits: [1, 2, 3, 4, 5, 6, 10, 1, 2, 3, 4, 5, 6, 5],
      }
      const initialTotal = board.pits.reduce((sum, s) => sum + s, 0)

      const { board: finalBoard } = finalizeGame(board)

      const finalTotal = finalBoard.pits.reduce((sum, s) => sum + s, 0)
      expect(finalTotal).toBe(initialTotal)
    })
  })

  describe('calculateScore', () => {
    it('should return positive score when player is ahead', () => {
      const board: Board = {
        pits: [0, 0, 0, 0, 0, 0, 30, 0, 0, 0, 0, 0, 0, 18],
      }

      expect(calculateScore(board, 1)).toBe(12) // 30 - 18
    })

    it('should return negative score when player is behind', () => {
      const board: Board = {
        pits: [0, 0, 0, 0, 0, 0, 18, 0, 0, 0, 0, 0, 0, 30],
      }

      expect(calculateScore(board, 1)).toBe(-12) // 18 - 30
    })

    it('should return zero for tied stores', () => {
      const board: Board = {
        pits: [0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 24],
      }

      expect(calculateScore(board, 1)).toBe(0)
      expect(calculateScore(board, 2)).toBe(0)
    })

    it('should calculate score from player 2 perspective correctly', () => {
      const board: Board = {
        pits: [0, 0, 0, 0, 0, 0, 18, 0, 0, 0, 0, 0, 0, 30],
      }

      expect(calculateScore(board, 2)).toBe(12) // 30 - 18
    })
  })

  describe('simulateMove', () => {
    it('should predict affected pits without modifying board', () => {
      const board = createInitialBoard()
      const originalPits = [...board.pits]

      const result = simulateMove(board, 0, 1)

      // Board should not be modified
      expect(board.pits).toEqual(originalPits)
      // Should predict correct affected pits
      expect(result.affectedPits).toEqual([1, 2, 3, 4])
    })

    it('should correctly predict extra turn', () => {
      const board = createInitialBoard()
      board.pits[2] = 4 // Will land exactly in P1 store

      const result = simulateMove(board, 2, 1)

      expect(result.extraTurn).toBe(true)
      expect(result.lastPit).toBe(P1_STORE)
    })

    it('should correctly predict no extra turn', () => {
      const board = createInitialBoard()

      const result = simulateMove(board, 0, 1)

      expect(result.extraTurn).toBe(false)
    })

    it('should correctly predict capture opportunity', () => {
      const board = createInitialBoard()
      board.pits[0] = 1 // One stone
      board.pits[1] = 0 // Empty landing spot
      board.pits[11] = 5 // Opposite pit has stones

      const result = simulateMove(board, 0, 1)

      expect(result.willCapture).toBe(true)
      expect(result.capturedStones).toBe(6) // 1 own + 5 opposite
    })

    it('should predict no capture when opposite is empty', () => {
      const board = createInitialBoard()
      board.pits[0] = 1
      board.pits[1] = 0
      board.pits[11] = 0 // Empty opposite

      const result = simulateMove(board, 0, 1)

      expect(result.willCapture).toBe(false)
      expect(result.capturedStones).toBe(0)
    })

    it('should predict no capture when landing pit not empty initially', () => {
      const board = createInitialBoard()
      // Pit 1 already has 4 stones, landing there won't trigger capture

      const result = simulateMove(board, 0, 1)

      expect(result.willCapture).toBe(false)
    })

    it('should work correctly for player 2', () => {
      const board = createInitialBoard()
      board.pits[7] = 6 // Will land exactly in P2 store

      const result = simulateMove(board, 7, 2)

      expect(result.extraTurn).toBe(true)
      expect(result.lastPit).toBe(P2_STORE)
    })
  })

  describe('executeMoveAnimated', () => {
    it('should return multiple steps for animation', () => {
      const board = createInitialBoard()

      const { steps } = executeMoveAnimated(board, 0, 1)

      // Should have at least 2 steps: pickup + distribution steps
      expect(steps.length).toBeGreaterThan(1)
    })

    it('should have first step with empty source pit', () => {
      const board = createInitialBoard()

      const { steps } = executeMoveAnimated(board, 0, 1)

      // First step should show the pit being emptied
      expect(steps[0].pits[0]).toBe(0)
    })

    it('should have final step matching executeMove result', () => {
      const board = createInitialBoard()

      const { board: regularResult } = executeMove(board, 0, 1)
      const { steps } = executeMoveAnimated(board, 0, 1)

      const finalStep = steps[steps.length - 1]
      expect(finalStep.pits).toEqual(regularResult.pits)
    })

    it('should produce same move info as executeMove', () => {
      const board = createInitialBoard()

      const { move: regularMove } = executeMove(board, 0, 1)
      const { finalMove: animatedMove } = executeMoveAnimated(board, 0, 1)

      expect(animatedMove.player).toBe(regularMove.player)
      expect(animatedMove.pitIndex).toBe(regularMove.pitIndex)
      expect(animatedMove.extraTurn).toBe(regularMove.extraTurn)
      expect(animatedMove.capturedStones).toBe(regularMove.capturedStones)
      expect(animatedMove.affectedPits).toEqual(regularMove.affectedPits)
    })

    it('should add extra step for capture', () => {
      const board = createInitialBoard()
      board.pits[0] = 1
      board.pits[1] = 0
      board.pits[11] = 5

      const { steps, finalMove } = executeMoveAnimated(board, 0, 1)

      // Should have: pickup, drop, capture = 3 steps
      expect(steps.length).toBe(3)
      expect(finalMove.capturedStones).toBe(6)
      // Final step should show capture completed
      expect(steps[steps.length - 1].pits[1]).toBe(0)
      expect(steps[steps.length - 1].pits[11]).toBe(0)
      expect(steps[steps.length - 1].pits[P1_STORE]).toBe(6)
    })

    it('should work correctly for player 2', () => {
      const board = createInitialBoard()

      const { steps, finalMove } = executeMoveAnimated(board, 7, 2)

      expect(finalMove.player).toBe(2)
      expect(steps[0].pits[7]).toBe(0)
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

    it('should handle game that ends in a tie', () => {
      // Each player has exactly 24 stones total
      let board: Board = {
        pits: [1, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 1, 23],
      }

      // Player 1 plays, then game ends
      const { board: newBoard } = executeMove(board, 0, 1)

      if (isGameOver(newBoard)) {
        const { winner } = finalizeGame(newBoard)
        // Both should have 24 stones
        expect(winner).toBeNull()
      }
    })

    it('should correctly sequence extra turns', () => {
      const board = createInitialBoard()
      // Set up for extra turn
      board.pits[2] = 4

      const { move } = executeMove(board, 2, 1)

      expect(move.extraTurn).toBe(true)
      expect(move.player).toBe(1)
    })

    it('should handle game ending scenario', () => {
      const board: Board = {
        pits: [1, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 25],
      }

      // Player 1's only move
      const { board: newBoard } = executeMove(board, 0, 1)

      // After this move, P1 side should be empty
      expect(isGameOver(newBoard)).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should handle board with all stones on one side', () => {
      const board: Board = {
        pits: [8, 8, 8, 8, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0],
      }

      const validMoves = getValidMoves(board, 1)
      expect(validMoves).toEqual([0, 1, 2, 3, 4, 5])

      const p2Moves = getValidMoves(board, 2)
      expect(p2Moves).toEqual([])
    })

    it('should handle single stone in single pit', () => {
      const board: Board = {
        pits: [0, 0, 0, 0, 0, 1, 23, 0, 0, 0, 0, 0, 0, 24],
      }

      const { board: newBoard, move } = executeMove(board, 5, 1)

      expect(newBoard.pits[5]).toBe(0)
      expect(newBoard.pits[P1_STORE]).toBe(24)
      expect(move.extraTurn).toBe(true)
    })

    it('should handle maximum stones in a pit', () => {
      const board: Board = {
        pits: [48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      }

      const { board: newBoard } = executeMove(board, 0, 1)

      // Total should still be 48
      const total = newBoard.pits.reduce((sum, s) => sum + s, 0)
      expect(total).toBe(48)
    })

    it('should validate stores cannot be played', () => {
      const board = createInitialBoard()

      expect(isValidMove(board, P1_STORE, 1)).toBe(false)
      expect(isValidMove(board, P2_STORE, 2)).toBe(false)
    })
  })
})
