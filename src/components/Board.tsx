// Mancala game board component with enhanced visuals

import { useState, useCallback } from 'react'
import { Pit } from './Pit'
import { Store } from './Store'
import type { Board as BoardType, Player } from '@/types/mancala.types'
import { P1_PITS, P2_PITS, P1_STORE, P2_STORE, simulateMove } from '@/lib/mancalaRules'
import { BoardPattern, BoardCorner } from '@/components/graphics'
import { cn } from '@/lib/utils'

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
}: BoardProps) {
  const [hoveredPit, setHoveredPit] = useState<number | null>(null)
  const [previewData, setPreviewData] = useState<{
    affectedPits: number[]
    lastPit: number
    extraTurn: boolean
    willCapture: boolean
    capturedStones: number
  } | null>(null)

  const isPitClickable = useCallback(
    (pitIndex: number) => {
      return validMoves.includes(pitIndex) && !isAIThinking && !isAnimating
    },
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
      const preview = simulateMove(board, pitIndex, currentPlayer)
      setPreviewData(preview)
    },
    [isPitClickable, board, currentPlayer]
  )

  return (
    <div className="mx-auto w-full max-w-4xl p-4 md:p-6">
      {/* Board container with enhanced wood texture and ambient effects */}
      <div
        className={cn(
          'relative rounded-3xl p-4 md:p-6',
          // Premium wood grain background
          'bg-gradient-to-br from-amber-100 via-amber-50 to-amber-100',
          'dark:from-amber-950 dark:via-slate-950 dark:to-amber-950',
          // Enhanced border with metallic accent
          'border-4 border-amber-300 dark:border-amber-800',
          'shadow-2xl',
          // Ambient glow
          'ambient-glow',
          // Breathing animation
          !isReducedMotion && 'animate-board-breathe'
        )}
      >
        {/* Wood grain texture overlay */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none wood-grain opacity-60"
          aria-hidden="true"
        />

        {/* Decorative pattern overlay */}
        <BoardPattern className="rounded-3xl opacity-30" />

        {/* Premium metallic edge highlight */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none border-2 border-amber-200/30 dark:border-amber-700/20" />

        {/* Inner shadow for depth */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1), inset 0 -2px 10px rgba(255,255,255,0.05)',
          }}
        />

        {/* Decorative corners with enhanced styling */}
        <div className="absolute left-2 top-2 opacity-80">
          <BoardCorner position="top-left" />
        </div>
        <div className="absolute right-2 top-2 opacity-80">
          <BoardCorner position="top-right" />
        </div>
        <div className="absolute bottom-2 left-2 opacity-80">
          <BoardCorner position="bottom-left" />
        </div>
        <div className="absolute bottom-2 right-2 opacity-80">
          <BoardCorner position="bottom-right" />
        </div>

        {/* Direction Guide - Counter-clockwise arrows */}
        <div className="absolute left-0 right-0 top-0 bottom-0 pointer-events-none">
          {/* Right side arrow (going up) */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-amber-500/40 dark:text-amber-400/25">
            <svg width="24" height="48" viewBox="0 0 24 48" fill="currentColor">
              <path d="M12 8 L12 40 M12 8 L8 12 M12 8 L16 12" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          {/* Top arrow (going left) */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-amber-500/40 dark:text-amber-400/25">
            <svg width="48" height="24" viewBox="0 0 48 24" fill="currentColor">
              <path d="M40 12 L8 12 M8 12 L12 8 M8 12 L12 16" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          {/* Bottom arrow (going right) */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-amber-500/40 dark:text-amber-400/25">
            <svg width="48" height="24" viewBox="0 0 48 24" fill="currentColor">
              <path d="M8 12 L40 12 M40 12 L36 8 M40 12 L36 16" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* AI thinking indicator with enhanced styling */}
        {isAIThinking && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-black/10 backdrop-blur-sm dark:bg-black/30 animate-in fade-in duration-200">
            <div className="flex items-center gap-3 rounded-xl bg-background/95 px-6 py-4 shadow-2xl border-2 border-primary/30 animate-in zoom-in duration-200">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
              <span className="font-semibold text-primary">AI is thinking...</span>
            </div>
          </div>
        )}

        {/* Animation in progress overlay */}
        {isAnimating && !isAIThinking && (
          <div className="absolute inset-0 z-10 cursor-wait rounded-3xl bg-transparent" />
        )}

        {/* Score Differential Indicator - Enhanced */}
        <div className="mb-4 flex items-center justify-center">
          {(() => {
            const playerScore = board.pits[P1_STORE]
            const aiScore = board.pits[P2_STORE]
            const diff = playerScore - aiScore
            const totalStones = 48
            const playerPercentage = (playerScore / totalStones) * 100
            const aiPercentage = (aiScore / totalStones) * 100

            return (
              <div className="w-full max-w-md space-y-2">
                {/* Score bar with enhanced gradients */}
                <div className="flex h-8 overflow-hidden rounded-full border-2 border-border/50 bg-background/80 shadow-inner backdrop-blur-sm">
                  <div
                    className="flex items-center justify-center bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-xs font-bold text-white transition-all duration-500 ease-out"
                    style={{ width: `${Math.max(playerPercentage, 0)}%` }}
                  >
                    {playerScore > 0 && <span className="px-2 drop-shadow-sm">{playerScore}</span>}
                  </div>
                  <div
                    className="flex items-center justify-center bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600 text-xs font-bold text-white transition-all duration-500 ease-out"
                    style={{ width: `${Math.max(aiPercentage, 0)}%` }}
                  >
                    {aiScore > 0 && <span className="px-2 drop-shadow-sm">{aiScore}</span>}
                  </div>
                </div>
                {/* Differential text with enhanced styling */}
                {diff !== 0 && (
                  <div className="text-center text-sm font-semibold">
                    {diff > 0 ? (
                      <span className="text-green-600 dark:text-green-400 flex items-center justify-center gap-1">
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        +{diff} ahead
                      </span>
                    ) : (
                      <span className="text-rose-600 dark:text-rose-400 flex items-center justify-center gap-1">
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {diff} behind
                      </span>
                    )}
                  </div>
                )}
              </div>
            )
          })()}
        </div>

        {/* Main board layout */}
        <div className="flex items-center gap-3 md:gap-6">
          {/* Player 2 Store (right side) */}
          <Store
            stones={board.pits[P2_STORE]}
            player={2}
            isCurrentPlayer={currentPlayer === 2}
            label={gameMode === 'vsHuman' ? 'Player 2' : 'AI'}
            isReducedMotion={isReducedMotion}
          />

          {/* Playing field with enhanced styling */}
          <div className="flex flex-1 flex-col gap-4 md:gap-6">
            {/* Player 2 pits (top row, reversed for visual layout) */}
            <div className="relative">
              {/* Opponent Side Label - Enhanced */}
              <div className="absolute -top-8 left-0 right-0 flex items-center justify-center gap-2">
                <div className="rounded-full border-2 border-rose-200 bg-gradient-to-r from-rose-50 to-rose-100 px-4 py-1 text-xs font-bold text-rose-700 shadow-sm dark:border-rose-800 dark:from-rose-950/80 dark:to-rose-900/80 dark:text-rose-300">
                  {gameMode === 'vsHuman' ? "PLAYER 2'S PITS" : "OPPONENT'S PITS"}
                </div>
              </div>
              <div className="flex justify-center gap-2 md:gap-3">
                {[...P2_PITS].reverse().map(pitIndex => (
                  <Pit
                    key={pitIndex}
                    stones={board.pits[pitIndex]}
                    pitIndex={pitIndex}
                    isClickable={isPitClickable(pitIndex)}
                    isHighlighted={currentPlayer === 2 && validMoves.includes(pitIndex)}
                    onClick={() => onPitClick(pitIndex)}
                    onHover={handlePitHover}
                    label={`${12 - pitIndex + 1}`}
                    isPreviewActive={hoveredPit !== null}
                    willReceiveStone={previewData?.affectedPits.includes(pitIndex) || false}
                    isLastPit={previewData?.lastPit === pitIndex}
                    isReducedMotion={isReducedMotion}
                    isKeyboardActive={activePit === pitIndex}
                  />
                ))}
              </div>
            </div>

            {/* Divider with enhanced direction indicator */}
            <div className="relative">
              <div className="h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent dark:via-amber-600/40" />
              {/* Counter-clockwise direction indicator */}
              <div className="absolute -right-12 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 text-xs text-amber-600/70 dark:text-amber-400/50">
                <span className="text-2xl">&#x21bb;</span>
              </div>
            </div>

            {/* Player 1 pits (bottom row) */}
            <div className="relative">
              <div className="flex justify-center gap-2 md:gap-3">
                {P1_PITS.map(pitIndex => (
                  <Pit
                    key={pitIndex}
                    stones={board.pits[pitIndex]}
                    pitIndex={pitIndex}
                    isClickable={isPitClickable(pitIndex)}
                    isHighlighted={currentPlayer === 1 && validMoves.includes(pitIndex)}
                    onClick={() => onPitClick(pitIndex)}
                    onHover={handlePitHover}
                    label={`${pitIndex + 1}`}
                    isPreviewActive={hoveredPit !== null}
                    willReceiveStone={previewData?.affectedPits.includes(pitIndex) || false}
                    isLastPit={previewData?.lastPit === pitIndex}
                    isReducedMotion={isReducedMotion}
                    isKeyboardActive={activePit === pitIndex}
                  />
                ))}
              </div>
              {/* Your Side Label - Enhanced */}
              <div className="absolute -bottom-8 left-0 right-0 flex items-center justify-center gap-2">
                <div className="rounded-full border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-1 text-xs font-bold text-blue-700 shadow-sm dark:border-blue-800 dark:from-blue-950/80 dark:to-blue-900/80 dark:text-blue-300">
                  YOUR PITS (Click to Play)
                </div>
              </div>
            </div>
          </div>

          {/* Player 1 Store (left side) */}
          <Store
            stones={board.pits[P1_STORE]}
            player={1}
            isCurrentPlayer={currentPlayer === 1}
            label={playerName}
            isReducedMotion={isReducedMotion}
          />
        </div>

        {/* Current player indicator - Enhanced with glow */}
        <div className="mt-6 text-center">
          <div
            className={cn(
              "inline-flex items-center gap-3 rounded-full px-6 py-3 shadow-xl backdrop-blur-sm",
              "border-2 transition-all duration-300",
              currentPlayer === 1
                ? "bg-gradient-to-r from-blue-500 to-blue-600 border-blue-300 text-white shadow-blue-500/30"
                : "bg-gradient-to-r from-rose-500 to-rose-600 border-rose-300 text-white shadow-rose-500/30"
            )}
          >
            <div
              className={cn(
                'h-4 w-4 rounded-full bg-white shadow-inner',
                !isReducedMotion && 'animate-pulse'
              )}
            />
            <span className="text-base font-bold drop-shadow-sm">
              {currentPlayer === 1
                ? `${playerName}'s Turn`
                : gameMode === 'vsHuman'
                  ? "Player 2's Turn"
                  : "AI's Turn"}
            </span>
            {currentPlayer === 1 && (
              <span className="text-sm font-normal opacity-90 hidden sm:inline">
                &#8592; Click Your Pits
              </span>
            )}
          </div>
        </div>

        {/* Move Preview Tooltip - Enhanced */}
        {previewData && hoveredPit !== null && (
          <div className="mt-4 text-center duration-300 animate-in fade-in slide-in-from-bottom-2">
            <div className="inline-flex items-center gap-3 rounded-xl border-2 border-primary/30 bg-gradient-to-r from-primary/15 via-primary/10 to-primary/5 px-5 py-3 text-sm shadow-lg backdrop-blur-sm">
              {previewData.extraTurn && (
                <span className={cn(
                  'flex items-center gap-2 font-bold text-primary',
                  !isReducedMotion && 'animate-bounce-subtle'
                )}>
                  <span className="text-xl">&#x21bb;</span>
                  <span>Extra Turn!</span>
                </span>
              )}
              {previewData.willCapture && (
                <span className={cn(
                  'flex items-center gap-2 font-bold text-green-600 dark:text-green-400',
                  !isReducedMotion && 'animate-bounce-subtle'
                )}>
                  <span className="text-xl">&#x2728;</span>
                  <span>Capture {previewData.capturedStones} stones!</span>
                </span>
              )}
              {!previewData.extraTurn && !previewData.willCapture && (
                <span className="text-muted-foreground font-medium">Regular move</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
