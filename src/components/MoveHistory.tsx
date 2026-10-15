// Move history visualization panel

import type { GameState } from '@/types/mancala.types'

interface MoveHistoryProps {
  gameState: GameState
  playerName: string
  opponentName: string
}

export function MoveHistory({ gameState, playerName, opponentName }: MoveHistoryProps) {
  if (gameState.status === 'setup' || gameState.moveHistory.length === 0) return null

  const getPlayerName = (player: 1 | 2) => {
    if (player === 1) return playerName
    return gameState.mode === 'vsHuman' ? 'Player 2' : opponentName
  }

  const getMoveLabel = (pitIndex: number) => {
    // P1 pits: 0-5 -> labels 1-6
    // P2 pits: 7-12 -> labels 7-12
    if (pitIndex >= 0 && pitIndex <= 5) return `P${pitIndex + 1}`
    if (pitIndex >= 7 && pitIndex <= 12) return `P${13 - pitIndex}`
    return `Pit ${pitIndex}`
  }

  return (
    <div className="w-full max-w-[min(640px,calc(100dvw-2rem))]">
      <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
        Move history ({gameState.moveHistory.length})
      </h3>
      <ol className="max-h-48 space-y-1 overflow-y-auto rounded-lg border bg-card p-3 text-sm">
        {gameState.moveHistory.map((move, index) => (
          <li key={index} className="flex gap-3 tabular-nums">
            <span className="w-6 text-right text-muted-foreground">{index + 1}</span>
            <span>
              {getPlayerName(move.player)}: {getMoveLabel(move.pitIndex)}
              {move.extraTurn && <span className="text-muted-foreground">, go again</span>}
              {move.capturedStones ? (
                <span className="text-muted-foreground">, captured {move.capturedStones}</span>
              ) : null}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
