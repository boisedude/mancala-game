// Leaderboard dialog - displays player stats

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { LeaderboardEntry, Achievement } from '@/types/mancala.types'
import { Share1Icon, ResetIcon, LockClosedIcon } from '@radix-ui/react-icons'

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

  const unlockedAchievements = achievements.filter(a => a.unlockedAt !== null)
  const lockedAchievements = achievements.filter(a => a.unlockedAt === null)

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
          <DialogTitle className="text-2xl">Your Stats</DialogTitle>
          <DialogDescription>Track your Mancala performance over time</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Wins" value={stats.wins} />
            <StatCard label="Losses" value={stats.losses} />
            <StatCard label="Win Rate" value={`${winRate}%`} />
            <StatCard label="Games Played" value={stats.totalGamesPlayed} />
          </div>

          {/* Additional Stats */}
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="space-y-3 pt-6">
              <StatRow label="Current Streak" value={`${stats.winStreak} wins`} />
              <StatRow label="Highest Capture" value={`${stats.highestCapture} stones`} />
              <StatRow label="Fastest Win" value={formatTime(stats.fastestWin)} />
            </CardContent>
          </Card>

          {/* Achievements Section */}
          {achievements.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">
                  Achievements ({unlockedAchievements.length}/{achievements.length})
                </h3>
              </div>

              {/* Unlocked Achievements */}
              {unlockedAchievements.length > 0 && (
                <div className="space-y-2">
                  {unlockedAchievements.map(achievement => (
                    <Card key={achievement.id} className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950">
                      <CardContent className="flex items-center gap-3 p-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-xl dark:bg-yellow-600">
                          {achievement.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm">{achievement.name}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {achievement.description}
                          </div>
                          {achievement.progress !== undefined && achievement.target && (
                            <div className="text-xs text-primary mt-1">
                              {achievement.progress}/{achievement.target}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Locked Achievements (show first 3) */}
              {lockedAchievements.length > 0 && (
                <div className="space-y-2">
                  {lockedAchievements.slice(0, 3).map(achievement => (
                    <Card key={achievement.id} className="opacity-60">
                      <CardContent className="flex items-center gap-3 p-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                          <LockClosedIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-muted-foreground">???</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {achievement.description}
                          </div>
                          {achievement.progress !== undefined && achievement.target && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {achievement.progress}/{achievement.target}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {lockedAchievements.length > 3 && (
                    <p className="text-center text-xs text-muted-foreground">
                      +{lockedAchievements.length - 3} more to unlock
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button onClick={onShare} variant="outline" className="flex-1 gap-2">
              <Share1Icon className="h-4 w-4" />
              Share
            </Button>
            <Button
              onClick={onReset}
              variant="outline"
              className="flex-1 gap-2 text-destructive hover:text-destructive"
            >
              <ResetIcon className="h-4 w-4" />
              Reset Stats
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="pt-6 text-center">
        <div className="text-3xl font-bold text-primary">{value}</div>
        <div className="mt-1 text-sm text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  )
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  )
}
