// Continue Game Dialog - appears when a saved game is detected

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { P1_STORE, P2_STORE } from '@/lib/mancalaRules'
import type { SavedGame } from '@/hooks/useGamePersistence'
import { PlayIcon, ReloadIcon, CalendarIcon } from '@radix-ui/react-icons'

interface ContinueGameDialogProps {
  open: boolean
  onOpenChange?: (open: boolean) => void
  savedGame: SavedGame | null
  playerName: string
  onContinue: () => void
  onNewGame: () => void
}

export function ContinueGameDialog({
  open,
  onOpenChange,
  savedGame,
  playerName,
  onContinue,
  onNewGame,
}: ContinueGameDialogProps) {
  if (!savedGame) return null

  const { gameState, savedAt } = savedGame
  const playerScore = gameState.board.pits[P1_STORE]
  const aiScore = gameState.board.pits[P2_STORE]
  const isPlayerTurn = gameState.currentPlayer === 1

  // Format saved date
  const savedDate = new Date(savedAt)
  const now = new Date()
  const isToday = savedDate.toDateString() === now.toDateString()
  const isYesterday =
    savedDate.toDateString() === new Date(now.getTime() - 86400000).toDateString()

  let dateString: string
  if (isToday) {
    dateString = `Today at ${savedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  } else if (isYesterday) {
    dateString = `Yesterday at ${savedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  } else {
    dateString = savedDate.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Format difficulty label
  const difficultyLabel =
    gameState.difficulty.charAt(0).toUpperCase() + gameState.difficulty.slice(1)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Welcome Back!</DialogTitle>
          <DialogDescription className="text-center text-base">
            You have an unfinished game. Would you like to continue?
          </DialogDescription>
        </DialogHeader>

        {/* Saved Game Info */}
        <div className="space-y-4 rounded-lg border bg-gradient-to-br from-amber-50/50 to-orange-50/50 p-4 dark:from-amber-950/20 dark:to-orange-950/20">
          {/* Date Saved */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            <span>Saved {dateString}</span>
          </div>

          {/* Current Score */}
          <div className="flex items-center justify-around">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {playerScore}
              </div>
              <div className="mt-1 text-sm font-medium">{playerName}</div>
            </div>

            <div className="text-2xl font-bold text-muted-foreground">-</div>

            <div className="text-center">
              <div className="text-3xl font-bold text-rose-600 dark:text-rose-400">{aiScore}</div>
              <div className="mt-1 text-sm font-medium">AI ({difficultyLabel})</div>
            </div>
          </div>

          {/* Current Turn */}
          <div className="rounded-md bg-card/80 px-3 py-2 text-center">
            <p className="text-sm font-medium">
              {isPlayerTurn ? (
                <>
                  <span className="text-blue-600 dark:text-blue-400">Your turn</span>
                </>
              ) : (
                <>
                  <span className="text-rose-600 dark:text-rose-400">AI's turn</span>
                </>
              )}
            </p>
          </div>

          {/* Move Count */}
          <div className="text-center text-xs text-muted-foreground">
            {gameState.moveHistory.length} move{gameState.moveHistory.length !== 1 ? 's' : ''}{' '}
            played
          </div>
        </div>

        {/* Action Buttons */}
        <DialogFooter className="gap-2 sm:flex-col">
          <Button onClick={onContinue} size="lg" className="w-full gap-2">
            <PlayIcon className="h-4 w-4" />
            Continue Game
          </Button>
          <Button onClick={onNewGame} variant="outline" size="lg" className="w-full gap-2">
            <ReloadIcon className="h-4 w-4" />
            Start New Game
          </Button>
        </DialogFooter>

        {/* Info Message */}
        <p className="text-center text-xs text-muted-foreground">
          Starting a new game will discard your saved progress
        </p>
      </DialogContent>
    </Dialog>
  )
}
