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
        title: 'Welcome to Mancala',
        description:
          'Mancala is an ancient strategy game played around the world. Your goal is to capture more stones than your opponent by the end of the game.',
        instruction: 'The game board has 6 pits per player and 2 stores (the tall ovals at each end).',
        boardState: createInitialBoard(),
        currentPlayer: 1,
        autoAdvance: true,
      },
      {
        title: 'Your first move',
        description:
          'Each pit starts with 4 stones. On your turn, pick up all stones from one of your pits (bottom row) and distribute them counter-clockwise, one stone per pit.',
        instruction: 'Click on pit #3 (third from left) to see how stones are distributed.',
        boardState: createInitialBoard(),
        currentPlayer: 1,
        validMovesOverride: [2],
        highlightPits: [2],
        requireMove: 2,
      },
      {
        title: 'Go again',
        description:
          'If your last stone lands in your store (tall oval on the right), you get an extra turn.',
        instruction: 'Click on pit #1 to land your last stone in your store and go again.',
        boardState: {
          pits: [3, 4, 5, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0],
        },
        currentPlayer: 1,
        validMovesOverride: [0],
        highlightPits: [0],
        requireMove: 0,
      },
      {
        title: 'Capturing stones',
        description:
          "If your last stone lands in an empty pit on your side, and the opposite pit has stones, you capture all stones from both pits into your store!",
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
        title: 'Winning the game',
        description:
          'The game ends when all 6 pits on one side are empty. Any remaining stones go to their respective owners. The player with the most stones in their store wins.',
        instruction: 'Think ahead to create captures and extra turns.',
        boardState: {
          pits: [0, 0, 0, 0, 0, 0, 28, 2, 1, 0, 0, 0, 1, 16],
        },
        currentPlayer: 1,
        autoAdvance: true,
      },
      {
        title: 'Practice',
        description:
          'Now you understand the basics! Try playing a few moves on this board. Aim for extra turns and captures.',
        instruction: 'Make any move you like to practice. When you are ready, choose Start playing.',
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{currentStep.title}</DialogTitle>
          <DialogDescription>{currentStep.description}</DialogDescription>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Step {currentStepIndex + 1} of {tutorialSteps.length}
          {stepCompleted && currentStep.requireMove !== undefined ? ', done' : ''}
        </p>

        <p className="font-medium text-foreground">{currentStep.instruction}</p>

        {/* Tutorial board */}
        <div className="relative">
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
        <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-4">
          <Button onClick={handleSkipTutorial} variant="ghost" className="h-11">
            Skip tutorial
          </Button>

          <div className="flex gap-2">
            <Button
              onClick={handlePrevious}
              variant="outline"
              className="h-11"
              disabled={currentStepIndex === 0}
            >
              Previous
            </Button>

            {currentStepIndex < tutorialSteps.length - 1 ? (
              <Button
                onClick={handleNext}
                className="h-11"
                disabled={!stepCompleted && !currentStep.autoAdvance}
              >
                Next
              </Button>
            ) : (
              <Button onClick={handleNext} className="h-11">
                Start playing
              </Button>
            )}
          </div>
        </div>

        {currentStepIndex === tutorialSteps.length - 1 && (
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Count ahead to plan captures and extra turns</li>
            <li>Try to empty your pits before your opponent</li>
            <li>Protect pits opposite your opponent's full pits</li>
            <li>Chain extra turns for the biggest swing</li>
          </ul>
        )}
      </DialogContent>
    </Dialog>
  )
}
