// Store component - end zone for captured stones

import { Stone } from './Stone'
import { cn } from '@/lib/utils'
import type { Player } from '@/types/mancala.types'

interface StoreProps {
  stones: number
  player: Player
  isCurrentPlayer: boolean
  label: string
}

export function Store({ stones, player, isCurrentPlayer, label }: StoreProps) {
  return (
    <div className="flex flex-col items-center gap-2 md:gap-3">
      <div className="flex flex-col items-center gap-1">
        <div
          className={cn(
            'text-sm font-bold transition-colors md:text-base',
            isCurrentPlayer ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          {label}
        </div>
        <div className="text-xs text-muted-foreground font-medium">
          STORE
        </div>
      </div>
      <div
        className={cn(
          'relative h-32 w-20 rounded-3xl md:h-40 md:w-24',
          'border-4 bg-gradient-to-br shadow-lg',
          player === 1
            ? 'border-blue-300 from-blue-100 to-blue-200 dark:border-blue-700 dark:from-blue-900 dark:to-blue-950'
            : 'border-rose-300 from-rose-100 to-rose-200 dark:border-rose-700 dark:from-rose-900 dark:to-rose-950',
          'flex flex-wrap items-center justify-center gap-0.5 p-3',
          'transition-all duration-500',
          isCurrentPlayer && 'ring-2 ring-primary/60 ring-offset-1 shadow-xl'
        )}
        role="status"
        aria-label={`${label} store with ${stones} stones${isCurrentPlayer ? ', currently playing' : ''}`}
        aria-live="polite"
      >
        {/* Stones visualization */}
        <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-0.5 overflow-hidden p-3">
          {stones > 0 && stones <= 15 ? (
            // Show individual stones for small counts
            Array.from({ length: stones }).map((_, i) => <Stone key={i} index={i} />)
          ) : stones > 15 ? (
            // Show count for large numbers
            <div
              className={cn(
                'text-3xl font-bold md:text-4xl',
                player === 1
                  ? 'text-blue-800 dark:text-blue-200'
                  : 'text-rose-800 dark:text-rose-200'
              )}
            >
              {stones}
            </div>
          ) : null}
        </div>

        {/* Stone count badge */}
        <div
          className={cn(
            'absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold shadow-lg md:h-12 md:w-12 md:text-base',
            player === 1 ? 'bg-blue-500 text-white' : 'bg-rose-500 text-white'
          )}
        >
          {stones}
        </div>
      </div>
    </div>
  )
}
