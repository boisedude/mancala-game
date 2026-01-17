// Custom hook for managing Mancala leaderboard

import { useState, useCallback } from 'react'
import type { LeaderboardEntry } from '@/types/mancala.types'

const STORAGE_KEY = 'mancala_leaderboard'
const PLAYER_NAME_KEY = 'mancala_player_name'

/**
 * Validates that an object matches the LeaderboardEntry structure
 */
function isValidLeaderboardEntry(obj: unknown): obj is LeaderboardEntry {
  if (!obj || typeof obj !== 'object') return false

  const entry = obj as Record<string, unknown>

  return (
    typeof entry.id === 'string' &&
    typeof entry.playerName === 'string' &&
    typeof entry.wins === 'number' &&
    typeof entry.losses === 'number' &&
    typeof entry.winStreak === 'number' &&
    typeof entry.highestCapture === 'number' &&
    typeof entry.fastestWin === 'number' &&
    typeof entry.totalGamesPlayed === 'number' &&
    typeof entry.lastPlayed === 'number' &&
    entry.wins >= 0 &&
    entry.losses >= 0 &&
    entry.winStreak >= 0 &&
    entry.highestCapture >= 0 &&
    entry.totalGamesPlayed >= 0
  )
}

/**
 * Gets leaderboard from localStorage with validation
 */
function getLeaderboardFromStorage(): LeaderboardEntry | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null

    const parsed = JSON.parse(stored)

    // Validate the parsed data structure
    if (isValidLeaderboardEntry(parsed)) {
      return parsed
    }

    return null
  } catch {
    return null
  }
}

/**
 * Saves leaderboard to localStorage
 */
function saveLeaderboardToStorage(entry: LeaderboardEntry): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entry))
  } catch {
    // Silent fail for localStorage errors - stats work for current session
  }
}

/**
 * Gets player name from localStorage
 */
function getPlayerNameFromStorage(): string {
  return localStorage.getItem(PLAYER_NAME_KEY) || 'Player'
}

/**
 * Saves player name to localStorage
 */
function savePlayerNameToStorage(name: string): void {
  localStorage.setItem(PLAYER_NAME_KEY, name)
}

/**
 * Creates initial leaderboard entry
 */
function createInitialEntry(playerName: string): LeaderboardEntry {
  return {
    id: crypto.randomUUID(),
    playerName,
    wins: 0,
    losses: 0,
    winStreak: 0,
    highestCapture: 0,
    fastestWin: Infinity,
    totalGamesPlayed: 0,
    lastPlayed: Date.now(),
  }
}

export function useLeaderboard() {
  const [playerName, setPlayerNameState] = useState<string>(() => getPlayerNameFromStorage())
  const [stats, setStats] = useState<LeaderboardEntry>(() => {
    const existing = getLeaderboardFromStorage()
    return existing || createInitialEntry(playerName)
  })

  /**
   * Updates player name
   */
  const updatePlayerName = useCallback((name: string) => {
    const trimmedName = name.trim() || 'Player'
    setPlayerNameState(trimmedName)
    savePlayerNameToStorage(trimmedName)
    setStats(prev => {
      const updated = { ...prev, playerName: trimmedName }
      saveLeaderboardToStorage(updated)
      return updated
    })
  }, [])

  /**
   * Records a game result
   */
  const recordGame = useCallback((won: boolean, gameDuration: number, highestCapture: number) => {
    setStats(prev => {
      const newStats: LeaderboardEntry = {
        ...prev,
        wins: won ? prev.wins + 1 : prev.wins,
        losses: won ? prev.losses : prev.losses + 1,
        winStreak: won ? prev.winStreak + 1 : 0,
        highestCapture: Math.max(prev.highestCapture, highestCapture),
        fastestWin: won ? Math.min(prev.fastestWin, gameDuration) : prev.fastestWin,
        totalGamesPlayed: prev.totalGamesPlayed + 1,
        lastPlayed: Date.now(),
      }

      saveLeaderboardToStorage(newStats)
      return newStats
    })
  }, [])

  /**
   * Resets all stats
   */
  const resetStats = useCallback(() => {
    const newStats = createInitialEntry(playerName)
    setStats(newStats)
    saveLeaderboardToStorage(newStats)
  }, [playerName])

  return {
    playerName,
    stats,
    updatePlayerName,
    recordGame,
    resetStats,
  }
}
