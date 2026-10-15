import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { GameState } from '@/types/mancala.types'

const mockRecordPlayerBeatBentley = jest.fn()
const mockRecordBentleyBeatPlayer = jest.fn()
jest.mock('@shared/arcadeRecord', () => ({
  recordPlayerBeatBentley: (...a: unknown[]) => mockRecordPlayerBeatBentley(...a),
  recordBentleyBeatPlayer: (...a: unknown[]) => mockRecordBentleyBeatPlayer(...a),
}))

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

describe('arcade Bentley record', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('records a player win against Bentley exactly once, even across re-renders', () => {
    mockState = finished({ winner: 1 })
    const { rerender } = renderGame()
    rerender(
      <MemoryRouter>
        <MancalaGame />
      </MemoryRouter>
    )
    expect(mockRecordPlayerBeatBentley).toHaveBeenCalledTimes(1)
    expect(mockRecordBentleyBeatPlayer).not.toHaveBeenCalled()
  })

  it('records a Bentley win when the player loses', () => {
    mockState = finished({ winner: 2 })
    renderGame()
    expect(mockRecordBentleyBeatPlayer).toHaveBeenCalledTimes(1)
    expect(mockRecordPlayerBeatBentley).not.toHaveBeenCalled()
  })

  it('records nothing for a tie', () => {
    mockState = finished({ winner: null })
    renderGame()
    expect(mockRecordPlayerBeatBentley).not.toHaveBeenCalled()
    expect(mockRecordBentleyBeatPlayer).not.toHaveBeenCalled()
  })

  it('records nothing against Bella or Coop', () => {
    mockState = finished({ difficulty: 'easy', winner: 1 })
    renderGame()
    mockState = finished({ difficulty: 'medium', winner: 2 })
    renderGame()
    expect(mockRecordPlayerBeatBentley).not.toHaveBeenCalled()
    expect(mockRecordBentleyBeatPlayer).not.toHaveBeenCalled()
  })

  it('records nothing in player-vs-player games', () => {
    mockState = finished({ mode: 'vsHuman', winner: 1 })
    renderGame()
    expect(mockRecordPlayerBeatBentley).not.toHaveBeenCalled()
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
