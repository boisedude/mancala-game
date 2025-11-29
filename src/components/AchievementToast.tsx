// Achievement unlock notification toast

import { useEffect, useState } from 'react'
import type { Achievement } from '@/types/mancala.types'

interface AchievementToastProps {
  achievement: Achievement | null
}

export function AchievementToast({ achievement }: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (achievement) {
      // Valid use of setState: managing animation visibility state in response to prop changes
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true)
      const timeout = setTimeout(() => {
        setIsVisible(false)
      }, 4500) // Hide slightly before parent clears it

      return () => clearTimeout(timeout)
    } else {
      setIsVisible(false)
    }
  }, [achievement])

  if (!achievement || !isVisible) return null

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 duration-300 animate-in slide-in-from-bottom-8 fade-in">
      <div className="flex items-center gap-3 rounded-lg border-2 border-yellow-500 bg-gradient-to-r from-yellow-50 to-amber-50 px-6 py-4 shadow-lg dark:border-yellow-600 dark:from-yellow-950 dark:to-amber-950">
        {/* Icon */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-2xl dark:bg-yellow-600">
          {achievement.icon}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold uppercase tracking-wider text-yellow-700 dark:text-yellow-400">
              Achievement Unlocked
            </span>
            <span className="text-xl">🎉</span>
          </div>
          <div className="mt-1 font-bold text-foreground">{achievement.name}</div>
          <div className="mt-0.5 text-sm text-muted-foreground">{achievement.description}</div>
        </div>

        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="shrink-0 text-muted-foreground hover:text-foreground"
          aria-label="Close notification"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
