// Custom hook for haptic feedback on mobile devices

import { useCallback } from 'react'

export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'error'

const HAPTIC_PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: 50,
  success: [10, 50, 10],
  error: [50, 100, 50],
}

export function useHapticFeedback(enabled: boolean = true) {
  const vibrate = useCallback(
    (pattern: HapticPattern = 'light') => {
      if (!enabled) return
      if (!('vibrate' in navigator)) return

      const vibratePattern = HAPTIC_PATTERNS[pattern]

      try {
        navigator.vibrate(vibratePattern)
      } catch (error) {
        // Silently fail if vibration is not supported or blocked
        console.debug('Haptic feedback not available:', error)
      }
    },
    [enabled]
  )

  return { vibrate }
}
