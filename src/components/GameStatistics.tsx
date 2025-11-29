// Game statistics panel showing real-time stats

import { useMemo, useState, useEffect } from 'react'
import type { GameState } from '@/types/mancala.types'

interface GameStatisticsProps {
  gameState: GameState
  gameStartTime: number
  highestCaptureThisGame: number
}

export function GameStatistics({
  gameState,
  gameStartTime,
  highestCaptureThisGame,
}: GameStatisticsProps) {
  const [currentTime, setCurrentTime] = useState(() => Date.now())

  // Update time every second when game is active
  useEffect(() => {
    if (gameState.status !== 'playing' && gameState.status !== 'finished') return

    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)

    return () => clearInterval(interval)
  }, [gameState.status])

  const gameDuration = useMemo(() => {
    if (gameState.status !== 'playing' && gameState.status !== 'finished') return 0
    return Math.floor((currentTime - gameStartTime) / 1000)
  }, [gameState.status, gameStartTime, currentTime])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const moveCount = gameState.moveHistory.length

  const extraTurnCount = useMemo(() => {
    return gameState.moveHistory.filter(move => move.extraTurn).length
  }, [gameState.moveHistory])

  const captureCount = useMemo(() => {
    return gameState.moveHistory.filter(move => move.capturedStones && move.capturedStones > 0)
      .length
  }, [gameState.moveHistory])

  const totalStonesCaptured = useMemo(() => {
    return gameState.moveHistory.reduce((sum, move) => sum + (move.capturedStones || 0), 0)
  }, [gameState.moveHistory])

  if (gameState.status === 'setup') return null

  return (
    <div className="mx-auto w-full max-w-4xl px-4">
      <div className="rounded-lg border border-border bg-card/50 backdrop-blur-sm p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Game Statistics</h3>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {/* Duration */}
          <div className="text-center">
            <div className="text-2xl font-bold tabular-nums text-foreground">
              {formatDuration(gameDuration)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Duration</div>
          </div>

          {/* Move Count */}
          <div className="text-center">
            <div className="text-2xl font-bold tabular-nums text-foreground">{moveCount}</div>
            <div className="text-xs text-muted-foreground mt-1">Moves</div>
          </div>

          {/* Extra Turns */}
          <div className="text-center">
            <div className="text-2xl font-bold tabular-nums text-primary">{extraTurnCount}</div>
            <div className="text-xs text-muted-foreground mt-1">Extra Turns</div>
          </div>

          {/* Captures */}
          <div className="text-center">
            <div className="text-2xl font-bold tabular-nums text-green-600 dark:text-green-400">
              {captureCount}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Captures</div>
          </div>

          {/* Total Stones Captured */}
          <div className="text-center">
            <div className="text-2xl font-bold tabular-nums text-green-600 dark:text-green-400">
              {totalStonesCaptured}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Total Captured</div>
          </div>

          {/* Highest Single Capture */}
          <div className="text-center">
            <div className="text-2xl font-bold tabular-nums text-amber-600 dark:text-amber-400">
              {highestCaptureThisGame}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Best Capture</div>
          </div>
        </div>
      </div>
    </div>
  )
}
