// Graphics Showcase Page - Display all custom graphics

import { Link } from 'react-router-dom'
import {
  MancalaLogo,
  AchievementBadge,
  BoardPattern,
  BoardCorner,
  VictoryGraphic,
  DefeatGraphic,
  CelebrationBurst,
  StoneGraphic,
  AnimatedStone,
} from '@/components/graphics'

export default function GraphicsShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-amber-100 py-12 dark:from-stone-900 dark:via-stone-800 dark:to-amber-950">
      <div className="mx-auto max-w-6xl space-y-12 px-6">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-5xl font-bold text-amber-900 dark:text-amber-100">
            Mancala Graphics Showcase
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-300">
            Custom SVG graphics and components
          </p>
        </div>

        {/* Logo Section */}
        <section className="space-y-6 rounded-lg bg-white/80 p-8 shadow-lg backdrop-blur dark:bg-stone-900/80">
          <h2 className="text-3xl font-semibold text-amber-800 dark:text-amber-200">
            Mancala Logo
          </h2>
          <div className="flex flex-wrap items-center justify-around gap-8">
            <div className="text-center">
              <MancalaLogo size={80} />
              <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">Small (80px)</p>
            </div>
            <div className="text-center">
              <MancalaLogo size={120} />
              <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">Medium (120px)</p>
            </div>
            <div className="text-center">
              <MancalaLogo size={200} />
              <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">Large (200px)</p>
            </div>
          </div>
        </section>

        {/* Achievement Badges */}
        <section className="space-y-6 rounded-lg bg-white/80 p-8 shadow-lg backdrop-blur dark:bg-stone-900/80">
          <h2 className="text-3xl font-semibold text-amber-800 dark:text-amber-200">
            Achievement Badges
          </h2>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Unlocked Badges</h3>
            <div className="flex flex-wrap items-center justify-around gap-8">
              <div className="text-center">
                <AchievementBadge type="gold" icon="🏆" size={100} unlocked={true} />
                <p className="mt-2 text-sm font-medium text-stone-600 dark:text-stone-400">Gold</p>
              </div>
              <div className="text-center">
                <AchievementBadge type="silver" icon="⭐" size={100} unlocked={true} />
                <p className="mt-2 text-sm font-medium text-stone-600 dark:text-stone-400">
                  Silver
                </p>
              </div>
              <div className="text-center">
                <AchievementBadge type="bronze" icon="💎" size={100} unlocked={true} />
                <p className="mt-2 text-sm font-medium text-stone-600 dark:text-stone-400">
                  Bronze
                </p>
              </div>
              <div className="text-center">
                <AchievementBadge type="platinum" icon="👑" size={100} unlocked={true} />
                <p className="mt-2 text-sm font-medium text-stone-600 dark:text-stone-400">
                  Platinum
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Locked Badges</h3>
            <div className="flex flex-wrap items-center justify-around gap-8">
              <div className="text-center">
                <AchievementBadge type="gold" size={100} unlocked={false} />
                <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">Locked</p>
              </div>
              <div className="text-center">
                <AchievementBadge type="silver" size={100} unlocked={false} />
                <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">Locked</p>
              </div>
              <div className="text-center">
                <AchievementBadge type="platinum" size={100} unlocked={false} />
                <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">Locked</p>
              </div>
            </div>
          </div>
        </section>

        {/* Victory/Defeat Graphics */}
        <section className="space-y-6 rounded-lg bg-white/80 p-8 shadow-lg backdrop-blur dark:bg-stone-900/80">
          <h2 className="text-3xl font-semibold text-amber-800 dark:text-amber-200">
            Game Result Graphics
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="text-center">
              <div className="flex justify-center rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-8">
                <VictoryGraphic size={200} animated={true} />
              </div>
              <p className="mt-4 text-lg font-semibold text-green-600 dark:text-green-400">
                Victory Trophy (Animated)
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center rounded-lg bg-gradient-to-br from-slate-500/10 to-blue-500/10 p-8">
                <DefeatGraphic size={200} />
              </div>
              <p className="mt-4 text-lg font-semibold text-slate-600 dark:text-slate-400">
                Defeat Cloud (Animated)
              </p>
            </div>
          </div>
          <div className="text-center">
            <div className="flex justify-center rounded-lg bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-8">
              <CelebrationBurst size={300} />
            </div>
            <p className="mt-4 text-lg font-semibold text-amber-600 dark:text-amber-400">
              Celebration Burst (Animated)
            </p>
          </div>
        </section>

        {/* Stone Variants */}
        <section className="space-y-6 rounded-lg bg-white/80 p-8 shadow-lg backdrop-blur dark:bg-stone-900/80">
          <h2 className="text-3xl font-semibold text-amber-800 dark:text-amber-200">
            Stone Variants
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-4 rounded-lg bg-stone-100 p-6 dark:bg-stone-800">
              <h3 className="text-lg font-semibold">Smooth Stones</h3>
              <div className="flex flex-wrap gap-3">
                {[0, 1, 2, 3, 4].map(i => (
                  <StoneGraphic key={i} variant="smooth" size={32} colorIndex={i} />
                ))}
              </div>
            </div>
            <div className="space-y-4 rounded-lg bg-stone-100 p-6 dark:bg-stone-800">
              <h3 className="text-lg font-semibold">Textured Stones</h3>
              <div className="flex flex-wrap gap-3">
                {[0, 1, 2, 3, 4].map(i => (
                  <StoneGraphic key={i} variant="textured" size={32} colorIndex={i} />
                ))}
              </div>
            </div>
            <div className="space-y-4 rounded-lg bg-stone-100 p-6 dark:bg-stone-800">
              <h3 className="text-lg font-semibold">Gem Stones</h3>
              <div className="flex flex-wrap gap-3">
                {[0, 1, 2, 3, 4].map(i => (
                  <StoneGraphic key={i} variant="gem" size={32} colorIndex={i} />
                ))}
              </div>
            </div>
            <div className="space-y-4 rounded-lg bg-stone-100 p-6 dark:bg-stone-800">
              <h3 className="text-lg font-semibold">Rustic Stones</h3>
              <div className="flex flex-wrap gap-3">
                {[0, 1, 2, 3, 4].map(i => (
                  <StoneGraphic key={i} variant="rustic" size={32} colorIndex={i} />
                ))}
              </div>
            </div>
            <div className="space-y-4 rounded-lg bg-stone-100 p-6 dark:bg-stone-800">
              <h3 className="text-lg font-semibold">Polished Stones</h3>
              <div className="flex flex-wrap gap-3">
                {[0, 1, 2, 3, 4].map(i => (
                  <StoneGraphic key={i} variant="polished" size={32} colorIndex={i} />
                ))}
              </div>
            </div>
            <div className="space-y-4 rounded-lg bg-stone-100 p-6 dark:bg-stone-800">
              <h3 className="text-lg font-semibold">Animated Stones</h3>
              <div className="flex flex-wrap gap-3">
                {[0, 1, 2].map(i => (
                  <AnimatedStone key={i} variant="smooth" size={32} colorIndex={i} animate={true} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Board Decorations */}
        <section className="space-y-6 rounded-lg bg-white/80 p-8 shadow-lg backdrop-blur dark:bg-stone-900/80">
          <h2 className="text-3xl font-semibold text-amber-800 dark:text-amber-200">
            Board Decorations
          </h2>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Decorative Corners</h3>
            <div className="flex flex-wrap items-center justify-around gap-8">
              <div className="text-center">
                <BoardCorner position="top-left" />
                <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">Top Left</p>
              </div>
              <div className="text-center">
                <BoardCorner position="top-right" />
                <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">Top Right</p>
              </div>
              <div className="text-center">
                <BoardCorner position="bottom-left" />
                <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">Bottom Left</p>
              </div>
              <div className="text-center">
                <BoardCorner position="bottom-right" />
                <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">Bottom Right</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Board Pattern (Background Texture)</h3>
            <div className="relative h-48 overflow-hidden rounded-lg border-4 border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100 dark:border-amber-700 dark:from-amber-950 dark:to-stone-950">
              <BoardPattern className="opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="rounded-lg bg-black/50 px-4 py-2 text-white">
                  Wood grain and circle pattern overlay
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Details */}
        <section className="space-y-6 rounded-lg bg-white/80 p-8 shadow-lg backdrop-blur dark:bg-stone-900/80">
          <h2 className="text-3xl font-semibold text-amber-800 dark:text-amber-200">
            Technical Details
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Features</h3>
              <ul className="list-inside list-disc space-y-1 text-sm text-stone-600 dark:text-stone-400">
                <li>100% SVG-based graphics</li>
                <li>Fully scalable without quality loss</li>
                <li>Optimized for performance</li>
                <li>Dark mode compatible</li>
                <li>CSS animations for interactive elements</li>
                <li>Accessible with ARIA labels</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Components</h3>
              <ul className="list-inside list-disc space-y-1 text-sm text-stone-600 dark:text-stone-400">
                <li>MancalaLogo - Brand identity</li>
                <li>AchievementBadge - 4 tiers with lock states</li>
                <li>VictoryGraphic - Animated trophy</li>
                <li>DefeatGraphic - Sad cloud with rain</li>
                <li>CelebrationBurst - Radial burst effect</li>
                <li>StoneGraphic - 5 variants with 5 colors each</li>
                <li>BoardPattern - Textured background</li>
                <li>BoardCorner - Decorative embellishments</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <div className="flex justify-center gap-6 text-center">
          <Link
            to="/"
            className="inline-block rounded-md bg-amber-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800"
          >
            Back to Game
          </Link>
          <Link
            to="/history"
            className="inline-block rounded-md border-2 border-amber-600 px-6 py-3 font-semibold text-amber-600 transition-colors hover:bg-amber-50 dark:border-amber-400 dark:text-amber-400 dark:hover:bg-stone-800"
          >
            Game History
          </Link>
        </div>
      </div>
    </div>
  )
}
