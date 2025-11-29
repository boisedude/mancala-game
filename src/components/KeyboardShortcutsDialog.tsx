// Keyboard Shortcuts Dialog - Shows all available keyboard shortcuts

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { GameMode } from '@/types/mancala.types'

interface KeyboardShortcutsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  gameMode: GameMode
}

interface ShortcutGroup {
  title: string
  shortcuts: Array<{
    keys: string[]
    description: string
    condition?: string
  }>
}

export function KeyboardShortcutsDialog({
  open,
  onOpenChange,
  gameMode,
}: KeyboardShortcutsDialogProps) {
  const shortcutGroups: ShortcutGroup[] = [
    {
      title: 'Pit Selection',
      shortcuts: [
        {
          keys: ['1', '2', '3', '4', '5', '6'],
          description: "Select Player 1's pits (left to right)",
        },
        ...(gameMode === 'vsHuman'
          ? [
              {
                keys: ['7', '8', '9', '10', '11', '12'],
                description: "Select Player 2's pits (left to right)",
              },
            ]
          : []),
      ],
    },
    {
      title: 'Navigation',
      shortcuts: [
        {
          keys: ['←', '→'],
          description: 'Navigate between valid pits',
        },
        {
          keys: ['Enter', 'Space'],
          description: 'Confirm move on highlighted pit',
        },
        {
          keys: ['Esc'],
          description: 'Clear pit selection',
        },
      ],
    },
    {
      title: 'Game Controls',
      shortcuts: [
        {
          keys: ['U'],
          description: 'Undo last move',
          condition: 'When available',
        },
        {
          keys: ['N'],
          description: 'Start new game',
        },
        {
          keys: ['?', '/'],
          description: 'Show this help dialog',
        },
      ],
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <span className="text-3xl">⌨️</span>
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Master the game with these keyboard controls for faster gameplay
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {shortcutGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">{group.title}</h3>
              <div className="space-y-2">
                {group.shortcuts.map((shortcut, shortcutIndex) => (
                  <div
                    key={shortcutIndex}
                    className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card/50 p-3 transition-colors hover:bg-card"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      {shortcut.keys.map((key, keyIndex) => (
                        <kbd
                          key={keyIndex}
                          className="inline-flex min-w-[2rem] items-center justify-center rounded-md border border-border bg-muted px-2 py-1 font-mono text-sm font-semibold text-foreground shadow-sm"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-sm text-muted-foreground">{shortcut.description}</p>
                      {shortcut.condition && (
                        <p className="text-xs italic text-muted-foreground/70">
                          {shortcut.condition}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Visual Guide */}
          <div className="space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <h3 className="text-lg font-semibold text-foreground">Visual Guide</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">🔵</span>
                <span>
                  <strong className="text-foreground">Pulsing ring:</strong> Valid moves you can
                  make
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-yellow-600 dark:text-yellow-400">🟡</span>
                <span>
                  <strong className="text-foreground">Yellow highlight:</strong> Currently selected
                  pit (keyboard)
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400">🟢</span>
                <span>
                  <strong className="text-foreground">Green ring:</strong> Last pit preview
                  (hover)
                </span>
              </div>
            </div>
          </div>

          {/* Pro Tips */}
          <div className="space-y-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-amber-900 dark:text-amber-100">
              <span>💡</span>
              Pro Tips
            </h3>
            <ul className="space-y-1 text-sm text-amber-900/80 dark:text-amber-100/80">
              <li className="flex gap-2">
                <span>•</span>
                <span>Use arrow keys to quickly scan through your valid moves</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Number keys provide direct access to specific pits</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Hover over pits with your mouse to see move previews</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Press Escape to deselect and start your selection over</span>
              </li>
            </ul>
          </div>

          {/* Accessibility Note */}
          <div className="rounded-lg border border-border bg-muted/50 p-3 text-center text-xs text-muted-foreground">
            <p>
              Keyboard shortcuts work alongside mouse/touch controls. Choose whichever method you
              prefer!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
