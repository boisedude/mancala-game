// Store component - end zone for captured stones with enhanced 3D carved effect

import { Stone } from './Stone'
import { cn } from '@/lib/utils'
import type { Player } from '@/types/mancala.types'

interface StoreProps {
  stones: number
  player: Player
  isCurrentPlayer: boolean
  label: string
  isReducedMotion?: boolean
}

export function Store({
  stones,
  player,
  isCurrentPlayer,
  label,
  isReducedMotion = false,
}: StoreProps) {
  const isPlayer1 = player === 1

  return (
    <div className="flex flex-col items-center gap-2 md:gap-3">
      {/* Label section */}
      <div className="flex flex-col items-center gap-1">
        <div
          className={cn(
            'text-sm font-bold transition-all duration-300 md:text-base',
            isCurrentPlayer
              ? isPlayer1
                ? 'text-blue-600 dark:text-blue-400 scale-105'
                : 'text-rose-600 dark:text-rose-400 scale-105'
              : 'text-muted-foreground'
          )}
        >
          {label}
        </div>
        <div
          className={cn(
            'text-[10px] font-semibold tracking-wider uppercase transition-colors',
            isCurrentPlayer
              ? isPlayer1
                ? 'text-blue-500 dark:text-blue-500'
                : 'text-rose-500 dark:text-rose-500'
              : 'text-muted-foreground/60'
          )}
        >
          STORE
        </div>
      </div>

      {/* Store container */}
      <div
        className={cn(
          // Base sizing and shape - elongated oval
          'relative h-32 w-20 rounded-[2rem] md:h-40 md:w-24 md:rounded-[2.5rem]',
          // Deep carved effect
          'store-carved',
          // Player-specific gradients with richer colors
          isPlayer1
            ? [
                'bg-gradient-to-b from-blue-200 via-blue-300 to-blue-400',
                'dark:from-blue-800 dark:via-blue-900 dark:to-blue-950',
                'border-3 border-blue-400/60 dark:border-blue-600/60',
              ]
            : [
                'bg-gradient-to-b from-rose-200 via-rose-300 to-rose-400',
                'dark:from-rose-800 dark:via-rose-900 dark:to-rose-950',
                'border-3 border-rose-400/60 dark:border-rose-600/60',
              ],
          // Content layout
          'flex flex-wrap items-center justify-center gap-0.5 p-3',
          // Smooth transitions
          'transition-all duration-500 transform-gpu',
          // Current player highlight with pulse animation
          isCurrentPlayer && [
            'ring-3 ring-offset-2',
            isPlayer1
              ? 'ring-blue-500/70 shadow-blue-500/30 shadow-xl'
              : 'ring-rose-500/70 shadow-rose-500/30 shadow-xl',
            !isReducedMotion && 'animate-store-pulse',
          ]
        )}
        role="status"
        aria-label={`${label} store with ${stones} stones${isCurrentPlayer ? ', currently playing' : ''}`}
        aria-live="polite"
      >
        {/* Inner carved overlay for depth */}
        <div
          className={cn(
            'absolute inset-2 rounded-[1.5rem] md:rounded-[2rem] pointer-events-none',
            'bg-gradient-to-b from-black/5 via-transparent to-white/5'
          )}
        />

        {/* Inner ring for premium feel */}
        <div
          className={cn(
            'absolute inset-3 rounded-[1.25rem] md:rounded-[1.75rem] pointer-events-none',
            isPlayer1
              ? 'border border-blue-400/30 dark:border-blue-500/30'
              : 'border border-rose-400/30 dark:border-rose-500/30'
          )}
        />

        {/* Ambient glow effect */}
        {stones > 0 && (
          <div
            className={cn(
              'absolute inset-4 rounded-[1rem] md:rounded-[1.5rem] blur-xl opacity-30 pointer-events-none',
              isPlayer1 ? 'bg-blue-400' : 'bg-rose-400'
            )}
          />
        )}

        {/* Stones visualization */}
        <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-0.5 overflow-hidden p-3">
          {stones > 0 && stones <= 15 ? (
            // Show individual stones for small counts
            Array.from({ length: stones }).map((_, i) => (
              <Stone
                key={i}
                index={i}
                isReducedMotion={isReducedMotion}
                animationType="drop"
              />
            ))
          ) : stones > 15 ? (
            // Show count for large numbers with enhanced glow
            <div className="relative flex items-center justify-center">
              <span
                className={cn(
                  'text-3xl font-bold md:text-4xl drop-shadow-lg',
                  isPlayer1
                    ? 'text-blue-800 dark:text-blue-200'
                    : 'text-rose-800 dark:text-rose-200'
                )}
              >
                {stones}
              </span>
              {/* Glow behind number */}
              <div
                className={cn(
                  'absolute inset-0 blur-lg rounded-full -z-10 opacity-40',
                  isPlayer1 ? 'bg-blue-400' : 'bg-rose-400'
                )}
              />
            </div>
          ) : null}
        </div>

        {/* Stone count badge - prominent and floating */}
        <div
          className={cn(
            'absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold shadow-xl md:h-12 md:w-12 md:text-base',
            'border-2 transition-all duration-300',
            isPlayer1
              ? [
                  'bg-gradient-to-br from-blue-400 to-blue-600 text-white',
                  'border-blue-300 dark:border-blue-400',
                  isCurrentPlayer && 'scale-110',
                ]
              : [
                  'bg-gradient-to-br from-rose-400 to-rose-600 text-white',
                  'border-rose-300 dark:border-rose-400',
                  isCurrentPlayer && 'scale-110',
                ]
          )}
        >
          {stones}
        </div>

        {/* Victory sparkle decoration when store is winning */}
        {stones >= 25 && !isReducedMotion && (
          <>
            <div
              className={cn(
                'absolute -top-1 -left-1 w-3 h-3 animate-sparkle',
                isPlayer1 ? 'text-blue-300' : 'text-rose-300'
              )}
              style={{ animationDelay: '0s' }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
            </div>
            <div
              className={cn(
                'absolute -bottom-1 -right-1 w-2 h-2 animate-sparkle',
                isPlayer1 ? 'text-blue-400' : 'text-rose-400'
              )}
              style={{ animationDelay: '0.5s' }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
