// Main Mancala game page

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Board } from '@/components/Board'
import { GameControls } from '@/components/GameControls'
import { LeaderboardDialog } from '@/components/LeaderboardDialog'
import { VictoryDialog } from '@/components/VictoryDialog'
import { ContinueGameDialog } from '@/components/ContinueGameDialog'
import { Tutorial } from '@/components/Tutorial'
import { HowToPlayDialog } from '@/components/HowToPlayDialog'
import { AudioControls } from '@/components/AudioControls'
import { KeyboardShortcutsDialog } from '@/components/KeyboardShortcutsDialog'
import { AriaAnnouncer } from '@/components/AriaAnnouncer'
import { SettingsDialog } from '@/components/SettingsDialog'
import { GameStatistics } from '@/components/GameStatistics'
import { MoveHistory } from '@/components/MoveHistory'
import { Confetti } from '@/components/Confetti'
import { Button } from '@/components/ui/button'
import { useMancalaGame } from '@/hooks/useMancalaGame'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { useGameAudio } from '@/hooks/useGameAudio'
import { useGamePersistence } from '@/hooks/useGamePersistence'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useKeyboardControls } from '@/hooks/useKeyboardControls'
import { useAchievements } from '@/hooks/useAchievements'
import { useGameSettings } from '@/hooks/useGameSettings'
import { useHapticFeedback } from '@/hooks/useHapticFeedback'
import { useCharacterSelection } from '@/hooks/useCharacterSelection'
import { useBentleyStats } from '@/hooks/useBentleyStats'
import { AchievementToast } from '@/components/AchievementToast'
import { P1_STORE, P2_STORE } from '@/lib/mancalaRules'
import type { Difficulty } from '@/types/mancala.types'
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons'
import type { SavedGame } from '@/hooks/useGamePersistence'
import { MancalaLogo } from '@/components/graphics'

export default function MancalaGame() {
  const { settings, updateSetting, resetSettings, getAnimationDelay } = useGameSettings()
  const { vibrate } = useHapticFeedback(settings.hapticFeedback)

  const {
    gameState,
    isAIThinking,
    isAnimating,
    startGame,
    makeMove,
    undoMove,
    resetGame,
    setDifficulty,
    setMode,
    getValidMovesForCurrentPlayer,
    restoreGameState,
  } = useMancalaGame(getAnimationDelay())

  const { playerName, stats, recordGame, resetStats } = useLeaderboard()
  const { isMuted, toggleMute, playSound } = useGameAudio()
  const { saveGame, loadGame, clearSavedGame, abandonGame } = useGamePersistence()
  const { isReducedMotion } = useReducedMotion()
  const { character, characterId } = useCharacterSelection(gameState.difficulty)
  const bentleyStats = useBentleyStats()
  const {
    recentlyUnlocked,
    trackCapture,
    trackExtraTurn,
    endExtraTurnChain,
    trackGameResult,
    achievements,
  } = useAchievements()

  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false)
  const [showVictory, setShowVictory] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [showHowToPlay, setShowHowToPlay] = useState(false)
  const [showContinueDialog, setShowContinueDialog] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [savedGameData, setSavedGameData] = useState<SavedGame | null>(null)
  const [gameStartTime, setGameStartTime] = useState<number>(0)
  const [highestCaptureThisGame, setHighestCaptureThisGame] = useState(0)
  const [maxDeficitThisGame, setMaxDeficitThisGame] = useState(0)
  const [isStartingGame, setIsStartingGame] = useState(false)
  const [ariaMessage, setAriaMessage] = useState<string>('')
  const [ariaPriority, setAriaPriority] = useState<'polite' | 'assertive'>('polite')

  // Check for saved game on mount
  useEffect(() => {
    const saved = loadGame()
    if (saved) {
      setSavedGameData(saved)
      setShowContinueDialog(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount

  // Check if this is the user's first time and show a helpful dialog
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('mancala_seen_welcome')
    const tutorialCompleted = localStorage.getItem('mancala_tutorial_completed')

    // Show How to Play dialog for first-time users who haven't seen welcome or completed tutorial
    if (!hasSeenWelcome && !tutorialCompleted && gameState.status === 'setup') {
      // Delay to allow the page to load first
      setTimeout(() => {
        setShowHowToPlay(true)
        localStorage.setItem('mancala_seen_welcome', 'true')
      }, 500)
    }
  }, [gameState.status])

  // Track game start time
  useEffect(() => {
    if (gameState.status === 'playing') {
      setGameStartTime(Date.now())
      setHighestCaptureThisGame(0)
      setMaxDeficitThisGame(0)
    }
  }, [gameState.status])

  // Track score deficit during gameplay
  useEffect(() => {
    if (gameState.status === 'playing') {
      const playerScore = gameState.board.pits[P1_STORE]
      const opponentScore = gameState.board.pits[P2_STORE]
      const deficit = opponentScore - playerScore
      if (deficit > maxDeficitThisGame) {
        setMaxDeficitThisGame(deficit)
      }
    }
  }, [gameState.status, gameState.board.pits, maxDeficitThisGame])

  // Track highest capture, play sounds, and announce moves
  useEffect(() => {
    if (gameState.lastMove) {
      const movePlayer =
        gameState.lastMove.player === 1
          ? playerName
          : gameState.mode === 'vsHuman'
            ? 'Player 2'
            : character.name
      let announcement = ''

      // Play capture sound, track achievement, and announce
      if (gameState.lastMove.capturedStones) {
        playSound('capture')
        setHighestCaptureThisGame(prev => Math.max(prev, gameState.lastMove!.capturedStones || 0))
        // Track capture for achievements (only for player 1)
        if (gameState.lastMove.player === 1) {
          trackCapture(gameState.lastMove.capturedStones)
        }
        announcement = `${movePlayer} captured ${gameState.lastMove.capturedStones} stone${gameState.lastMove.capturedStones !== 1 ? 's' : ''}.`
        // End extra turn chain when a capture happens
        endExtraTurnChain()
      }
      // Play extra turn sound, track achievement, and announce
      else if (gameState.lastMove.extraTurn) {
        playSound('extraTurn')
        // Track extra turn for achievements (only for player 1)
        if (gameState.lastMove.player === 1) {
          trackExtraTurn()
        }
        announcement = `${movePlayer} gets an extra turn!`
      }
      // Play regular drop sound and announce
      else {
        playSound('drop')
        announcement = `${movePlayer} made a move.`
        // End extra turn chain when a regular move happens
        endExtraTurnChain()
      }

      // Add turn information
      if (gameState.status === 'playing') {
        const nextPlayer =
          gameState.currentPlayer === 1
            ? playerName
            : gameState.mode === 'vsHuman'
              ? 'Player 2'
              : character.name
        announcement += ` It's now ${nextPlayer}'s turn.`
      }

      setAriaMessage(announcement)
      setAriaPriority('polite')
    }
  }, [
    gameState.lastMove,
    gameState.currentPlayer,
    gameState.status,
    gameState.mode,
    playerName,
    playSound,
    trackCapture,
    trackExtraTurn,
    endExtraTurnChain,
    character,
  ])

  // Auto-save game state after every move
  useEffect(() => {
    if (gameState.status === 'playing') {
      saveGame(gameState, gameStartTime, highestCaptureThisGame)
    }
  }, [gameState, gameStartTime, highestCaptureThisGame, saveGame])

  // Handle game over - only run once per game
  useEffect(() => {
    if (gameState.status === 'finished' && !showVictory) {
      const gameDuration = Math.floor((Date.now() - gameStartTime) / 1000)
      const playerWon = gameState.winner === 1
      const playerScore = gameState.board.pits[P1_STORE]
      const opponentScore = gameState.board.pits[P2_STORE]

      // Play victory or defeat sound and trigger confetti
      if (playerWon) {
        playSound('victory')
        if (settings.showVictoryCelebration) {
          setShowConfetti(true)
          vibrate('success')
          setTimeout(() => setShowConfetti(false), 3000)
        }
      } else {
        playSound('defeat')
        vibrate('error')
      }

      recordGame(playerWon, gameDuration, highestCaptureThisGame)

      // Track Bentley stats when playing against Bentley
      if (characterId === 'bentley') {
        if (playerWon) {
          bentleyStats.recordLoss() // Player won, so Bentley lost
        } else {
          bentleyStats.recordWin() // Player lost, so Bentley won
        }
      }

      // Track game result for achievements
      trackGameResult(playerWon, gameDuration, playerScore, opponentScore, maxDeficitThisGame)

      // Clear saved game when game is completed
      clearSavedGame()

      // Announce game result
      const winnerName =
        gameState.winner === 1 ? playerName : gameState.mode === 'vsHuman' ? 'Player 2' : character.name
      const announcement = `Game over! ${winnerName} wins with ${playerWon ? playerScore : opponentScore} stones to ${playerWon ? opponentScore : playerScore}.`
      setAriaMessage(announcement)
      setAriaPriority('assertive')

      setShowVictory(true)
    }
  }, [
    // Only re-run when game finishes (don't include showVictory to avoid reopening dialog)
    gameState.status,
    gameState.moveHistory.length, // Use as unique game identifier
    characterId, // Include characterId so Bentley stats are tracked correctly
    character, // Include character for victory announcements
    bentleyStats, // Include bentleyStats for API calls
    recordGame,
    trackGameResult,
    clearSavedGame,
    playSound,
    vibrate,
    settings.showVictoryCelebration,
    gameStartTime,
    playerName,
    setAriaMessage,
    setAriaPriority,
    highestCaptureThisGame,
  ])

  const handleNewGame = () => {
    setShowVictory(false)
    clearSavedGame() // Clear any saved game when starting new
    resetGame()
  }

  const handleStartGame = () => {
    setShowVictory(false)
    setIsStartingGame(true)
    setTimeout(() => {
      startGame(gameState.mode, gameState.difficulty)
      setIsStartingGame(false)
    }, 300)
  }

  const handleDifficultyChange = (difficulty: Difficulty) => {
    setDifficulty(difficulty)
    if (gameState.status !== 'playing') {
      startGame(gameState.mode, difficulty)
    }
  }

  const handleModeChange = (mode: 'vsAI' | 'vsHuman' | 'tutorial') => {
    setMode(mode)
    if (gameState.status !== 'playing') {
      startGame(mode, gameState.difficulty)
    }
  }

  const handleShare = () => {
    const message =
      gameState.status === 'finished'
        ? `I just ${gameState.winner === 1 ? 'won' : 'played'} Mancala! Score: ${gameState.board.pits[P1_STORE]}-${gameState.board.pits[P2_STORE]}`
        : `Check out my Mancala stats! ${stats.wins} wins, ${stats.totalGamesPlayed} games played`

    if (navigator.share) {
      navigator
        .share({
          title: 'Mancala Game',
          text: message,
          url: window.location.href,
        })
        .catch(() => {
          // Fallback to clipboard
          copyToClipboard(message)
        })
    } else {
      copyToClipboard(message)
    }
  }

  const [showCopyNotification, setShowCopyNotification] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setShowCopyNotification(true)
      setTimeout(() => setShowCopyNotification(false), 2000)
    })
  }

  const handleTutorialComplete = () => {
    localStorage.setItem('mancala_tutorial_completed', 'true')
    setShowTutorial(false)
  }

  const handleContinueGame = () => {
    if (savedGameData) {
      // Restore the game state
      restoreGameState(savedGameData.gameState)
      setGameStartTime(savedGameData.gameStartTime)
      setHighestCaptureThisGame(savedGameData.highestCaptureThisGame)
      setShowContinueDialog(false)
      setSavedGameData(null)
    }
  }

  const handleAbandonGame = () => {
    abandonGame()
    setShowContinueDialog(false)
    setSavedGameData(null)
  }

  // Wrap makeMove with haptic feedback
  const handleMakeMove = (pitIndex: number) => {
    vibrate('light')
    makeMove(pitIndex)
  }

  // Keyboard controls
  const { activePit } = useKeyboardControls({
    onPitSelect: handleMakeMove,
    onUndo: undoMove,
    onNewGame: handleNewGame,
    onShowHelp: () => setShowKeyboardHelp(true),
    validMoves: getValidMovesForCurrentPlayer(),
    gameMode: gameState.mode,
    isAIThinking: isAIThinking || isAnimating,
    gameStatus: gameState.status,
  })

  // Sync help dialog state with keyboard controls
  useEffect(() => {
    if (showKeyboardHelp) {
      setShowKeyboardHelp(false)
      // The dialog state will be controlled by our local state
    }
  }, [showKeyboardHelp])

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 px-4 py-8 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Return to Arcade Button - Fixed position */}
      <div className="fixed left-4 top-4 z-10">
        <a
          href="https://www.mcooper.com/arcade"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Return to Arcade
        </a>
      </div>

      {/* ARIA Live Region for Screen Reader Announcements */}
      <AriaAnnouncer message={ariaMessage} priority={ariaPriority} />

      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <header className="relative space-y-2 text-center">
          {/* Audio Controls - positioned in top right */}
          <div className="absolute right-0 top-0">
            <AudioControls isMuted={isMuted} onToggleMute={toggleMute} />
          </div>

          <h1 className="bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-4xl font-bold text-transparent dark:from-amber-400 dark:to-rose-400 md:text-5xl">
            Mancala
          </h1>
          <p className="text-base font-medium text-muted-foreground">
            Ancient Strategy Game
          </p>
          <Link
            to="/history"
            className="inline-block text-sm text-amber-600 hover:text-amber-700 hover:underline dark:text-amber-400 dark:hover:text-amber-300"
          >
            📜 Learn about the game's history
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 text-sm font-semibold text-green-600 dark:text-green-400">
            <span>🏆</span>
            <span>Goal: Capture More Stones to Win!</span>
          </div>
        </header>

        {/* Game Controls */}
        <GameControls
          difficulty={gameState.difficulty}
          gameMode={gameState.mode}
          gameStatus={gameState.status}
          onNewGame={gameState.status === 'setup' ? handleStartGame : handleNewGame}
          onDifficultyChange={handleDifficultyChange}
          onModeChange={handleModeChange}
          onShowLeaderboard={() => setShowLeaderboard(true)}
          onShowHowToPlay={() => setShowHowToPlay(true)}
          onShowSettings={() => setShowSettings(true)}
          onUndo={undoMove}
          canUndo={gameState.undoState !== null && gameState.currentPlayer === 2}
        />

        {/* Player Turn Prompt - Enhanced */}
        {gameState.status === 'playing' && !isAIThinking && (
          <div className="mx-auto max-w-4xl">
            <div className="rounded-xl border-2 border-blue-400 bg-gradient-to-r from-blue-50 to-blue-100 p-4 text-center duration-300 animate-in fade-in shadow-lg dark:border-blue-600 dark:from-blue-950/50 dark:to-blue-900/30">
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl animate-bounce">👆</span>
                <p className="text-base font-bold text-blue-900 dark:text-blue-100">
                  {gameState.currentPlayer === 1
                    ? 'Your Turn! Click any highlighted pit on the bottom row'
                    : gameState.mode === 'vsHuman'
                      ? "Player 2's Turn! Click any highlighted pit on the top row"
                      : null}
                </p>
              </div>
              {gameState.currentPlayer === 1 && (
                <p className="mt-2 text-xs text-blue-700 dark:text-blue-300">
                  💡 Tip: Hover over pits to preview your move
                </p>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isStartingGame && (
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-col items-center gap-4 rounded-2xl bg-card p-12 shadow-lg duration-300 animate-in fade-in zoom-in">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-lg font-semibold">Setting up the board...</p>
            </div>
          </div>
        )}

        {/* Game Board */}
        {gameState.status !== 'setup' && !isStartingGame && (
          <>
            <Board
              board={gameState.board}
              currentPlayer={gameState.currentPlayer}
              validMoves={getValidMovesForCurrentPlayer()}
              onPitClick={handleMakeMove}
              isAIThinking={isAIThinking}
              isAnimating={isAnimating}
              playerName={playerName}
              gameMode={gameState.mode}
              activePit={activePit}
              isReducedMotion={isReducedMotion}
            />

            {/* Game Statistics */}
            {settings.showGameStats && (
              <GameStatistics
                gameState={gameState}
                gameStartTime={gameStartTime}
                highestCaptureThisGame={highestCaptureThisGame}
              />
            )}

            {/* Move History */}
            {settings.showMoveHistory && (
              <MoveHistory gameState={gameState} playerName={playerName} />
            )}
          </>
        )}

        {/* Welcome Message */}
        {gameState.status === 'setup' && (
          <div className="mx-auto mt-12 max-w-2xl">
            <div className="space-y-6 rounded-2xl bg-card p-8 shadow-lg border-2 border-primary/20">
              <div className="space-y-4 text-center">
                <div className="flex justify-center">
                  <MancalaLogo size={120} className="drop-shadow-lg" />
                </div>
                <h2 className="text-3xl font-bold">Welcome to Mancala!</h2>
                <p className="text-base text-muted-foreground">
                  A classic board game of strategy and skill
                </p>
              </div>

              {/* Goal Section - Most Prominent */}
              <div className="rounded-xl border-4 border-green-500/70 bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-6 shadow-lg">
                <div className="text-center space-y-3">
                  <div className="text-5xl animate-bounce-subtle">🏆</div>
                  <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
                    Goal: Capture More Stones!
                  </h3>
                  <p className="text-base font-medium">
                    Collect more stones in your <span className="text-green-600 dark:text-green-400 font-bold">STORE</span> (large pit on right) than your opponent
                  </p>
                </div>
              </div>

              {/* How to Play - Simplified */}
              <div className="space-y-4 rounded-lg bg-muted/50 p-5">
                <h3 className="text-lg font-bold text-center flex items-center justify-center gap-2">
                  <span className="text-2xl">⚡</span>
                  How to Play in 3 Steps
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 rounded-lg bg-background/80 p-3 border-l-4 border-blue-500">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">1</span>
                    <div>
                      <p className="font-bold">Pick a Pit</p>
                      <p className="text-sm text-muted-foreground">Click any pit on YOUR side (bottom) to pick up all stones</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg bg-background/80 p-3 border-l-4 border-purple-500">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500 text-sm font-bold text-white">2</span>
                    <div>
                      <p className="font-bold">Drop Stones Counter-Clockwise</p>
                      <p className="text-sm text-muted-foreground">Stones drop one by one, going right → up → left → down</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg bg-background/80 p-3 border-l-4 border-amber-500">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white">3</span>
                    <div>
                      <p className="font-bold">Collect More Stones Than Opponent!</p>
                      <p className="text-sm text-muted-foreground">Game ends when one side is empty - highest score wins!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Moves */}
              <div className="space-y-3 rounded-lg border-2 border-primary/30 bg-primary/5 p-4">
                <h3 className="text-base font-bold text-center">✨ Special Moves to Master</h3>
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-2 bg-background/50 p-2 rounded">
                    <span className="text-xl">🔄</span>
                    <span><strong>Extra Turn:</strong> Last stone lands in YOUR store? Go again!</span>
                  </div>
                  <div className="flex items-center gap-2 bg-background/50 p-2 rounded">
                    <span className="text-xl">💎</span>
                    <span><strong>Capture:</strong> Last stone in empty pit on your side? Steal opposite stones!</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 grid gap-3 sm:grid-cols-2">
                <Button
                  onClick={() => setShowHowToPlay(true)}
                  variant="outline"
                  size="lg"
                  className="gap-2"
                >
                  <QuestionMarkCircledIcon className="h-5 w-5" />
                  Full Rules
                </Button>
                <Button
                  onClick={() => setShowTutorial(true)}
                  variant="default"
                  size="lg"
                  className="gap-2 shadow-lg"
                >
                  <QuestionMarkCircledIcon className="h-5 w-5" />
                  Interactive Tutorial
                </Button>
              </div>
              <p className="text-sm font-medium text-center text-primary">
                💡 First time? Try the interactive tutorial!
              </p>
            </div>
          </div>
        )}

        {/* Move Indicator */}
        {gameState.status === 'playing' && gameState.lastMove && (
          <div className="mx-auto max-w-4xl">
            <div className="rounded-lg bg-card/50 p-4 text-center text-sm backdrop-blur duration-300 animate-in fade-in slide-in-from-top-2">
              {gameState.lastMove.extraTurn && (
                <span className="font-semibold text-primary">Extra turn! </span>
              )}
              {gameState.lastMove.capturedStones && (
                <span className="font-semibold text-green-600 dark:text-green-400">
                  Captured {gameState.lastMove.capturedStones} stones! 🎉
                </span>
              )}
            </div>
          </div>
        )}

        {/* Copy Notification */}
        {showCopyNotification && (
          <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-primary px-4 py-3 text-primary-foreground shadow-lg duration-300 animate-in slide-in-from-bottom-4">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Copied to clipboard!</span>
            </div>
          </div>
        )}
      </div>

      {/* Victory Dialog */}
      <VictoryDialog
        open={showVictory}
        onOpenChange={setShowVictory}
        winner={gameState.winner}
        playerScore={gameState.board.pits[P1_STORE]}
        aiScore={gameState.board.pits[P2_STORE]}
        playerName={playerName}
        moveCount={gameState.moveHistory.length}
        gameDuration={Math.floor((Date.now() - gameStartTime) / 1000)}
        highestCapture={highestCaptureThisGame}
        onNewGame={handleNewGame}
        onShare={handleShare}
        character={gameState.mode === 'vsAI' ? character : undefined}
      />

      {/* Leaderboard Dialog */}
      <LeaderboardDialog
        open={showLeaderboard}
        onOpenChange={setShowLeaderboard}
        stats={stats}
        playerName={playerName}
        achievements={achievements}
        onUpdateName={() => {}}
        onReset={resetStats}
        onShare={handleShare}
      />

      {/* Tutorial Dialog */}
      <Tutorial
        open={showTutorial}
        onOpenChange={setShowTutorial}
        onComplete={handleTutorialComplete}
      />

      {/* How to Play Dialog */}
      <HowToPlayDialog
        open={showHowToPlay}
        onOpenChange={setShowHowToPlay}
        onStartTutorial={() => {
          setShowHowToPlay(false)
          setShowTutorial(true)
        }}
      />

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsDialog
        open={showKeyboardHelp}
        onOpenChange={setShowKeyboardHelp}
        gameMode={gameState.mode}
      />

      {/* Continue Game Dialog */}
      <ContinueGameDialog
        open={showContinueDialog}
        onOpenChange={setShowContinueDialog}
        savedGame={savedGameData}
        playerName={playerName}
        onContinue={handleContinueGame}
        onNewGame={handleAbandonGame}
      />

      {/* Settings Dialog */}
      <SettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
        settings={settings}
        onUpdateSetting={updateSetting}
        onReset={resetSettings}
      />

      {/* Achievement Toast */}
      <AchievementToast achievement={recentlyUnlocked} />

      {/* Confetti Celebration */}
      <Confetti active={showConfetti} duration={3000} />
    </div>
  )
}
