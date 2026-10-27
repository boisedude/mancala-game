import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { GameState } from '@/types/mancala.types'

let mockState: GameState
jest.mock('@/hooks/useMancalaGame', () => ({
  useMancalaGame: () => ({
    gameState: mockState,
    isAIThinking: false,
    isAnimating: false,
    startGame: jest.fn(),
    makeMove: jest.fn(),
    undoMove: jest.fn(),
    resetGame: jest.fn(),
    setDifficulty: jest.fn(),
    setMode: jest.fn(),
    getValidMovesForCurrentPlayer: () => [],
    restoreGameState: jest.fn(),
  }),
}))

import MancalaGame from '@/pages/MancalaGame'

function finished(over: Partial<GameState>): GameState {
  const pits = new Array(14).fill(0)
  pits[6] = 30
  pits[13] = 18
  return {
    board: { pits },
    currentPlayer: 1,
    status: 'finished',
    winner: 1,
    mode: 'vsAI',
    difficulty: 'hard',
    moveHistory: [],
    lastMove: null,
    undoState: null,
    ...over,
  }
}

function renderGame() {
  return render(
    <MemoryRouter>
      <MancalaGame />
    </MemoryRouter>
  )
}

describe('game over announcement', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('announces a tie as a tie, not a win', async () => {
    const pits = new Array(14).fill(0)
    pits[6] = 24
    pits[13] = 24
    mockState = finished({ winner: null, board: { pits } })
    renderGame()
    await waitFor(() =>
      expect(screen.getAllByRole('status').some(el => /tie, 24 stones to 24/.test(el.textContent ?? ''))).toBe(true)
    )
    expect(document.body.textContent).not.toMatch(/wins with 24 stones/)
  })
})
