// Game controls - new game, difficulty, settings

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Difficulty, GameStatus, GameMode } from '@/types/mancala.types'
import { ReloadIcon, PlayIcon, BarChartIcon, CounterClockwiseClockIcon, QuestionMarkCircledIcon, GearIcon } from '@radix-ui/react-icons'

interface GameControlsProps {
  difficulty: Difficulty
  gameStatus: GameStatus
  gameMode: GameMode
  onNewGame: () => void
  onDifficultyChange: (difficulty: Difficulty) => void
  onModeChange: (mode: GameMode) => void
  onShowLeaderboard: () => void
  onShowHowToPlay: () => void
  onShowSettings?: () => void
  onUndo?: () => void
  canUndo?: boolean
}

export function GameControls({
  difficulty,
  gameStatus,
  gameMode,
  onNewGame,
  onDifficultyChange,
  onModeChange,
  onShowLeaderboard,
  onShowHowToPlay,
  onShowSettings,
  onUndo,
  canUndo = false,
}: GameControlsProps) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-center gap-3 px-4 md:gap-4">
      {/* New Game Button */}
      <Button
        onClick={onNewGame}
        size="lg"
        className="w-full gap-2 sm:w-auto"
        aria-label={gameStatus === 'setup' ? 'Start a new game' : 'Restart the game'}
      >
        {gameStatus === 'setup' ? (
          <>
            <PlayIcon className="h-4 w-4" />
            Start Game
          </>
        ) : (
          <>
            <ReloadIcon className="h-4 w-4" />
            New Game
          </>
        )}
      </Button>

      {/* Undo Button */}
      {onUndo && gameStatus === 'playing' && (
        <Button
          onClick={onUndo}
          size="lg"
          variant="outline"
          disabled={!canUndo}
          className="w-full gap-2 sm:w-auto"
          aria-label="Undo last move"
        >
          <CounterClockwiseClockIcon className="h-4 w-4" />
          Undo
        </Button>
      )}

      {/* Game Mode Selector */}
      <div className="flex w-full items-center gap-2 sm:w-auto">
        <label htmlFor="mode" className="whitespace-nowrap text-sm font-medium">
          Mode:
        </label>
        <Select value={gameMode} onValueChange={onModeChange}>
          <SelectTrigger id="mode" className="w-full sm:w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vsAI">vs AI</SelectItem>
            <SelectItem value="vsHuman">vs Human</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Difficulty Selector - only show for AI mode */}
      {gameMode === 'vsAI' && (
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <label htmlFor="difficulty" className="whitespace-nowrap text-sm font-medium">
            Opponent:
          </label>
          <Select value={difficulty} onValueChange={onDifficultyChange}>
            <SelectTrigger id="difficulty" className="w-full sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">🐕 Bella - The Playful Pup</SelectItem>
              <SelectItem value="medium">🎮 Coop - Casual Challenger</SelectItem>
              <SelectItem value="hard">🐺 Bentley - The Mastermind</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Leaderboard Button */}
      <Button
        onClick={onShowLeaderboard}
        variant="outline"
        size="lg"
        className="w-full gap-2 sm:w-auto"
      >
        <BarChartIcon className="h-4 w-4" />
        Stats
      </Button>

      {/* How to Play Button */}
      <Button
        onClick={onShowHowToPlay}
        variant="outline"
        size="lg"
        className="w-full gap-2 sm:w-auto"
        aria-label="Show game rules and instructions"
      >
        <QuestionMarkCircledIcon className="h-4 w-4" />
        How to Play
      </Button>

      {/* Settings Button */}
      {onShowSettings && (
        <Button
          onClick={onShowSettings}
          variant="outline"
          size="lg"
          className="w-full gap-2 sm:w-auto"
          aria-label="Open game settings"
        >
          <GearIcon className="h-4 w-4" />
          Settings
        </Button>
      )}
    </div>
  )
}
