// Individual stone component with enhanced animations and realistic visuals

interface StoneProps {
  index: number
  isReducedMotion?: boolean
  isAnimating?: boolean
  animationType?: 'drop' | 'idle' | 'sow' | 'land' | 'capture'
}

// Moved outside component to avoid recreation on every render
const STONE_STYLES = [
  {
    gradient: 'from-stone-300 via-stone-400 to-stone-600',
    highlight: 'bg-stone-200/60',
    shadow: 'shadow-stone-700/40',
  },
  {
    gradient: 'from-amber-400 via-amber-500 to-amber-700',
    highlight: 'bg-amber-200/60',
    shadow: 'shadow-amber-800/40',
  },
  {
    gradient: 'from-slate-400 via-slate-500 to-slate-700',
    highlight: 'bg-slate-200/50',
    shadow: 'shadow-slate-800/40',
  },
  {
    gradient: 'from-neutral-400 via-neutral-500 to-neutral-700',
    highlight: 'bg-neutral-200/50',
    shadow: 'shadow-neutral-800/40',
  },
  {
    gradient: 'from-zinc-300 via-zinc-400 to-zinc-600',
    highlight: 'bg-zinc-100/50',
    shadow: 'shadow-zinc-700/40',
  },
  {
    gradient: 'from-orange-300 via-orange-400 to-orange-600',
    highlight: 'bg-orange-100/60',
    shadow: 'shadow-orange-700/40',
  },
  {
    gradient: 'from-yellow-600 via-yellow-700 to-yellow-900',
    highlight: 'bg-yellow-400/50',
    shadow: 'shadow-yellow-900/40',
  },
]

export function Stone({
  index,
  isReducedMotion = false,
  isAnimating = true,
  animationType = 'drop',
}: StoneProps) {
  // Stagger animation delays for nice cascading effect (disabled if reduced motion)
  const delay = isReducedMotion ? 0 : index * 60

  const style = STONE_STYLES[index % STONE_STYLES.length]

  // Determine animation class based on type
  const getAnimationClass = () => {
    if (isReducedMotion || !isAnimating) return ''
    switch (animationType) {
      case 'drop':
        return 'animate-stone-drop'
      case 'idle':
        return 'animate-stone-idle'
      case 'land':
        return 'animate-stone-land'
      case 'sow':
        return 'animate-stone-sow'
      case 'capture':
        return 'animate-stone-capture'
      default:
        return 'animate-stone-drop'
    }
  }

  // Subtle position variation for natural look
  const offsetX = ((index * 7) % 5) - 2
  const offsetY = ((index * 11) % 5) - 2
  const rotation = ((index * 13) % 30) - 15

  return (
    <div
      className={`
        relative h-3.5 w-3.5 md:h-4 md:w-4
        rounded-full
        bg-gradient-to-br ${style.gradient}
        ${getAnimationClass()}
        transform-gpu
      `}
      style={{
        animationDelay: !isReducedMotion ? `${delay}ms` : undefined,
        transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`,
        boxShadow: `
          0 2px 4px rgba(0, 0, 0, 0.35),
          0 1px 2px rgba(0, 0, 0, 0.25),
          inset 0 -2px 4px rgba(0, 0, 0, 0.2),
          inset 0 2px 4px rgba(255, 255, 255, 0.25)
        `,
      }}
    >
      {/* Highlight shine - top left */}
      <div
        className={`
          absolute left-0.5 top-0.5
          h-1.5 w-1.5 md:h-2 md:w-2
          rounded-full
          ${style.highlight}
          blur-[0.5px]
        `}
        style={{
          transform: `rotate(${-rotation}deg)`,
        }}
      />
      {/* Secondary subtle shine */}
      <div
        className="
          absolute right-1 bottom-1
          h-0.5 w-0.5 md:h-1 md:w-1
          rounded-full
          bg-white/20
          blur-[0.25px]
        "
      />
      {/* Surface texture overlay */}
      <div
        className="
          absolute inset-0
          rounded-full
          bg-gradient-to-br from-transparent via-transparent to-black/10
        "
      />
    </div>
  )
}
