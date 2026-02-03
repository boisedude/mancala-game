// Pit component - individual playing pit with enhanced 3D carved effect

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
    <div className="flex flex-col items-center gap-1 md:gap-2 group relative">
      {label && (
        <div className="text-xs font-medium text-muted-foreground opacity-50 transition-opacity group-hover:opacity-80">
          {label}
        </div>
      )}

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
          // Base sizing and shape
          'relative h-20 w-20 rounded-[1.25rem] md:h-24 md:w-24 md:rounded-[1.5rem]',
          // Premium carved pit effect with wood tones
          'bg-gradient-to-br from-amber-200 via-amber-300 to-amber-400',
          'dark:from-amber-800 dark:via-amber-900 dark:to-amber-950',
          // Deep carved shadow effect
          'pit-carved',
          // Border styling
          'border-2 border-amber-400/50 dark:border-amber-700/50',
          // Content layout
          'flex flex-wrap items-center justify-center gap-0.5 p-2',
          // Smooth transitions
          'transition-all duration-300 ease-out transform-gpu',
          // Focus styling
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          // Clickable state animations
          isClickable &&
            !isReducedMotion &&
            `cursor-pointer touch-manipulation
             hover:scale-105 hover:border-primary hover:shadow-xl
             hover:shadow-primary/25 active:scale-95`,
          isClickable &&
            isReducedMotion &&
            'cursor-pointer touch-manipulation hover:border-primary hover:shadow-xl hover:shadow-primary/25',
          // Highlighted state (valid move)
          isHighlighted && [
            'ring-2 ring-primary/70 ring-offset-2 shadow-lg',
            !isReducedMotion && 'animate-pit-glow',
          ],
          // Disabled states
          !isClickable && stones === 0 && 'cursor-not-allowed opacity-40',
          !isClickable && stones > 0 && 'cursor-not-allowed opacity-60 grayscale-[30%]',
          // Preview states
          isPreviewActive && willReceiveStone && [
            'ring-2 ring-blue-400/60 shadow-blue-400/30 shadow-lg',
            'bg-gradient-to-br from-blue-100/20 via-amber-200 to-amber-300',
            'dark:from-blue-900/20 dark:via-amber-800 dark:to-amber-900',
          ],
          isPreviewActive && isLastPit && [
            'ring-2 ring-green-500/70 ring-offset-2 shadow-green-500/40 shadow-xl',
            'bg-gradient-to-br from-green-100/30 via-amber-200 to-amber-300',
            'dark:from-green-900/30 dark:via-amber-800 dark:to-amber-900',
          ],
          // Keyboard navigation
          isKeyboardActive && 'ring-2 ring-yellow-400/80 ring-offset-2 dark:ring-yellow-500/80'
        )}
        aria-label={`Pit ${pitIndex + 1} with ${stones} stones${isClickable ? ', click to play' : ', not playable'}`}
        aria-disabled={!isClickable}
        tabIndex={isClickable ? 0 : -1}
      >
        {/* Inner carved effect overlay */}
        <div className="absolute inset-1 rounded-[1rem] md:rounded-[1.25rem] bg-gradient-to-br from-black/5 via-transparent to-white/5 pointer-events-none" />

        {/* Subtle inner ring for depth */}
        <div className="absolute inset-1.5 rounded-[0.875rem] md:rounded-[1.125rem] border border-amber-500/20 dark:border-amber-600/20 pointer-events-none" />

        {/* Stones visualization */}
        <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-0.5 overflow-hidden p-2.5">
          {stones > 0 && stones <= 12 ? (
            // Show individual stones for small counts
            Array.from({ length: stones }).map((_, i) => (
              <Stone
                key={i}
                index={i}
                isReducedMotion={isReducedMotion}
                animationType={isPreviewActive && willReceiveStone ? 'land' : 'drop'}
              />
            ))
          ) : stones > 12 ? (
            // Show count for large numbers with enhanced styling
            <div className="relative">
              <span className="text-2xl font-bold text-amber-800/90 dark:text-amber-200/90 md:text-3xl drop-shadow-sm">
                {stones}
              </span>
              {/* Glow effect for large numbers */}
              <div className="absolute inset-0 blur-md bg-amber-500/20 rounded-full -z-10" />
            </div>
          ) : null}
        </div>

        {/* Stone count badge - enhanced */}
        {stones > 0 && stones <= 12 && (
          <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-xs font-bold text-primary-foreground shadow-lg md:h-7 md:w-7 md:text-sm border border-primary-foreground/20">
            {stones}
          </div>
        )}

        {/* Empty pit indicator - more subtle */}
        {stones === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-amber-600/40 dark:text-amber-400/30">
              Empty
            </span>
          </div>
        )}

        {/* Ambient highlight effect on hover */}
        {isClickable && (
          <div className="absolute inset-0 rounded-[1.25rem] md:rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-t from-transparent via-transparent to-white/10" />
        )}
      </button>
    </div>
  )
}
