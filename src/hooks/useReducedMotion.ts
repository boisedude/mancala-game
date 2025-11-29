// Custom hook for detecting and managing reduced motion preferences

import { useState, useEffect } from 'react'

/**
 * useReducedMotion - Detects prefers-reduced-motion media query and manages motion preferences
 *
 * Features:
 * - Detects system prefers-reduced-motion setting
 * - Provides isReducedMotion boolean
 * - Saves manual toggle to localStorage
 * - Allows user override of system preference
 *
 * @returns Object with isReducedMotion state and toggleReducedMotion function
 */
export function useReducedMotion() {
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(() => {
    // Check localStorage for saved preference
    const savedPreference = localStorage.getItem('mancala_reduced_motion')
    if (savedPreference !== null) {
      return savedPreference === 'true'
    }

    // Check system preference
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      return mediaQuery.matches
    }

    return false
  })

  useEffect(() => {
    // Only listen to system preference if user hasn't set a manual preference
    const savedPreference = localStorage.getItem('mancala_reduced_motion')
    if (savedPreference !== null) {
      return // User has manual preference, don't listen to system
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const handleChange = (event: MediaQueryListEvent) => {
      setIsReducedMotion(event.matches)
    }

    // Listen for changes to system preference
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  const toggleReducedMotion = () => {
    setIsReducedMotion(prev => {
      const newValue = !prev
      localStorage.setItem('mancala_reduced_motion', String(newValue))
      return newValue
    })
  }

  return {
    isReducedMotion,
    toggleReducedMotion,
  }
}
