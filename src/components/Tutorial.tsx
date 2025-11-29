// Interactive tutorial component for teaching Mancala gameplay

import { useState, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Board } from './Board'
import type { Board as BoardType, Player } from '@/types/mancala.types'
import { executeMove, createInitialBoard, getValidMoves } from '@/lib/mancalaRules'
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon, PlayIcon } from '@radix-ui/react-icons'

interface TutorialProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: () => void
}

interface TutorialStep {
  title: string
  description: string
  instruction: string
  boardState: BoardType
  currentPlayer: Player
  validMovesOverride?: number[]
  highlightPits?: number[]
  requireMove?: number
  autoAdvance?: boolean
}

export function Tutorial({ open, onOpenChange, onComplete }: TutorialProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [currentBoard, setCurrentBoard] = useState<BoardType>(createInitialBoard())
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1)
  const [stepCompleted, setStepCompleted] = useState(false)

  // Tutorial steps with custom board states
  const tutorialSteps: TutorialStep[] = useMemo(
    () => [
      {
        title: 'Welcome to Mancala! 🎯',
        description:
          'Mancala is an ancient strategy game played around the world. Your goal is to capture more stones than your opponent by the end of the game.',
        instruction: 'The game board has 6 pits per player and 2 stores (the large pits on the sides).',
        boardState: createInitialBoard(),
        currentPlayer: 1,
        autoAdvance: true,
      },
      {
        title: 'Your First Move 🎮',
        description:
          'Each pit starts with 4 stones. On your turn, pick up all stones from one of YOUR pits (bottom row) and distribute them counter-clockwise, one stone per pit.',
        instruction: 'Click on pit #3 (third from left) to see how stones are distributed.',
        boardState: createInitialBoard(),
        currentPlayer: 1,
        validMovesOverride: [2],
        highlightPits: [2],
        requireMove: 2,
      },
      {
        title: 'Extra Turns! 🔄',
        description:
          'If your last stone lands in YOUR STORE (large pit on the right), you get an extra turn! This is a powerful strategic advantage.',
        instruction: 'Click on pit #1 to land your last stone in your store and earn an extra turn.',
        boardState: {
          pits: [3, 4, 5, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0],
        },
        currentPlayer: 1,
        validMovesOverride: [0],
        highlightPits: [0],
        requireMove: 0,
      },
      {
        title: 'Capturing Stones! 💎',
        description:
          "If your last stone lands in an EMPTY pit on your side, and the opposite pit has stones, you capture ALL stones from both pits into your store!",
        instruction: 'Click on pit #2 to make a capture move and grab the stones from the opposite pit.',
        boardState: {
          pits: [2, 1, 3, 0, 5, 6, 10, 7, 4, 3, 5, 2, 1, 8],
        },
        currentPlayer: 1,
        validMovesOverride: [1],
        highlightPits: [1, 11],
        requireMove: 1,
      },
      {
        title: 'Winning the Game! 🏆',
        description:
          'The game ends when all 6 pits on one side are empty. Any remaining stones go to their respective owners. The player with the most stones in their store WINS!',
        instruction: 'Strategic planning is key! Think ahead to create captures and extra turns.',
        boardState: {
          pits: [0, 0, 0, 0, 0, 0, 28, 2, 1, 0, 0, 0, 1, 16],
        },
        currentPlayer: 1,
        autoAdvance: true,
      },
      {
        title: 'Practice Time! 🎓',
        description:
          'Now you understand the basics! Try playing a few moves on this board. Remember: aim for extra turns and captures!',
        instruction: 'Make any move you like to practice. When ready, click "Start Playing" to begin!',
        boardState: createInitialBoard(),
        currentPlayer: 1,
      },
    ],
    []
  )

  const currentStep = tutorialSteps[currentStepIndex]

  // Initialize board when step changes
  const handleStepChange = useCallback(
    (newIndex: number) => {
      const step = tutorialSteps[newIndex]
      setCurrentStepIndex(newIndex)
      setCurrentBoard(step.boardState)
      setCurrentPlayer(step.currentPlayer)
      setStepCompleted(step.autoAdvance || false)
    },
    [tutorialSteps]
  )

  const handleNext = useCallback(() => {
    if (currentStepIndex < tutorialSteps.length - 1) {
      handleStepChange(currentStepIndex + 1)
    } else {
      onComplete()
      onOpenChange(false)
    }
  }, [currentStepIndex, tutorialSteps.length, handleStepChange, onComplete, onOpenChange])

  const handlePrevious = useCallback(() => {
    if (currentStepIndex > 0) {
      handleStepChange(currentStepIndex - 1)
    }
  }, [currentStepIndex, handleStepChange])

  const handlePitClick = useCallback(
    (pitIndex: number) => {
      // Check if this is the required move
      if (currentStep.requireMove !== undefined && pitIndex !== currentStep.requireMove) {
        return // Don't allow wrong moves in guided steps
      }

      // Execute the move
      const { board: newBoard } = executeMove(currentBoard, pitIndex, currentPlayer)
      setCurrentBoard(newBoard)

      // Mark step as completed
      setStepCompleted(true)

      // Show the result briefly before advancing
      if (currentStep.requireMove !== undefined) {
        setTimeout(() => {
          handleNext()
        }, 2000)
      }
    },
    [currentBoard, currentPlayer, currentStep, handleNext]
  )

  const getValidMovesForTutorial = useCallback(() => {
    if (currentStep.validMovesOverride) {
      return currentStep.validMovesOverride
    }
    return getValidMoves(currentBoard, currentPlayer)
  }, [currentStep, currentBoard, currentPlayer])

  const handleSkipTutorial = useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  // Progress indicator
  const progress = ((currentStepIndex + 1) / tutorialSteps.length) * 100

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{currentStep.title}</DialogTitle>
          <DialogDescription className="text-base">{currentStep.description}</DialogDescription>
        </DialogHeader>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Step {currentStepIndex + 1} of {tutorialSteps.length}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-2 w-full rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Instruction box */}
        <div className="rounded-lg border-2 border-primary/50 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {currentStepIndex + 1}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">{currentStep.instruction}</p>
              {currentStep.highlightPits && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Watch the highlighted pits carefully!
                </p>
              )}
            </div>
            {stepCompleted && currentStep.requireMove !== undefined && (
              <CheckIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            )}
          </div>
        </div>

        {/* Tutorial board */}
        <div className="relative">
          {currentStep.highlightPits && (
            <div className="absolute inset-0 z-0 pointer-events-none">
              {/* Add visual indicators for highlighted pits */}
            </div>
          )}
          <Board
            board={currentBoard}
            currentPlayer={currentPlayer}
            validMoves={getValidMovesForTutorial()}
            onPitClick={handlePitClick}
            isAIThinking={false}
            playerName="You"
            gameMode="tutorial"
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-2 pt-4 border-t">
          <Button onClick={handleSkipTutorial} variant="ghost" size="lg">
            Skip Tutorial
          </Button>

          <div className="flex gap-2">
            <Button
              onClick={handlePrevious}
              variant="outline"
              size="lg"
              disabled={currentStepIndex === 0}
            >
              <ChevronLeftIcon className="h-4 w-4 mr-1" />
              Previous
            </Button>

            {currentStepIndex < tutorialSteps.length - 1 ? (
              <Button
                onClick={handleNext}
                size="lg"
                disabled={!stepCompleted && !currentStep.autoAdvance}
              >
                Next
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleNext} size="lg" className="gap-2">
                <PlayIcon className="h-4 w-4" />
                Start Playing
              </Button>
            )}
          </div>
        </div>

        {/* Helpful tips */}
        {currentStepIndex === tutorialSteps.length - 1 && (
          <div className="rounded-lg bg-muted/50 p-4 text-sm">
            <p className="font-semibold mb-2">💡 Pro Tips:</p>
            <ul className="space-y-1 ml-4 list-disc text-muted-foreground">
              <li>Count ahead to plan captures and extra turns</li>
              <li>Try to empty your pits before your opponent</li>
              <li>Protect pits opposite to your opponent's full pits</li>
              <li>Chain extra turns for maximum advantage</li>
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
