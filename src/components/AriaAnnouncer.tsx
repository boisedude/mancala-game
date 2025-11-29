// AriaAnnouncer component - provides screen reader announcements for game events

import { useEffect, useRef } from 'react'

export interface AriaAnnouncerProps {
  message: string
  priority?: 'polite' | 'assertive'
}

/**
 * AriaAnnouncer - ARIA live region component for screen reader announcements
 *
 * Announces game events to screen reader users:
 * - Current player turn
 * - Move results (captured stones, extra turns)
 * - Game winner
 *
 * Uses polite announcements for non-critical info and assertive for game-ending events
 */
export function AriaAnnouncer({ message, priority = 'polite' }: AriaAnnouncerProps) {
  const liveRegionRef = useRef<HTMLDivElement>(null)
  const previousMessageRef = useRef<string>('')

  useEffect(() => {
    // Only announce if message has changed
    if (message && message !== previousMessageRef.current) {
      previousMessageRef.current = message

      // Clear the live region first to ensure the announcement is picked up
      if (liveRegionRef.current) {
        liveRegionRef.current.textContent = ''

        // Use a small delay to ensure screen readers detect the change
        setTimeout(() => {
          if (liveRegionRef.current) {
            liveRegionRef.current.textContent = message
          }
        }, 100)
      }
    }
  }, [message])

  return (
    <div
      ref={liveRegionRef}
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    />
  )
}
