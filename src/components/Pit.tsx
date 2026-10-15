// Pit: an oval cut into the wood, stones inside, the count as a quiet number below

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
  previewStoneCount?: number
  isLastPit?: boolean
  isReducedMotion?: boolean
  isKeyboardActive?: boolean
}

const MAX_VISIBLE_STONES = 14

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
  previewStoneCount = 0,
  isLastPit = false,
  isReducedMotion = false,
  isKeyboardActive = false,
}: PitProps) {
  const previewing = isPreviewActive && willReceiveStone

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => onHover?.(pitIndex)}
      onMouseLeave={() => onHover?.(null)}
      disabled={!isClickable}
      className={cn(
        'group flex min-h-11 w-full min-w-0 flex-col items-center gap-1 rounded-md bg-transparent p-0 outline-none',
        isClickable ? 'cursor-pointer touch-manipulation' : 'cursor-default'
      )}
      aria-label={`Pit ${label ?? pitIndex + 1} with ${stones} stones${isClickable ? ', click to play' : ', not playable'}`}
      aria-disabled={!isClickable}
      tabIndex={isClickable ? 0 : -1}
    >
      <span
        className={cn(
          'relative flex aspect-[4/5] w-full flex-wrap content-center items-center justify-center gap-[2px] overflow-hidden rounded-[50%] p-[18%] sm:gap-1',
          'bg-[#4a3019] shadow-[inset_0_4px_8px_rgba(0,0,0,0.6),inset_0_-1px_0_rgba(255,255,255,0.07)]',
          'ring-0 ring-primary transition-shadow',
          isClickable && isHighlighted && 'ring-1',
          isClickable && 'group-hover:ring-2 group-focus-visible:ring-2',
          isKeyboardActive && 'ring-2',
          !isClickable && previewing && 'ring-1 ring-primary/40',
          isPreviewActive && isLastPit && 'ring-2'
        )}
      >
        {Array.from({ length: Math.min(stones, MAX_VISIBLE_STONES) }).map((_, i) => (
          <Stone key={i} index={i} isReducedMotion={isReducedMotion} />
        ))}
      </span>
      <span className="text-xs tabular-nums text-foreground/75 sm:text-sm">
        {stones}
        {previewing && previewStoneCount > 0 && <span className="text-primary"> +{previewStoneCount}</span>}
      </span>
    </button>
  )
}
