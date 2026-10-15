// Game controls: one primary button, the rest outline or ghost

import { memo } from 'react'
import { Button } from '@/components/ui/button'
import type { GameStatus, GameMode } from '@/types/mancala.types'

interface GameControlsProps {
  gameStatus: GameStatus
  gameMode: GameMode
  opponentName: string
  onNewGame: () => void
  onModeChange: (mode: GameMode) => void
  onShowLeaderboard: () => void
  onShowHowToPlay: () => void
  onShowSettings?: () => void
  onUndo?: () => void
  canUndo?: boolean
}

export const GameControls = memo(function GameControls({
  gameStatus,
  gameMode,
  opponentName,
  onNewGame,
  onModeChange,
  onShowLeaderboard,
  onShowHowToPlay,
  onShowSettings,
  onUndo,
  canUndo = false,
}: GameControlsProps) {
  const isSetup = gameStatus === 'setup'
  return (
    <div className="arcade-controls">
      <Button onClick={onNewGame} className="h-11 px-4" aria-label={isSetup ? 'Start a new game' : 'Restart the game'}>
        {isSetup ? 'Start game' : 'New game'}
      </Button>

      {onUndo && gameStatus === 'playing' && (
        <Button
          onClick={onUndo}
          variant="outline"
          disabled={!canUndo}
          className="h-11 px-4"
          aria-label="Undo last move"
        >
          Undo
        </Button>
      )}

      <Button onClick={onShowLeaderboard} variant="outline" className="h-11 px-4">
        Stats
      </Button>

      <Button onClick={onShowHowToPlay} variant="outline" className="h-11 px-4">
        How to play
      </Button>

      {onShowSettings && (
        <Button onClick={onShowSettings} variant="ghost" className="h-11 px-4">
          Settings
        </Button>
      )}

      <Button
        onClick={() => onModeChange(gameMode === 'vsAI' ? 'vsHuman' : 'vsAI')}
        variant="ghost"
        className="h-11 px-4"
      >
        {gameMode === 'vsAI' ? 'Two players' : `Play ${opponentName}`}
      </Button>
    </div>
  )
})
