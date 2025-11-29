// Move history visualization panel

import type { GameState } from '@/types/mancala.types'

interface MoveHistoryProps {
  gameState: GameState
  playerName: string
}

export function MoveHistory({ gameState, playerName }: MoveHistoryProps) {
  if (gameState.status === 'setup' || gameState.moveHistory.length === 0) return null

  const getPlayerName = (player: 1 | 2) => {
    if (player === 1) return playerName
    return gameState.mode === 'vsHuman' ? 'Player 2' : 'AI'
  }

  const getMoveLabel = (pitIndex: number) => {
    // P1 pits: 0-5 -> labels 1-6
    // P2 pits: 7-12 -> labels 7-12
    if (pitIndex >= 0 && pitIndex <= 5) return `P${pitIndex + 1}`
    if (pitIndex >= 7 && pitIndex <= 12) return `P${13 - pitIndex}`
    return `Pit ${pitIndex}`
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4">
      <div className="rounded-lg border border-border bg-card/50 backdrop-blur-sm p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-muted-foreground flex items-center gap-2">
          <span>📜</span>
          <span>Move History ({gameState.moveHistory.length} moves)</span>
        </h3>

        <div className="max-h-48 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
          {gameState.moveHistory.map((move, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 rounded-md border p-2 text-sm transition-colors ${
                move.player === 1
                  ? 'border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/30'
                  : 'border-rose-200 bg-rose-50/50 dark:border-rose-900 dark:bg-rose-950/30'
              }`}
            >
              {/* Move number */}
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-background text-xs font-bold tabular-nums">
                {index + 1}
              </div>

              {/* Player indicator */}
              <div
                className={`h-3 w-3 rounded-full ${
                  move.player === 1 ? 'bg-blue-500' : 'bg-rose-500'
                }`}
              />

              {/* Move details */}
              <div className="flex-1">
                <div className="font-medium">
                  {getPlayerName(move.player)}: {getMoveLabel(move.pitIndex)}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {move.extraTurn && (
                    <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 text-primary">
                      <span>🔄</span>
                      <span>Extra Turn</span>
                    </span>
                  )}
                  {move.capturedStones && move.capturedStones > 0 && (
                    <span className="inline-flex items-center gap-1 rounded bg-green-500/10 px-1.5 py-0.5 text-green-600 dark:text-green-400">
                      <span>💎</span>
                      <span>Captured {move.capturedStones}</span>
                    </span>
                  )}
                  {!move.extraTurn && !move.capturedStones && (
                    <span className="text-muted-foreground/60">Regular move</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        {gameState.moveHistory.length > 5 && (
          <div className="mt-2 text-center text-xs text-muted-foreground">
            Scroll to see all moves
          </div>
        )}
      </div>
    </div>
  )
}
