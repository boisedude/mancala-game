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
import { ResetIcon } from '@radix-ui/react-icons'

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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Game Settings</DialogTitle>
          <DialogDescription>
            Customize your Mancala gameplay experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Animation Speed */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Animation Speed</label>
            <p className="text-xs text-muted-foreground">
              Control how fast stones move during gameplay
            </p>
            <Select
              value={settings.animationSpeed}
              onValueChange={(value: AnimationSpeed) =>
                onUpdateSetting('animationSpeed', value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="off">
                  <div className="flex items-center gap-2">
                    <span>⚡</span>
                    <span>Off (Instant)</span>
                  </div>
                </SelectItem>
                <SelectItem value="fast">
                  <div className="flex items-center gap-2">
                    <span>🐇</span>
                    <span>Fast (75ms)</span>
                  </div>
                </SelectItem>
                <SelectItem value="normal">
                  <div className="flex items-center gap-2">
                    <span>🚶</span>
                    <span>Normal (150ms)</span>
                  </div>
                </SelectItem>
                <SelectItem value="slow">
                  <div className="flex items-center gap-2">
                    <span>🐢</span>
                    <span>Slow (300ms)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Move Hints */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Move Hints</label>
            <p className="text-xs text-muted-foreground">
              Get suggestions for your next move (coming soon)
            </p>
            <Select
              value={settings.showMoveHints}
              onValueChange={(value: HintLevel) =>
                onUpdateSetting('showMoveHints', value)
              }
            >
              <SelectTrigger className="w-full">
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
            <h3 className="text-sm font-semibold">Display Options</h3>

            <label className="flex items-center justify-between cursor-pointer group">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Game Statistics</div>
                <div className="text-xs text-muted-foreground">
                  Show real-time stats during gameplay
                </div>
              </div>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={settings.showGameStats}
                  onChange={e => onUpdateSetting('showGameStats', e.target.checked)}
                />
                <div className="h-6 w-11 rounded-full bg-muted peer-checked:bg-primary transition-colors" />
                <div className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer group">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Move History</div>
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
                />
                <div className="h-6 w-11 rounded-full bg-muted peer-checked:bg-primary transition-colors" />
                <div className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer group">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Victory Celebrations</div>
                <div className="text-xs text-muted-foreground">
                  Show confetti and effects when you win
                </div>
              </div>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={settings.showVictoryCelebration}
                  onChange={e => onUpdateSetting('showVictoryCelebration', e.target.checked)}
                />
                <div className="h-6 w-11 rounded-full bg-muted peer-checked:bg-primary transition-colors" />
                <div className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer group">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Haptic Feedback (Mobile)</div>
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
                />
                <div className="h-6 w-11 rounded-full bg-muted peer-checked:bg-primary transition-colors" />
                <div className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
              </div>
            </label>
          </div>

          {/* Reset Button */}
          <div className="border-t pt-4">
            <Button
              onClick={onReset}
              variant="outline"
              className="w-full gap-2"
              type="button"
            >
              <ResetIcon className="h-4 w-4" />
              Reset to Defaults
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
