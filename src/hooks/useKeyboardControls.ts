// Custom hook for keyboard navigation and shortcuts in Mancala game

import { useState, useEffect, useCallback } from 'react'
import type { GameMode } from '@/types/mancala.types'

export interface KeyboardControlsConfig {
  onPitSelect: (pitIndex: number) => void
  onUndo: () => void
  onNewGame: () => void
  onShowHelp: () => void
  validMoves: number[]
  gameMode: GameMode
  isAIThinking: boolean
  gameStatus: 'setup' | 'playing' | 'finished'
}

export interface KeyboardControlsResult {
  activePit: number | null
  handleKeyPress: (key: string) => void
  clearActive: () => void
  isHelpOpen: boolean
  setIsHelpOpen: (open: boolean) => void
}

/**
 * Custom hook to manage keyboard controls for the Mancala game
 *
 * Features:
 * - Keys 1-6: Select Player 1's pits (indices 0-5)
 * - Keys 7-12: Select Player 2's pits (indices 7-12) in vsHuman mode
 * - Arrow Left/Right: Navigate between pits
 * - Enter/Space: Confirm move on active pit
 * - U: Undo last move
 * - N: New game
 * - ?: Show help dialog
 */
export function useKeyboardControls({
  onPitSelect,
  onUndo,
  onNewGame,
  onShowHelp,
  validMoves,
  gameMode,
  isAIThinking,
  gameStatus,
}: KeyboardControlsConfig): KeyboardControlsResult {
  const [activePit, setActivePit] = useState<number | null>(null)
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  // Clear active pit when valid moves change
  useEffect(() => {
    if (activePit !== null && !validMoves.includes(activePit)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActivePit(null)
    }
  }, [validMoves, activePit])

  // Clear active pit when AI is thinking
  useEffect(() => {
    if (isAIThinking) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActivePit(null)
    }
  }, [isAIThinking])

  const clearActive = useCallback(() => {
    setActivePit(null)
  }, [])

  const handleKeyPress = useCallback(
    (key: string) => {
      // Don't process keys when AI is thinking or game is not playing
      if (isAIThinking || gameStatus !== 'playing') {
        // Allow help dialog in all states except when AI is thinking
        if (!isAIThinking && (key === '?' || key === '/')) {
          setIsHelpOpen(true)
          onShowHelp()
        }
        return
      }

      const numKey = parseInt(key)

      // Handle number keys 1-12
      if (!isNaN(numKey) && numKey >= 1 && numKey <= 12) {
        const pitIndex = numKey - 1 // Convert to 0-indexed

        // For keys 1-6: Player 1 pits (indices 0-5)
        if (numKey >= 1 && numKey <= 6) {
          if (validMoves.includes(pitIndex)) {
            setActivePit(pitIndex)
          }
        }
        // For keys 7-12: Player 2 pits (indices 7-12) - only in vsHuman mode
        else if (numKey >= 7 && numKey <= 12) {
          const p2PitIndex = pitIndex + 1 // Keys 7-12 map to pit indices 7-12
          if (gameMode === 'vsHuman' && validMoves.includes(p2PitIndex)) {
            setActivePit(p2PitIndex)
          }
        }
      }

      // Handle arrow navigation
      if (key === 'ArrowLeft' || key === 'ArrowRight') {
        const currentIndex = validMoves.indexOf(activePit ?? -1)
        let nextIndex: number

        if (currentIndex === -1) {
          // No pit selected, select first valid move
          nextIndex = 0
        } else if (key === 'ArrowRight') {
          // Move right (wraps around)
          nextIndex = (currentIndex + 1) % validMoves.length
        } else {
          // Move left (wraps around)
          nextIndex = (currentIndex - 1 + validMoves.length) % validMoves.length
        }

        setActivePit(validMoves[nextIndex])
      }

      // Handle Enter/Space to confirm move
      if ((key === 'Enter' || key === ' ') && activePit !== null) {
        if (validMoves.includes(activePit)) {
          onPitSelect(activePit)
          setActivePit(null)
        }
      }

      // Handle undo (U key)
      if (key === 'u' || key === 'U') {
        onUndo()
        setActivePit(null)
      }

      // Handle new game (N key)
      if (key === 'n' || key === 'N') {
        onNewGame()
        setActivePit(null)
      }

      // Handle help (? or /)
      if (key === '?' || key === '/') {
        setIsHelpOpen(true)
        onShowHelp()
      }

      // Handle Escape to clear active pit
      if (key === 'Escape') {
        setActivePit(null)
      }
    },
    [
      activePit,
      validMoves,
      gameMode,
      isAIThinking,
      gameStatus,
      onPitSelect,
      onUndo,
      onNewGame,
      onShowHelp,
    ]
  )

  // Global keyboard event listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't interfere with typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      // Prevent default for game control keys
      if (
        ['ArrowLeft', 'ArrowRight', ' ', 'Enter'].includes(event.key) ||
        /^[1-9]$/.test(event.key) ||
        event.key === 'u' ||
        event.key === 'U' ||
        event.key === 'n' ||
        event.key === 'N' ||
        event.key === '?' ||
        event.key === '/'
      ) {
        event.preventDefault()
      }

      handleKeyPress(event.key)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyPress])

  return {
    activePit,
    handleKeyPress,
    clearActive,
    isHelpOpen,
    setIsHelpOpen,
  }
}
