// Game over dialog: character art, a one-line result, one catchphrase, a stats line

import { memo, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { Player } from '@/types/mancala.types'
import { getRandomCatchphrase } from '@shared/characters'
import type { Character } from '@shared/characters'

interface VictoryDialogProps {
  open: boolean
  onOpenChange?: (open: boolean) => void
  winner: Player | null
  playerScore: number
  aiScore: number
  playerName: string
  moveCount?: number
  gameDuration?: number
  highestCapture?: number
  onNewGame: () => void
  character?: Character
}

const DRAW_LINES = [
  'A tie. Nobody gets the last word.',
  'Dead even. One more?',
  'Nobody wins this one. Try again?',
]

function formatTime(seconds?: number) {
  if (!seconds) return null
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
}

export const VictoryDialog = memo(function VictoryDialog({
  open,
  onOpenChange,
  winner,
  playerScore,
  aiScore,
  playerName,
  moveCount,
  gameDuration,
  highestCapture,
  onNewGame,
  character,
}: VictoryDialogProps) {
  const playerWon = winner === 1
  const isTie = winner === null
  const opponent = character ? character.name : 'Player 2'

  // Picked once when the dialog mounts so the line does not change on re-render
  const [catchphrase] = useState(() => {
    if (isTie) return DRAW_LINES[Math.floor(Math.random() * DRAW_LINES.length)]
    if (!character) return playerWon ? `${playerName} takes it.` : 'Player 2 takes it.'
    return getRandomCatchphrase(character.id, playerWon ? 'playerWins' : 'characterWins')
  })

  const title = isTie
    ? 'Draw'
    : playerWon
      ? character
        ? `You beat ${character.name}`
        : `${playerName} won`
      : `${opponent} won`

  const art = character
    ? isTie
      ? character.playAgainImage
      : playerWon
        ? character.loseImage
        : character.winImage
    : null

  const timeText = formatTime(gameDuration)
  const parts = [`${playerScore} to ${aiScore}`]
  if (moveCount) parts.push(`${moveCount} ${moveCount === 1 ? 'move' : 'moves'}`)
  if (timeText) parts.push(timeText)
  if (highestCapture) parts.push(`best capture ${highestCapture}`)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm" hideClose>
        <DialogHeader className="items-center text-center sm:text-center">
          {art && character && (
            <img
              src={art}
              alt={character.name}
              className="mb-2 max-h-44 w-auto object-contain"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.src = character.avatar
              }}
            />
          )}
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription>{catchphrase}</DialogDescription>
        </DialogHeader>

        <p className="text-center text-sm text-muted-foreground">{parts.join(', ')}</p>

        <DialogFooter className="gap-2 sm:justify-center sm:space-x-0">
          <Button onClick={onNewGame} className="h-11">
            Play again
          </Button>
          <Button onClick={() => onOpenChange?.(false)} variant="ghost" className="h-11">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})
