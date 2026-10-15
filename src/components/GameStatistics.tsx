// One muted line of running game statistics

import { useMemo, useState, useEffect } from 'react'
import type { GameState } from '@/types/mancala.types'

interface GameStatisticsProps {
  gameState: GameState
  gameStartTime: number
  highestCaptureThisGame: number
}

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function GameStatistics({
  gameState,
  gameStartTime,
  highestCaptureThisGame,
}: GameStatisticsProps) {
  const [currentTime, setCurrentTime] = useState(() => Date.now())

  // Tick once a second while the game is on
  useEffect(() => {
    if (gameState.status !== 'playing') return
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [gameState.status])

  const gameDuration =
    gameState.status === 'playing' || gameState.status === 'finished'
      ? Math.max(0, Math.floor((currentTime - gameStartTime) / 1000))
      : 0

  const { extraTurns, captures, captured } = useMemo(() => {
    let extra = 0
    let count = 0
    let total = 0
    for (const move of gameState.moveHistory) {
      if (move.extraTurn) extra++
      if (move.capturedStones && move.capturedStones > 0) {
        count++
        total += move.capturedStones
      }
    }
    return { extraTurns: extra, captures: count, captured: total }
  }, [gameState.moveHistory])

  if (gameState.status === 'setup') return null

  const moves = gameState.moveHistory.length
  return (
    <p className="text-center text-sm text-muted-foreground">
      {formatDuration(gameDuration)}, {moves} {moves === 1 ? 'move' : 'moves'}, {extraTurns} extra{' '}
      {extraTurns === 1 ? 'turn' : 'turns'}, {captures} {captures === 1 ? 'capture' : 'captures'} (
      {captured} {captured === 1 ? 'stone' : 'stones'}), best capture {highestCaptureThisGame}
    </p>
  )
}
