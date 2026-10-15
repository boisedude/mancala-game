// Store: a tall oval at the end of the board, stones inside, the count below them

import { Stone } from './Stone'
import { cn } from '@/lib/utils'
import type { Player } from '@/types/mancala.types'

interface StoreProps {
  stones: number
  player: Player
  isCurrentPlayer: boolean
  label: string
  isReducedMotion?: boolean
  className?: string
}

const MAX_VISIBLE_STONES = 30

export function Store({
  stones,
  player,
  isCurrentPlayer,
  label,
  isReducedMotion = false,
  className,
}: StoreProps) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col items-center justify-between overflow-hidden rounded-[999px] px-[3px] pb-2 pt-3',
        'bg-[#4a3019] shadow-[inset_0_6px_12px_rgba(0,0,0,0.6),inset_0_-1px_0_rgba(255,255,255,0.07)]',
        className
      )}
      data-player={player}
      role="status"
      aria-label={`${label} store with ${stones} stones${isCurrentPlayer ? ', currently playing' : ''}`}
    >
      <div className="flex min-h-0 flex-1 flex-wrap content-start items-start justify-center gap-[2px] overflow-hidden sm:gap-1">
        {Array.from({ length: Math.min(stones, MAX_VISIBLE_STONES) }).map((_, i) => (
          <Stone key={i} index={i} isReducedMotion={isReducedMotion} />
        ))}
      </div>
      <span className="pt-1 text-xs tabular-nums text-foreground/75 sm:text-sm">{stones}</span>
    </div>
  )
}
