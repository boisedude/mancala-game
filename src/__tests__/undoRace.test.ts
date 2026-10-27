// Undo must not be possible while a move is being animated, and must roll back the history.

import { renderHook, act } from '@testing-library/react'
import { useMancalaGame } from '@/hooks/useMancalaGame'

describe('undo and animation', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  function playOneMove(difficulty: 'easy' | 'medium' | 'hard' = 'medium') {
    const hook = renderHook(() => useMancalaGame(150, difficulty))
    act(() => hook.result.current.startGame('vsAI', difficulty))
    // Pit 0 holds 4 stones and ends in pit 4: no extra turn, no capture
    act(() => hook.result.current.makeMove(0))
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    return hook
  }

  it('undo trims the move history back to the state it restores', () => {
    const { result } = playOneMove()
    expect(result.current.gameState.currentPlayer).toBe(2)
    expect(result.current.gameState.moveHistory).toHaveLength(1)
    act(() => result.current.undoMove())
    expect(result.current.gameState.currentPlayer).toBe(1)
    expect(result.current.gameState.board.pits[0]).toBe(4)
    expect(result.current.gameState.moveHistory).toHaveLength(0)
    expect(result.current.gameState.lastMove).toBeNull()
  })

  it('ignores undo while the opponent move is animating', () => {
    const { result } = playOneMove('hard')
    // Step forward until the AI has started animating
    for (let i = 0; i < 80 && !result.current.isAnimating; i++) {
      act(() => {
        jest.advanceTimersByTime(50)
      })
    }
    expect(result.current.isAnimating).toBe(true)
    act(() => result.current.undoMove())
    act(() => {
      jest.advanceTimersByTime(3000)
    })
    // The AI move must have landed on a coherent board: total stones conserved and history has 2 moves
    const total = result.current.gameState.board.pits.reduce((a, b) => a + b, 0)
    expect(total).toBe(48)
    expect(result.current.gameState.moveHistory).toHaveLength(2)
    expect(result.current.gameState.board.pits[0]).toBe(0)
    // After the opponent's move it must be the player's turn again (unless it was an extra turn)
    const last = result.current.gameState.lastMove!
    expect(result.current.gameState.currentPlayer).toBe(last.extraTurn ? 2 : 1)
  })
})
