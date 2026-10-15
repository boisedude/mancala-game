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

  const opponentName =
    gameState.mode === 'vsHuman'
      ? 'Player 2'
      : { easy: 'Bella', medium: 'Coop', hard: 'Bentley' }[gameState.difficulty]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm" hideClose>
        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="text-xl">Welcome back</DialogTitle>
          <DialogDescription>You have an unfinished game. Continue it?</DialogDescription>
        </DialogHeader>

        <div className="space-y-1 text-center text-sm text-muted-foreground">
          <p>
            {playerName} {playerScore}, {opponentName} {aiScore}. {isPlayerTurn ? 'Your turn' : `${opponentName}'s turn`}.
          </p>
          <p>
            {gameState.moveHistory.length} move{gameState.moveHistory.length !== 1 ? 's' : ''} played.
            Saved {dateString}.
          </p>
        </div>

        <DialogFooter className="gap-2 sm:justify-center sm:space-x-0">
          <Button onClick={onContinue} className="h-11">
            Continue game
          </Button>
          <Button onClick={onNewGame} variant="ghost" className="h-11">
            Start new game
          </Button>
        </DialogFooter>

        <p className="text-center text-xs text-muted-foreground">
          Starting a new game discards your saved progress.
        </p>
      </DialogContent>
    </Dialog>
  )
}
