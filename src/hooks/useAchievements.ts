// Custom hook for managing Mancala achievements

import { useState, useCallback, useEffect } from 'react'
import type { Achievement, AchievementId, AchievementProgress } from '@/types/mancala.types'

const STORAGE_KEY = 'mancala_achievements'
const PROGRESS_KEY = 'mancala_achievement_progress'

/**
 * Define all available achievements
 */
const ACHIEVEMENT_DEFINITIONS: Achievement[] = [
  {
    id: 'first_win',
    name: 'First Victory',
    description: 'Win your first game',
    icon: '🎉',
    unlockedAt: null,
  },
  {
    id: 'perfect_capture',
    name: 'Perfect Capture',
    description: 'Capture 12 or more stones in a single move',
    icon: '💎',
    unlockedAt: null,
  },
  {
    id: 'chain_master',
    name: 'Chain Master',
    description: 'Get 3 or more extra turns in a row',
    icon: '🔗',
    unlockedAt: null,
  },
  {
    id: 'comeback_king',
    name: 'Comeback King',
    description: 'Win after being down by 10 or more stones',
    icon: '👑',
    unlockedAt: null,
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Win a game in under 60 seconds',
    icon: '⚡',
    unlockedAt: null,
  },
  {
    id: 'undefeated',
    name: 'Undefeated',
    description: 'Win 5 games in a row',
    icon: '🏆',
    unlockedAt: null,
    progress: 0,
    target: 5,
  },
  {
    id: 'stone_master',
    name: 'Stone Master',
    description: 'Capture 100 stones across all games',
    icon: '🗿',
    unlockedAt: null,
    progress: 0,
    target: 100,
  },
  {
    id: 'perfect_game',
    name: 'Perfect Game',
    description: 'Win without letting opponent score 10+ stones',
    icon: '⭐',
    unlockedAt: null,
  },
]

/**
 * Load achievements from localStorage
 */
function loadAchievements(): Achievement[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return ACHIEVEMENT_DEFINITIONS

    const parsed = JSON.parse(stored)
    // Merge with definitions to ensure new achievements are added
    return ACHIEVEMENT_DEFINITIONS.map(def => {
      const saved = parsed.find((a: Achievement) => a.id === def.id)
      return saved || def
    })
  } catch {
    return ACHIEVEMENT_DEFINITIONS
  }
}

/**
 * Save achievements to localStorage
 */
function saveAchievements(achievements: Achievement[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements))
  } catch (error) {
    console.error('Error saving achievements:', error)
  }
}

/**
 * Load achievement progress from localStorage
 */
function loadProgress(): AchievementProgress {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY)
    if (!stored) {
      return {
        totalStonesCaptured: 0,
        currentWinStreak: 0,
        maxCaptureInSingleMove: 0,
        currentExtraTurnChain: 0,
        maxExtraTurnChain: 0,
      }
    }
    return JSON.parse(stored)
  } catch {
    return {
      totalStonesCaptured: 0,
      currentWinStreak: 0,
      maxCaptureInSingleMove: 0,
      currentExtraTurnChain: 0,
      maxExtraTurnChain: 0,
    }
  }
}

/**
 * Save achievement progress to localStorage
 */
function saveProgress(progress: AchievementProgress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
  } catch (error) {
    console.error('Error saving achievement progress:', error)
  }
}

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(() => loadAchievements())
  const [progress, setProgress] = useState<AchievementProgress>(() => loadProgress())
  const [recentlyUnlocked, setRecentlyUnlocked] = useState<Achievement | null>(null)

  // Save to localStorage whenever achievements change
  useEffect(() => {
    saveAchievements(achievements)
  }, [achievements])

  // Save progress whenever it changes
  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  /**
   * Unlock an achievement
   */
  const unlockAchievement = useCallback((id: AchievementId) => {
    setAchievements(prev => {
      const updated = prev.map(achievement => {
        if (achievement.id === id && !achievement.unlockedAt) {
          const unlocked = { ...achievement, unlockedAt: Date.now() }
          setRecentlyUnlocked(unlocked)
          // Clear notification after 5 seconds
          setTimeout(() => setRecentlyUnlocked(null), 5000)
          return unlocked
        }
        return achievement
      })
      return updated
    })
  }, [])

  /**
   * Check and update progress-based achievements
   */
  const updateProgressAchievements = useCallback(() => {
    setAchievements(prev =>
      prev.map(achievement => {
        if (achievement.id === 'stone_master' && achievement.target) {
          return { ...achievement, progress: progress.totalStonesCaptured }
        }
        if (achievement.id === 'undefeated' && achievement.target) {
          return { ...achievement, progress: progress.currentWinStreak }
        }
        return achievement
      })
    )

    // Check if progress-based achievements should be unlocked
    if (progress.totalStonesCaptured >= 100) {
      unlockAchievement('stone_master')
    }
    if (progress.currentWinStreak >= 5) {
      unlockAchievement('undefeated')
    }
  }, [progress, unlockAchievement])

  // Update progress achievements when progress changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    updateProgressAchievements()
  }, [updateProgressAchievements])

  /**
   * Track a capture
   */
  const trackCapture = useCallback((stones: number) => {
    setProgress(prev => {
      const updated = {
        ...prev,
        totalStonesCaptured: prev.totalStonesCaptured + stones,
        maxCaptureInSingleMove: Math.max(prev.maxCaptureInSingleMove, stones),
      }
      return updated
    })

    // Check for perfect capture
    if (stones >= 12) {
      unlockAchievement('perfect_capture')
    }
  }, [unlockAchievement])

  /**
   * Track an extra turn
   */
  const trackExtraTurn = useCallback(() => {
    setProgress(prev => {
      const newChain = prev.currentExtraTurnChain + 1
      const newMax = Math.max(prev.maxExtraTurnChain, newChain)

      // Check for chain master (3+ in a row)
      if (newChain >= 3) {
        unlockAchievement('chain_master')
      }

      return {
        ...prev,
        currentExtraTurnChain: newChain,
        maxExtraTurnChain: newMax,
      }
    })
  }, [unlockAchievement])

  /**
   * End current extra turn chain
   */
  const endExtraTurnChain = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      currentExtraTurnChain: 0,
    }))
  }, [])

  /**
   * Track a game result
   */
  const trackGameResult = useCallback(
    (won: boolean, gameDuration: number, _playerScore: number, opponentScore: number, maxDeficit: number) => {
      if (won) {
        // First win
        unlockAchievement('first_win')

        // Update win streak
        setProgress(prev => ({
          ...prev,
          currentWinStreak: prev.currentWinStreak + 1,
        }))

        // Speed demon
        if (gameDuration < 60) {
          unlockAchievement('speed_demon')
        }

        // Comeback king
        if (maxDeficit >= 10) {
          unlockAchievement('comeback_king')
        }

        // Perfect game
        if (opponentScore < 10) {
          unlockAchievement('perfect_game')
        }
      } else {
        // Reset win streak on loss
        setProgress(prev => ({
          ...prev,
          currentWinStreak: 0,
        }))
      }

      // Reset extra turn chains for new game
      setProgress(prev => ({
        ...prev,
        extraTurnChains: [],
      }))
    },
    [unlockAchievement]
  )

  /**
   * Reset all achievements
   */
  const resetAchievements = useCallback(() => {
    setAchievements(ACHIEVEMENT_DEFINITIONS)
    setProgress({
      totalStonesCaptured: 0,
      currentWinStreak: 0,
      maxCaptureInSingleMove: 0,
      currentExtraTurnChain: 0,
      maxExtraTurnChain: 0,
    })
  }, [])

  /**
   * Get unlocked achievements
   */
  const getUnlockedAchievements = useCallback(() => {
    return achievements.filter(a => a.unlockedAt !== null)
  }, [achievements])

  /**
   * Get locked achievements
   */
  const getLockedAchievements = useCallback(() => {
    return achievements.filter(a => a.unlockedAt === null)
  }, [achievements])

  return {
    achievements,
    recentlyUnlocked,
    progress,
    trackCapture,
    trackExtraTurn,
    endExtraTurnChain,
    trackGameResult,
    resetAchievements,
    getUnlockedAchievements,
    getLockedAchievements,
  }
}
