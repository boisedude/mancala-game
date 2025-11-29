// How to Play dialog - comprehensive rules and game explanation

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons'

interface HowToPlayDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onStartTutorial?: () => void
}

export function HowToPlayDialog({ open, onOpenChange, onStartTutorial }: HowToPlayDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-3xl">
            <span className="text-4xl">🎯</span>
            How to Play Mancala
          </DialogTitle>
          <DialogDescription className="text-base">
            Master this ancient strategy game and capture more stones than your opponent!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Game Objective - MOST IMPORTANT */}
          <section className="space-y-3">
            <div className="flex items-center justify-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white font-bold text-2xl">
                🏆
              </div>
              <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
                #1 Goal: Collect More Stones Than Opponent!
              </h3>
            </div>
            <div className="rounded-xl border-4 border-green-500/50 bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-5 shadow-lg">
              <p className="text-lg font-bold text-center mb-3">
                The player with <span className="text-green-600 dark:text-green-400">MORE STONES</span> in their STORE wins!
              </p>
              <div className="space-y-2 text-sm bg-background/50 rounded p-3">
                <p className="flex items-center gap-2">
                  <span className="text-lg">📦</span>
                  <span><strong>Your Store:</strong> The large vertical pit on the RIGHT side of the board</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-lg">🎯</span>
                  <span><strong>How to Win:</strong> Get stones into your store by making moves and capturing</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-lg">🏁</span>
                  <span><strong>Game Ends:</strong> When all 6 pits on one side are empty (remaining stones go to their owners)</span>
                </p>
              </div>
            </div>
          </section>

          {/* Game Setup */}
          <section className="space-y-3">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <span className="text-2xl">⚙️</span>
              Game Setup
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border bg-card p-4">
                <div className="text-3xl mb-2">🎲</div>
                <h4 className="font-semibold mb-1">The Board</h4>
                <p className="text-sm text-muted-foreground">
                  <strong>6 pits</strong> per player (small circles)<br />
                  <strong>1 store</strong> per player (large vertical pit)<br />
                  Each pit starts with <strong>4 stones</strong>
                </p>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="text-3xl mb-2">👥</div>
                <h4 className="font-semibold mb-1">Players</h4>
                <p className="text-sm text-muted-foreground">
                  <strong>You</strong>: Bottom row + right store<br />
                  <strong>Opponent</strong>: Top row + left store<br />
                  Player 1 (You) goes first!
                </p>
              </div>
            </div>
          </section>

          {/* How to Play */}
          <section className="space-y-3">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <span className="text-2xl">🎮</span>
              How to Play
            </h3>
            <div className="space-y-3">
              <div className="rounded-lg border-l-4 border-l-blue-500 bg-blue-500/5 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Pick Up Stones</h4>
                    <p className="text-sm text-muted-foreground">
                      On your turn, click any pit <strong>on your side</strong> (bottom row) that has stones. You'll pick up ALL stones from that pit.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border-l-4 border-l-purple-500 bg-purple-500/5 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-500 text-xs font-bold text-white">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Distribute Counter-Clockwise</h4>
                    <p className="text-sm text-muted-foreground">
                      Drop one stone in each pit moving <strong>counter-clockwise</strong> (to the right, then around). Include your own store, but <strong>skip your opponent's store</strong>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border-l-4 border-l-amber-500 bg-amber-500/5 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Pass Turn (Usually)</h4>
                    <p className="text-sm text-muted-foreground">
                      After distributing all stones, it's your opponent's turn... <strong>unless you triggered a special rule!</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Special Rules */}
          <section className="space-y-3">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <span className="text-2xl">✨</span>
              Special Rules (Master These to Win!)
            </h3>
            <div className="space-y-3">
              <div className="rounded-lg border-2 border-green-500/50 bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">🔄</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-2 text-green-600 dark:text-green-400">
                      Extra Turn Rule
                    </h4>
                    <p className="text-sm mb-2">
                      If your last stone lands in <strong>YOUR STORE</strong>, you get to go again immediately! This is huge for strategy.
                    </p>
                    <div className="rounded bg-background/50 p-2 text-xs text-muted-foreground border">
                      <strong>Example:</strong> Pit has 3 stones, 3 moves away from your store → lands in store → EXTRA TURN! 🎉
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border-2 border-emerald-500/50 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-4">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">💎</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-2 text-emerald-600 dark:text-emerald-400">
                      Capture Rule
                    </h4>
                    <p className="text-sm mb-2">
                      If your last stone lands in an <strong>EMPTY pit on YOUR side</strong>, AND the opposite pit has stones, you capture ALL stones from both pits!
                    </p>
                    <div className="rounded bg-background/50 p-2 text-xs text-muted-foreground border">
                      <strong>Example:</strong> Last stone → empty pit #2 (your side) → opposite pit #11 has 5 stones → You capture 1 + 5 = 6 stones to your store! 💰
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Ending the Game */}
          <section className="space-y-3">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <span className="text-2xl">🏁</span>
              How the Game Ends
            </h3>
            <div className="rounded-lg border-2 border-red-500/30 bg-red-500/5 p-4">
              <div className="space-y-2 text-sm">
                <p>
                  <strong className="text-red-600 dark:text-red-400">End Condition:</strong> The game ends when all 6 pits on one side (yours or opponent's) are completely empty.
                </p>
                <p>
                  <strong className="text-red-600 dark:text-red-400">Final Scoring:</strong> Any remaining stones automatically go to their owner's store.
                </p>
                <p className="pt-2 border-t">
                  <strong className="text-lg text-red-600 dark:text-red-400">🏆 WINNER:</strong> The player with the <strong>MOST STONES</strong> in their store wins!
                </p>
              </div>
            </div>
          </section>

          {/* Strategy Tips */}
          <section className="space-y-3">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <span className="text-2xl">🧠</span>
              Pro Strategy Tips
            </h3>
            <div className="rounded-lg bg-muted/50 p-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Count ahead:</strong> Mentally count where your last stone will land before moving.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Chain extra turns:</strong> Set up multiple pits to land in your store for consecutive moves.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Protect captures:</strong> Don't leave empty pits vulnerable to opponent captures.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Empty your side first:</strong> Control when the game ends by emptying your pits strategically.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Watch the preview:</strong> Hover over pits to see where stones will land and if you'll get captures or extra turns!</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Interactive Tutorial CTA */}
          {onStartTutorial && (
            <section className="rounded-lg border-2 border-primary bg-primary/5 p-6 text-center">
              <div className="text-4xl mb-3">🎓</div>
              <h3 className="text-xl font-bold mb-2">Learn by Doing!</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Want hands-on practice? Try our interactive tutorial with guided moves and instant feedback.
              </p>
              <Button
                onClick={() => {
                  onOpenChange(false)
                  onStartTutorial()
                }}
                size="lg"
                className="gap-2"
              >
                <QuestionMarkCircledIcon className="h-5 w-5" />
                Start Interactive Tutorial
              </Button>
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
