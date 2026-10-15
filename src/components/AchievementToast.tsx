// Achievement unlock notification toast

import { useEffect, useState } from 'react'
import { XIcon } from '@shared/icons'
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
    <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2">
      <div className="flex items-start gap-3 rounded-lg border bg-card px-4 py-3 shadow-lg">
        <div className="flex-1">
          <div className="text-sm text-muted-foreground">Achievement unlocked</div>
          <div className="font-semibold text-foreground">{achievement.name}</div>
          <div className="text-sm text-muted-foreground">{achievement.description}</div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="-mr-2 -mt-1 flex h-11 w-11 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground"
          aria-label="Close notification"
        >
          <XIcon size={18} />
        </button>
      </div>
    </div>
  )
}
