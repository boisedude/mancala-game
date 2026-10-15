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
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Keyboard shortcuts</DialogTitle>
          <DialogDescription>Faster play without the mouse</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-1">
          {shortcutGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-2">
              <h3 className="text-base font-semibold text-foreground">{group.title}</h3>
              <div className="space-y-2">
                {group.shortcuts.map((shortcut, shortcutIndex) => (
                  <div
                    key={shortcutIndex}
                    className="flex items-center justify-between gap-4 rounded-md border border-border p-2"
                  >
                    <div className="flex flex-wrap items-center gap-1.5">
                      {shortcut.keys.map((key, keyIndex) => (
                        <kbd
                          key={keyIndex}
                          className="inline-flex min-w-[2rem] items-center justify-center rounded-md border border-border bg-muted px-2 py-1 text-sm font-semibold text-foreground"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-sm text-muted-foreground">{shortcut.description}</p>
                      {shortcut.condition && (
                        <p className="text-xs text-muted-foreground">{shortcut.condition}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="space-y-2">
            <h3 className="text-base font-semibold text-foreground">On the board</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>A thin sagebrush ring marks the pits you can play.</li>
              <li>A thicker ring shows the pit under the pointer or the keyboard selection.</li>
              <li>Hover over a pit to preview whether it gives a capture or another turn.</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
