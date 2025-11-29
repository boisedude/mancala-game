// Custom hook for game state persistence to localStorage

import { useCallback } from 'react'
import type { GameState } from '@/types/mancala.types'

const STORAGE_KEY = 'mancala_saved_game'

export interface SavedGame {
  gameState: GameState
  savedAt: number
  gameStartTime: number
  highestCaptureThisGame: number
}

/**
 * Validate that a parsed object is a valid SavedGame
 */
function isValidSavedGame(obj: unknown): obj is SavedGame {
  if (!obj || typeof obj !== 'object') return false

  const saved = obj as Record<string, unknown>

  // Validate top-level fields
  if (typeof saved.savedAt !== 'number') return false
  if (typeof saved.gameStartTime !== 'number') return false
  if (typeof saved.highestCaptureThisGame !== 'number') return false
  if (!saved.gameState || typeof saved.gameState !== 'object') return false

  const gs = saved.gameState as Record<string, unknown>

  // Validate board structure
  if (!gs.board || typeof gs.board !== 'object') return false
  const board = gs.board as Record<string, unknown>
  if (!Array.isArray(board.pits)) return false
  if (board.pits.length !== 14) return false
  if (!board.pits.every(p => typeof p === 'number' && p >= 0 && Number.isInteger(p))) return false

  // Validate current player
  if (![1, 2].includes(gs.currentPlayer as number)) return false

  // Validate status
  if (!['setup', 'playing', 'finished'].includes(gs.status as string)) return false

  // Validate winner (can be null, 1, or 2)
  if (gs.winner !== null && ![1, 2].includes(gs.winner as number)) return false

  // Validate mode
  if (!['vsAI', 'vsHuman', 'tutorial'].includes(gs.mode as string)) return false

  // Validate difficulty
  if (!['easy', 'medium', 'hard'].includes(gs.difficulty as string)) return false

  // Validate moveHistory is an array
  if (!Array.isArray(gs.moveHistory)) return false

  return true
}

export function useGamePersistence() {
  /**
   * Save current game state to localStorage
   */
  const saveGame = useCallback(
    (gameState: GameState, gameStartTime: number, highestCaptureThisGame: number) => {
      // Only save if game is actively being played
      if (gameState.status !== 'playing') {
        return
      }

      const savedGame: SavedGame = {
        gameState,
        savedAt: Date.now(),
        gameStartTime,
        highestCaptureThisGame,
      }

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedGame))
      } catch (error) {
        console.error('Failed to save game:', error)
      }
    },
    []
  )

  /**
   * Load saved game from localStorage
   */
  const loadGame = useCallback((): SavedGame | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) return null

      const parsed = JSON.parse(saved)

      // Comprehensive validation of saved game structure
      if (!isValidSavedGame(parsed)) {
        console.warn('Invalid saved game data, clearing storage')
        localStorage.removeItem(STORAGE_KEY)
        return null
      }

      return parsed
    } catch (error) {
      console.error('Failed to load game:', error)
      // Clear corrupted data
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch {
        // Ignore cleanup errors
      }
      return null
    }
  }, [])

  /**
   * Check if a saved game exists
   */
  const hasSavedGame = useCallback((): boolean => {
    return loadGame() !== null
  }, [loadGame])

  /**
   * Clear saved game from localStorage
   */
  const clearSavedGame = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear saved game:', error)
    }
  }, [])

  /**
   * Abandon the saved game (same as clear)
   */
  const abandonGame = useCallback(() => {
    clearSavedGame()
  }, [clearSavedGame])

  /**
   * Resume game - returns the saved game and keeps it in storage
   * Caller should clear it after successfully loading
   */
  const resumeGame = useCallback((): SavedGame | null => {
    return loadGame()
  }, [loadGame])

  return {
    saveGame,
    loadGame,
    hasSavedGame,
    clearSavedGame,
    abandonGame,
    resumeGame,
  }
}
