// Settings dialog for game preferences

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { AnimationSpeed, HintLevel, GameSettings } from '@/hooks/useGameSettings'

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  settings: GameSettings
  onUpdateSetting: <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => void
  onReset: () => void
}

export function SettingsDialog({
  open,
  onOpenChange,
  settings,
  onUpdateSetting,
  onReset,
}: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Settings</DialogTitle>
          <DialogDescription>
            Animation, display and feedback
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Animation speed */}
          <div className="space-y-2">
            <label htmlFor="animation-speed" className="text-sm font-semibold">Animation speed</label>
            <p className="text-xs text-muted-foreground">
              Control how fast stones move during gameplay
            </p>
            <Select
              value={settings.animationSpeed}
              onValueChange={(value: AnimationSpeed) =>
                onUpdateSetting('animationSpeed', value)
              }
            >
              <SelectTrigger id="animation-speed" className="h-11 w-full" aria-label="Select animation speed">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="off">
                  Off (Instant)
                </SelectItem>
                <SelectItem value="fast">
                  Fast (75ms)
                </SelectItem>
                <SelectItem value="normal">
                  Normal (150ms)
                </SelectItem>
                <SelectItem value="slow">
                  Slow (300ms)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Move hints */}
          <div className="space-y-2">
            <label htmlFor="move-hints" className="text-sm font-semibold">Move hints</label>
            <p className="text-xs text-muted-foreground">
              Get suggestions for your next move 
            </p>
            <Select
              value={settings.showMoveHints}
              onValueChange={(value: HintLevel) =>
                onUpdateSetting('showMoveHints', value)
              }
            >
              <SelectTrigger id="move-hints" className="h-11 w-full" aria-label="Select hint level">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="off">Off</SelectItem>
                <SelectItem value="basic">Basic (Show best move)</SelectItem>
                <SelectItem value="advanced">Advanced (Show top 3 moves)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Toggle Options */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-sm font-semibold">Display</h3>

            <label className="flex min-h-11 cursor-pointer items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium" id="stats-label">Game statistics</div>
                <div className="text-xs text-muted-foreground">
                  Show a line of running stats under the board
                </div>
              </div>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={settings.showGameStats}
                  onChange={e => onUpdateSetting('showGameStats', e.target.checked)}
                  aria-labelledby="stats-label"
                  role="switch"
                  aria-checked={settings.showGameStats}
                />
                <div className="h-6 w-11 rounded-full bg-border peer-checked:bg-primary transition-colors" />
                <div className="absolute left-0.5 h-5 w-5 rounded-full bg-foreground shadow transition-transform peer-checked:translate-x-5" />
              </div>
            </label>

            <label className="flex min-h-11 cursor-pointer items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium" id="history-label">Move history</div>
                <div className="text-xs text-muted-foreground">
                  Show a timeline of all moves made
                </div>
              </div>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={settings.showMoveHistory}
                  onChange={e => onUpdateSetting('showMoveHistory', e.target.checked)}
                  aria-labelledby="history-label"
                  role="switch"
                  aria-checked={settings.showMoveHistory}
                />
                <div className="h-6 w-11 rounded-full bg-border peer-checked:bg-primary transition-colors" />
                <div className="absolute left-0.5 h-5 w-5 rounded-full bg-foreground shadow transition-transform peer-checked:translate-x-5" />
              </div>
            </label>

            <label className="flex min-h-11 cursor-pointer items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium" id="haptic-label">Haptic feedback</div>
                <div className="text-xs text-muted-foreground">
                  Vibrate on interactions (requires mobile device)
                </div>
              </div>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={settings.hapticFeedback}
                  onChange={e => onUpdateSetting('hapticFeedback', e.target.checked)}
                  aria-labelledby="haptic-label"
                  role="switch"
                  aria-checked={settings.hapticFeedback}
                />
                <div className="h-6 w-11 rounded-full bg-border peer-checked:bg-primary transition-colors" />
                <div className="absolute left-0.5 h-5 w-5 rounded-full bg-foreground shadow transition-transform peer-checked:translate-x-5" />
              </div>
            </label>
          </div>

          {/* Reset Button */}
          <div className="border-t pt-4">
            <Button onClick={onReset} variant="outline" className="h-11" type="button">
              Reset to defaults
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
