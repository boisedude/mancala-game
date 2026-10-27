// Mancala board: a carved wooden board, six pits a side, a store at each end

import { useState, useCallback } from 'react'
import { Pit } from './Pit'
import { Store } from './Store'
import type { Board as BoardType, Player } from '@/types/mancala.types'
import { P1_PITS, P2_PITS, P1_STORE, P2_STORE, simulateMove } from '@/lib/mancalaRules'

interface BoardProps {
  board: BoardType
  currentPlayer: Player
  validMoves: number[]
  onPitClick: (pitIndex: number) => void
  isAIThinking: boolean
  isAnimating?: boolean
  playerName: string
  gameMode: 'vsAI' | 'vsHuman' | 'tutorial'
  isReducedMotion?: boolean
  activePit?: number | null
  opponentName?: string
}

interface PreviewData {
  affectedPits: number[]
  stoneCounts: Record<number, number>
  lastPit: number
  extraTurn: boolean
  willCapture: boolean
  capturedStones: number
}

export function Board({
  board,
  currentPlayer,
  validMoves,
  onPitClick,
  isAIThinking,
  isAnimating = false,
  playerName,
  gameMode,
  isReducedMotion = false,
  activePit = null,
  opponentName = 'AI',
}: BoardProps) {
  const [hoveredPit, setHoveredPit] = useState<number | null>(null)
  const [previewData, setPreviewData] = useState<PreviewData | null>(null)

  const isPitClickable = useCallback(
    (pitIndex: number) => validMoves.includes(pitIndex) && !isAIThinking && !isAnimating,
    [validMoves, isAIThinking, isAnimating]
  )

  const handlePitHover = useCallback(
    (pitIndex: number | null) => {
      if (pitIndex === null || !isPitClickable(pitIndex)) {
        setHoveredPit(null)
        setPreviewData(null)
        return
      }
      setHoveredPit(pitIndex)
      setPreviewData(simulateMove(board, pitIndex, currentPlayer))
    },
    [isPitClickable, board, currentPlayer]
  )

  const renderPit = (pitIndex: number, label: string) => (
    <Pit
      key={pitIndex}
      stones={board.pits[pitIndex]}
      pitIndex={pitIndex}
      isClickable={isPitClickable(pitIndex)}
      isHighlighted={validMoves.includes(pitIndex) && !isAIThinking}
      onClick={() => onPitClick(pitIndex)}
      onHover={handlePitHover}
      label={label}
      isPreviewActive={hoveredPit !== null}
      willReceiveStone={previewData?.affectedPits.includes(pitIndex) || false}
      previewStoneCount={previewData?.stoneCounts[pitIndex] || 0}
      isLastPit={previewData?.lastPit === pitIndex}
      isReducedMotion={isReducedMotion}
      isKeyboardActive={activePit === pitIndex}
    />
  )

  const previewNote = previewData
    ? previewData.willCapture
      ? `Captures ${previewData.capturedStones}`
      : previewData.extraTurn
        ? 'Go again'
        : 'Regular move'
    : ''

  return (
    <div className="w-full">
      <div className="arcade-board mx-auto rounded-2xl border-[3px] border-[#5c3d21] bg-[#7a5230] p-1 sm:border-[7px] sm:p-3">
        <div className="grid grid-cols-[1.75rem_repeat(6,minmax(0,1fr))_1.75rem] grid-rows-2 gap-x-[2px] gap-y-2 sm:grid-cols-[4.5rem_repeat(6,minmax(0,1fr))_4.5rem] sm:gap-x-2 sm:gap-y-3">
          <Store
            className="col-start-1 row-span-2 row-start-1"
            stones={board.pits[P2_STORE]}
            player={2}
            isCurrentPlayer={currentPlayer === 2}
            label={gameMode === 'vsHuman' ? 'Player 2' : opponentName}
            isReducedMotion={isReducedMotion}
          />

          {[...P2_PITS].reverse().map((pitIndex, i) => (
            <div key={pitIndex} className="row-start-1 min-w-0" style={{ gridColumnStart: i + 2 }}>
              {renderPit(pitIndex, `${12 - pitIndex + 1}`)}
            </div>
          ))}

          {P1_PITS.map((pitIndex, i) => (
            <div key={pitIndex} className="row-start-2 min-w-0" style={{ gridColumnStart: i + 2 }}>
              {renderPit(pitIndex, `${pitIndex + 1}`)}
            </div>
          ))}

          <Store
            className="col-start-8 row-span-2 row-start-1"
            stones={board.pits[P1_STORE]}
            player={1}
            isCurrentPlayer={currentPlayer === 1}
            label={playerName}
            isReducedMotion={isReducedMotion}
          />
        </div>
      </div>
      <p className="mt-2 h-5 text-center text-sm text-muted-foreground" aria-hidden="true">
        {hoveredPit !== null ? previewNote : ''}
      </p>
    </div>
  )
}
