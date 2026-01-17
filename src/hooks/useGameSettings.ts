// Custom hook for game settings management

import { useState, useEffect, useCallback } from 'react'

export type AnimationSpeed = 'off' | 'fast' | 'normal' | 'slow'
export type HintLevel = 'off' | 'basic' | 'advanced'

export interface GameSettings {
  animationSpeed: AnimationSpeed
  showMoveHistory: boolean
  showGameStats: boolean
  showMoveHints: HintLevel
  showVictoryCelebration: boolean
  hapticFeedback: boolean
}

const DEFAULT_SETTINGS: GameSettings = {
  animationSpeed: 'normal',
  showMoveHistory: false,
  showGameStats: true,
  showMoveHints: 'off',
  showVictoryCelebration: true,
  hapticFeedback: true,
}

const SETTINGS_STORAGE_KEY = 'mancala_game_settings'

// Animation speed to milliseconds mapping
export const ANIMATION_SPEED_MS: Record<AnimationSpeed, number> = {
  off: 0,
  fast: 75,
  normal: 150,
  slow: 300,
}

export function useGameSettings() {
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        return { ...DEFAULT_SETTINGS, ...parsed }
      }
    } catch {
      // Fall through to return default settings
    }
    return DEFAULT_SETTINGS
  })

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
    } catch {
      // Silent fail for localStorage errors - settings work for current session
    }
  }, [settings])

  const updateSetting = useCallback(
    <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
      setSettings(prev => ({ ...prev, [key]: value }))
    },
    []
  )

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
  }, [])

  const getAnimationDelay = useCallback(() => {
    return ANIMATION_SPEED_MS[settings.animationSpeed]
  }, [settings.animationSpeed])

  return {
    settings,
    updateSetting,
    resetSettings,
    getAnimationDelay,
  }
}
