// Main Mancala game page

import { useState, useEffect, useRef } from 'react'
import { Board } from '@/components/Board'
import { GameControls } from '@/components/GameControls'
import { LeaderboardDialog } from '@/components/LeaderboardDialog'
import { VictoryDialog } from '@/components/VictoryDialog'
import { ContinueGameDialog } from '@/components/ContinueGameDialog'
import { Tutorial } from '@/components/Tutorial'
import { HowToPlayDialog } from '@/components/HowToPlayDialog'
import { KeyboardShortcutsDialog } from '@/components/KeyboardShortcutsDialog'
import { AriaAnnouncer } from '@/components/AriaAnnouncer'
import { SettingsDialog } from '@/components/SettingsDialog'
import { GameStatistics } from '@/components/GameStatistics'
import { MoveHistory } from '@/components/MoveHistory'
import { OpponentChip } from '@/components/OpponentChip'
import { ConfirmSwitchDialog } from '@/components/ConfirmSwitchDialog'
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
import { useCharacterSelection, getCharacterIdFromUrl, getDifficultyFromUrl } from '@/hooks/useCharacterSelection'
import { recordPlayerBeatBentley, recordBentleyBeatPlayer } from '@shared/arcadeRecord'
import { AchievementToast } from '@/components/AchievementToast'
import { P1_STORE, P2_STORE } from '@/lib/mancalaRules'
import { STORAGE_KEYS } from '@/lib/storageKeys'
import { UI_TIMING } from '@/lib/constants'
import type { Difficulty, GameMode } from '@/types/mancala.types'
import { ArrowLeftIcon, VolumeIcon, VolumeOffIcon, HelpIcon } from '@shared/icons'
import type { SavedGame } from '@/hooks/useGamePersistence'

export default function MancalaGame() {
  const [initialDifficulty] = useState<Difficulty>(() => getDifficultyFromUrl() ?? 'medium')
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
    getValidMovesForCurrentPlayer,
    restoreGameState,
  } = useMancalaGame(getAnimationDelay(), initialDifficulty)

  const { playerName, stats, recordGame, resetStats } = useLeaderboard()
  const { isMuted, toggleMute, playSound } = useGameAudio()
  const { saveGame, loadGame, clearSavedGame, abandonGame } = useGamePersistence()
  const { isReducedMotion } = useReducedMotion()
  const { character, characterId } = useCharacterSelection(gameState.difficulty)
  const arcadeRecordPostedRef = useRef(false)
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
  const [welcomeOpen, setWelcomeOpen] = useState(false)
  const [showContinueDialog, setShowContinueDialog] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
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
    // ?character= decides the opponent. A saved game against someone else is not offered,
    // so the opponent shown always matches the link the player followed.
    const urlDifficulty = getDifficultyFromUrl()
    const matchesLink =
      !saved ||
      saved.gameState.mode !== 'vsAI' ||
      urlDifficulty === null ||
      saved.gameState.difficulty === urlDifficulty
    if (saved && matchesLink) {
      setSavedGameData(saved)
      setShowContinueDialog(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount

  // First visit only: show the welcome dialog once. Never auto-open it when the
  // page was loaded with ?character= (the arcade sends players straight to a match).
  useEffect(() => {
    if (getCharacterIdFromUrl()) return
    let seen = false
    let completed = false
    try {
      seen = !!localStorage.getItem(STORAGE_KEYS.SEEN_WELCOME)
      completed = !!localStorage.getItem(STORAGE_KEYS.TUTORIAL_COMPLETED)
    } catch {
      return
    }
    if (seen || completed || showContinueDialog) return
    const timer = setTimeout(() => {
      setShowHowToPlay(true)
      setWelcomeOpen(true)
      try {
        localStorage.setItem(STORAGE_KEYS.SEEN_WELCOME, 'true')
      } catch {
        // storage unavailable
      }
    }, UI_TIMING.WELCOME_DIALOG_DELAY)
    return () => clearTimeout(timer)
  }, [showContinueDialog])

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

  // Track if we've already handled the game over for this game
  const [gameOverHandled, setGameOverHandled] = useState(false)

  // Reset gameOverHandled when a new game starts
  useEffect(() => {
    if (gameState.status === 'playing') {
      setGameOverHandled(false)
      arcadeRecordPostedRef.current = false
    }
  }, [gameState.status])

  // Handle game over - only run once per game
  useEffect(() => {
    if (gameState.status === 'finished' && !gameOverHandled) {
      setGameOverHandled(true)
      const gameDuration = Math.floor((Date.now() - gameStartTime) / 1000)
      const playerWon = gameState.winner === 1
      const playerScore = gameState.board.pits[P1_STORE]
      const opponentScore = gameState.board.pits[P2_STORE]

      // Play victory or defeat sound
      if (playerWon) {
        playSound('victory')
        if (settings.showVictoryCelebration) {
          vibrate('success')
        }
      } else {
        playSound('defeat')
        vibrate('error')
      }

      recordGame(playerWon, gameDuration, highestCaptureThisGame)

      // Arcade-wide Bentley record: vs-AI games against Bentley with a decisive result, once per game
      if (
        gameState.mode === 'vsAI' &&
        characterId === 'bentley' &&
        gameState.winner !== null &&
        !arcadeRecordPostedRef.current
      ) {
        arcadeRecordPostedRef.current = true
        if (playerWon) {
          void recordPlayerBeatBentley()
        } else {
          void recordBentleyBeatPlayer()
        }
      }

      // Track game result for achievements
      trackGameResult(playerWon, gameDuration, opponentScore, maxDeficitThisGame)

      // Clear saved game when game is completed
      clearSavedGame()

      // Announce game result
      const winnerScore = Math.max(playerScore, opponentScore)
      const loserScore = Math.min(playerScore, opponentScore)
      const announcement =
        gameState.winner === null
          ? `Game over! It's a tie, ${playerScore} stones to ${opponentScore}.`
          : `Game over! ${
              playerWon ? playerName : gameState.mode === 'vsHuman' ? 'Player 2' : character.name
            } wins with ${winnerScore} stones to ${loserScore}.`
      setAriaMessage(announcement)
      setAriaPriority('assertive')

      setShowVictory(true)
    }
  }, [
    gameState.status,
    gameState.moveHistory.length,
    gameState.board.pits,
    gameState.mode,
    gameState.winner,
    gameOverHandled,
    characterId,
    character,
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
    maxDeficitThisGame,
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
    }, UI_TIMING.START_GAME_DELAY)
  }

  // A change of opponent or mode always starts a fresh game. When a game is in
  // progress the player confirms first, so the opponent can never change under a
  // running game (which would let a Bentley result be claimed from a Bella game).
  type PendingSwitch = { mode: GameMode; difficulty: Difficulty; title: string }
  const [pendingSwitch, setPendingSwitch] = useState<PendingSwitch | null>(null)

  const requestSwitch = (mode: GameMode, difficulty: Difficulty, title: string) => {
    if (mode === gameState.mode && difficulty === gameState.difficulty) return
    const inProgress = gameState.status === 'playing' && gameState.moveHistory.length > 0
    if (inProgress) {
      setPendingSwitch({ mode, difficulty, title })
      return
    }
    applySwitch(mode, difficulty)
  }

  const applySwitch = (mode: GameMode, difficulty: Difficulty) => {
    setShowVictory(false)
    clearSavedGame()
    startGame(mode, difficulty)
  }

  const handleDifficultyChange = (difficulty: Difficulty) => {
    const name = { easy: 'Bella', medium: 'Coop', hard: 'Bentley' }[difficulty]
    requestSwitch(gameState.mode, difficulty, `Play ${name} instead?`)
  }

  const handleModeChange = (mode: GameMode) => {
    requestSwitch(
      mode,
      gameState.difficulty,
      mode === 'vsHuman' ? 'Switch to two players?' : `Play ${character.name} instead?`
    )
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
      setTimeout(() => setShowCopyNotification(false), UI_TIMING.COPY_NOTIFICATION_DURATION)
    })
  }

  const handleTutorialComplete = () => {
    localStorage.setItem(STORAGE_KEYS.TUTORIAL_COMPLETED, 'true')
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

  const isVsHuman = gameState.mode === 'vsHuman'
  const opponent = isVsHuman ? 'Player 2' : character.name
  const inSetup = gameState.status === 'setup'
  const lastMoveGoesAgain =
    gameState.lastMove?.extraTurn === true && gameState.lastMove.player === gameState.currentPlayer

  let turnText: string
  let turnActive: 'you' | 'opponent' | 'over'
  if (inSetup) {
    turnText = isStartingGame ? 'Setting up' : 'Ready'
    turnActive = 'you'
  } else if (gameState.status === 'finished') {
    turnText =
      gameState.winner === null ? 'Draw' : gameState.winner === 1 ? 'You won' : `${opponent} won`
    turnActive = 'over'
  } else if (gameState.currentPlayer === 1) {
    turnText = lastMoveGoesAgain ? 'Go again' : isVsHuman ? "Player 1's turn" : 'Your turn'
    turnActive = 'you'
  } else {
    turnText = isVsHuman
      ? lastMoveGoesAgain
        ? 'Player 2 goes again'
        : "Player 2's turn"
      : `${opponent} is thinking`
    turnActive = 'opponent'
  }

  const validMoves = inSetup ? [] : getValidMovesForCurrentPlayer()

  return (
    <div className="arcade-page">
      <a
        href="#game-board"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:text-foreground"
      >
        Skip to game board
      </a>

      {/* ARIA Live Region for Screen Reader Announcements */}
      <AriaAnnouncer message={ariaMessage} priority={ariaPriority} />

      <header className="arcade-topbar">
        <div className="flex flex-1 items-center">
          <a
            href="https://www.mcooper.com/arcade/"
            className="inline-flex min-h-11 items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeftIcon size={18} />
            Arcade
          </a>
        </div>
        <h1 className="arcade-display sr-only text-xl sm:not-sr-only">Mancala</h1>
        <div className="flex flex-1 items-center justify-end gap-1">
          {!isVsHuman && (
            <OpponentChip
              character={character}
              difficulty={gameState.difficulty}
              onDifficultyChange={handleDifficultyChange}
            />
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 shrink-0"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
          >
            {isMuted ? <VolumeOffIcon /> : <VolumeIcon />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 shrink-0"
            onClick={() => setShowHowToPlay(true)}
            aria-label="How to play"
          >
            <HelpIcon />
          </Button>
        </div>
      </header>

      <main className="arcade-stage">
        <div className="arcade-score" aria-live="polite">
          <div>
            <strong>{gameState.board.pits[P1_STORE]}</strong>
            {isVsHuman ? 'Player 1' : 'You'}
          </div>
          <div className="arcade-turn" data-active={turnActive}>
            {turnText}
          </div>
          <div>
            <strong>{gameState.board.pits[P2_STORE]}</strong>
            {opponent}
          </div>
        </div>

        <div id="game-board" className="flex w-full justify-center">
          <Board
            board={gameState.board}
            currentPlayer={gameState.currentPlayer}
            validMoves={validMoves}
            onPitClick={handleMakeMove}
            isAIThinking={isAIThinking}
            isAnimating={isAnimating}
            playerName={isVsHuman ? 'Player 1' : 'You'}
            gameMode={gameState.mode}
            activePit={activePit}
            isReducedMotion={isReducedMotion}
            opponentName={opponent}
          />
        </div>

        <GameControls
          gameStatus={gameState.status}
          gameMode={gameState.mode}
          opponentName={character.name}
          onNewGame={inSetup ? handleStartGame : handleNewGame}
          onModeChange={handleModeChange}
          onShowLeaderboard={() => setShowLeaderboard(true)}
          onShowHowToPlay={() => setShowHowToPlay(true)}
          onShowSettings={() => setShowSettings(true)}
          onUndo={undoMove}
          canUndo={gameState.undoState !== null && gameState.currentPlayer === 2}
        />

        {inSetup && (
          <p className="max-w-[min(640px,calc(100dvw-2rem))] text-center text-sm text-muted-foreground">
            Choose a pit on your side, sow its stones counter-clockwise, and finish with more stones in
            your store. Press Start game to begin.
          </p>
        )}

        {!inSetup && settings.showGameStats && (
          <GameStatistics
            gameState={gameState}
            gameStartTime={gameStartTime}
            highestCaptureThisGame={highestCaptureThisGame}
          />
        )}

        {!inSetup && settings.showMoveHistory && (
          <MoveHistory gameState={gameState} playerName={playerName} opponentName={character.name} />
        )}

        {showCopyNotification && (
          <div className="fixed bottom-4 right-4 z-50 rounded-lg border bg-card px-4 py-3 text-sm text-foreground shadow-lg">
            Copied to clipboard
          </div>
        )}
      </main>

      {/* Victory Dialog */}
      {showVictory && (
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
        character={gameState.mode === 'vsAI' ? character : undefined}
      />
      )}

      {/* Leaderboard Dialog */}
      <LeaderboardDialog
        open={showLeaderboard}
        onOpenChange={setShowLeaderboard}
        stats={stats}
        achievements={achievements}
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
        onOpenChange={open => {
          setShowHowToPlay(open)
          if (!open) setWelcomeOpen(false)
        }}
        onStartTutorial={() => {
          setShowHowToPlay(false)
          setShowTutorial(true)
        }}
        onStartPlaying={
          welcomeOpen
            ? () => {
                setShowHowToPlay(false)
                if (gameState.status === 'setup') handleStartGame()
              }
            : undefined
        }
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

      <ConfirmSwitchDialog
        open={pendingSwitch !== null}
        title={pendingSwitch?.title ?? ''}
        onConfirm={() => {
          if (pendingSwitch) applySwitch(pendingSwitch.mode, pendingSwitch.difficulty)
          setPendingSwitch(null)
        }}
        onCancel={() => setPendingSwitch(null)}
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
    </div>
  )
}
