// Stats dialog: running record and achievements as plain rows

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { LeaderboardEntry, Achievement } from '@/types/mancala.types'

interface LeaderboardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  stats: LeaderboardEntry
  achievements?: Achievement[]
  onReset: () => void
  onShare: () => void
}

export function LeaderboardDialog({
  open,
  onOpenChange,
  stats,
  achievements = [],
  onReset,
  onShare,
}: LeaderboardDialogProps) {
  const winRate =
    stats.totalGamesPlayed > 0 ? ((stats.wins / stats.totalGamesPlayed) * 100).toFixed(1) : '0.0'

  const unlocked = achievements.filter(a => a.unlockedAt !== null)
  const locked = achievements.filter(a => a.unlockedAt === null)

  const formatTime = (seconds: number) => {
    if (seconds === Infinity) return 'N/A'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Your stats</DialogTitle>
          <DialogDescription>Your Mancala record on this device</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <StatRow label="Wins" value={stats.wins} />
            <StatRow label="Losses" value={stats.losses} />
            <StatRow label="Win rate" value={`${winRate}%`} />
            <StatRow label="Games played" value={stats.totalGamesPlayed} />
            <StatRow label="Current streak" value={`${stats.winStreak} wins`} />
            <StatRow label="Highest capture" value={`${stats.highestCapture} stones`} />
            <StatRow label="Fastest win" value={formatTime(stats.fastestWin)} />
          </div>

          {achievements.length > 0 && (
            <div className="space-y-2 border-t pt-4">
              <h3 className="text-sm font-semibold">
                Achievements ({unlocked.length}/{achievements.length})
              </h3>
              <ul className="space-y-2">
                {unlocked.map(a => (
                  <li key={a.id} className="text-sm">
                    <span className="font-medium">{a.name}</span>
                    <span className="block text-xs text-muted-foreground">{a.description}</span>
                  </li>
                ))}
                {locked.slice(0, 3).map(a => (
                  <li key={a.id} className="text-sm text-muted-foreground">
                    <span className="block">Locked</span>
                    <span className="block text-xs">
                      {a.description}
                      {a.progress !== undefined && a.target ? ` (${a.progress}/${a.target})` : ''}
                    </span>
                  </li>
                ))}
              </ul>
              {locked.length > 3 && (
                <p className="text-xs text-muted-foreground">+{locked.length - 3} more to unlock</p>
              )}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button onClick={onShare} variant="outline" className="h-11 flex-1">
              Share
            </Button>
            <Button
              onClick={onReset}
              variant="outline"
              className="h-11 flex-1 text-destructive hover:text-destructive"
            >
              Reset stats
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold tabular-nums">{value}</span>
    </div>
  )
}
