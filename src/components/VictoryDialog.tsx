// Victory dialog - celebrates win/loss

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
import { ReloadIcon, Share1Icon } from '@radix-ui/react-icons'
import { VictoryGraphic, DefeatGraphic } from '@/components/graphics'
import { Character, getRandomCatchphrase } from '@shared/characters'

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
  onShare: () => void
  character?: Character
}

export function VictoryDialog({
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
  onShare,
  character,
}: VictoryDialogProps) {
  const playerWon = winner === 1
  const isTie = winner === null

  // Get character-specific catchphrase
  const characterCatchphrase = character
    ? playerWon
      ? getRandomCatchphrase(character.id, 'playerWins')
      : getRandomCatchphrase(character.id, 'characterWins')
    : null

  const title = isTie ? "It's a Tie!" : playerWon ? '🎉 Victory!' : 'Game Over'
  const description = isTie
    ? 'What an evenly matched game!'
    : characterCatchphrase
      ? characterCatchphrase
      : playerWon
        ? `Congratulations ${playerName}, you won!`
        : 'Better luck next time!'

  const bgGradient = isTie
    ? 'from-yellow-500/20 to-orange-500/20'
    : playerWon
      ? 'from-green-500/20 to-emerald-500/20'
      : 'from-red-500/20 to-rose-500/20'

  const formatTime = (seconds?: number) => {
    if (!seconds) return 'N/A'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
  }

  const scoreDifference = Math.abs(playerScore - aiScore)
  const efficiency = moveCount ? ((playerScore / moveCount) * 100).toFixed(1) : 'N/A'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          {/* Victory/Defeat Graphic or Character Image */}
          <div className="flex justify-center py-4">
            {character ? (
              <img
                src={playerWon ? character.loseImage : character.winImage}
                alt={playerWon ? `${character.name} loses` : `${character.name} wins`}
                className="max-h-40 w-auto object-contain"
              />
            ) : playerWon ? (
              <VictoryGraphic size={120} animated={true} />
            ) : (
              <DefeatGraphic size={120} />
            )}
          </div>
          <DialogTitle className="text-center text-3xl">{title}</DialogTitle>
          <DialogDescription className="text-center text-base">{description}</DialogDescription>
        </DialogHeader>

        {/* Score Display */}
        <div className={`rounded-lg bg-gradient-to-br p-6 ${bgGradient}`}>
          <div className="flex items-center justify-around">
            {/* Player Score */}
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {playerScore}
              </div>
              <div className="mt-2 text-sm font-medium">{playerName}</div>
            </div>

            {/* Separator */}
            <div className="text-3xl font-bold text-muted-foreground">-</div>

            {/* AI Score */}
            <div className="text-center">
              <div className="text-4xl font-bold text-rose-600 dark:text-rose-400">{aiScore}</div>
              <div className="mt-2 text-sm font-medium">
                {character ? `${character.emoji} ${character.name}` : 'AI'}
              </div>
            </div>
          </div>
        </div>

        {/* Victory Message */}
        {playerWon && (
          <div className="space-y-2 py-4 text-center">
            <p className="text-lg font-semibold">Great job!</p>
            <p className="text-sm text-muted-foreground">
              You captured {playerScore} stones and outwitted the AI!
            </p>
          </div>
        )}

        {/* Post-Game Analysis */}
        {(moveCount || gameDuration || highestCapture) && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Game Statistics</h3>
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/50 p-3">
              {moveCount && (
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">{moveCount}</div>
                  <div className="text-xs text-muted-foreground">Total Moves</div>
                </div>
              )}
              {gameDuration && (
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">{formatTime(gameDuration)}</div>
                  <div className="text-xs text-muted-foreground">Game Time</div>
                </div>
              )}
              {highestCapture && highestCapture > 0 && (
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">{highestCapture}</div>
                  <div className="text-xs text-muted-foreground">Biggest Capture</div>
                </div>
              )}
              <div className="text-center">
                <div className="text-lg font-bold text-primary">{scoreDifference}</div>
                <div className="text-xs text-muted-foreground">Victory Margin</div>
              </div>
            </div>

            {/* Performance Insights */}
            <div className="space-y-1 rounded-lg bg-primary/5 p-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Efficiency</span>
                <span className="font-semibold">{efficiency}% per move</span>
              </div>
              {highestCapture && highestCapture >= 10 && (
                <p className="text-green-600 dark:text-green-400">
                  ⭐ Excellent capture strategy!
                </p>
              )}
              {gameDuration && gameDuration < 120 && playerWon && (
                <p className="text-blue-600 dark:text-blue-400">
                  ⚡ Lightning-fast victory!
                </p>
              )}
              {scoreDifference >= 15 && playerWon && (
                <p className="text-purple-600 dark:text-purple-400">
                  💪 Dominant performance!
                </p>
              )}
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:flex-col">
          <Button onClick={onNewGame} size="lg" className="w-full gap-2">
            <ReloadIcon className="h-4 w-4" />
            Play Again
          </Button>
          <Button onClick={onShare} variant="outline" size="lg" className="w-full gap-2">
            <Share1Icon className="h-4 w-4" />
            Share Result
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
