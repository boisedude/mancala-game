// Pit component - individual playing pit

import { Stone } from './Stone'
import { cn } from '@/lib/utils'

interface PitProps {
  stones: number
  pitIndex: number
  isClickable: boolean
  isHighlighted: boolean
  onClick: () => void
  onHover?: (pitIndex: number | null) => void
  label?: string
  isPreviewActive?: boolean
  willReceiveStone?: boolean
  isLastPit?: boolean
  isReducedMotion?: boolean
  isKeyboardActive?: boolean
}

export function Pit({
  stones,
  pitIndex,
  isClickable,
  isHighlighted,
  onClick,
  onHover,
  label,
  isPreviewActive = false,
  willReceiveStone = false,
  isLastPit = false,
  isReducedMotion = false,
  isKeyboardActive = false,
}: PitProps) {
  return (
    <div className="flex flex-col items-center gap-1 md:gap-2 group">
      {label && <div className="text-xs font-medium text-muted-foreground opacity-50">{label}</div>}

      {/* Hover hint for clickable pits */}
      {isClickable && isHighlighted && (
        <div className="absolute -top-6 z-10 hidden group-hover:block">
          <div className="rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground shadow-lg whitespace-nowrap">
            Click to play
          </div>
        </div>
      )}

      <button
        onClick={onClick}
        onMouseEnter={() => onHover?.(pitIndex)}
        onMouseLeave={() => onHover?.(null)}
        disabled={!isClickable}
        className={cn(
          'relative h-20 w-20 rounded-2xl md:h-24 md:w-24',
          'bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-950',
          'border-2 shadow-inner',
          'flex flex-wrap items-center justify-center gap-0.5 p-2',
          'transition-all duration-300 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          isClickable &&
            !isReducedMotion &&
            'cursor-pointer touch-manipulation hover:scale-105 hover:border-primary hover:shadow-lg hover:shadow-primary/20 active:scale-95 active:shadow-inner',
          isClickable &&
            isReducedMotion &&
            'cursor-pointer touch-manipulation hover:border-primary hover:shadow-lg hover:shadow-primary/20 active:shadow-inner',
          isHighlighted && 'ring-2 ring-primary/60 ring-offset-1 shadow-lg',
          !isClickable && stones === 0 && 'cursor-not-allowed opacity-40',
          !isClickable && stones > 0 && 'cursor-not-allowed opacity-60 grayscale',
          isClickable
            ? 'border-amber-300 dark:border-amber-700'
            : 'border-amber-200 dark:border-amber-800',
          isPreviewActive && willReceiveStone && 'ring-2 ring-blue-400/50 shadow-blue-400/20 shadow-md',
          isPreviewActive && isLastPit && 'ring-2 ring-green-500/60 ring-offset-1 shadow-green-500/30 shadow-lg',
          isKeyboardActive && 'ring-2 ring-yellow-400/70 ring-offset-1 dark:ring-yellow-500/70'
        )}
        aria-label={`Pit ${pitIndex + 1} with ${stones} stones${isClickable ? ', click to play' : ', not playable'}`}
        aria-disabled={!isClickable}
        tabIndex={isClickable ? 0 : -1}
      >
        {/* Stones visualization */}
        <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-0.5 overflow-hidden p-2">
          {stones > 0 && stones <= 12 ? (
            // Show individual stones for small counts
            Array.from({ length: stones }).map((_, i) => (
              <Stone key={i} index={i} isReducedMotion={isReducedMotion} />
            ))
          ) : stones > 12 ? (
            // Show count for large numbers
            <div className="text-2xl font-bold text-amber-800 dark:text-amber-200 md:text-3xl">
              {stones}
            </div>
          ) : null}
        </div>

        {/* Stone count badge - only show for small counts, hide when number is already displayed */}
        {stones > 0 && stones <= 12 && (
          <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-md md:h-7 md:w-7 md:text-sm">
            {stones}
          </div>
        )}

        {/* Empty pit indicator */}
        {stones === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-muted-foreground/30">
            Empty
          </div>
        )}
      </button>
    </div>
  )
}
