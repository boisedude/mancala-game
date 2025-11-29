// Individual stone component with animations

interface StoneProps {
  index: number
  isReducedMotion?: boolean
}

export function Stone({ index, isReducedMotion = false }: StoneProps) {
  // Stagger animation delays for nice cascading effect (disabled if reduced motion)
  const delay = isReducedMotion ? 0 : index * 50

  // Create varied stone colors - earthy, natural tones
  const colors = [
    'bg-gradient-to-br from-stone-400 to-stone-600',
    'bg-gradient-to-br from-amber-600 to-amber-800',
    'bg-gradient-to-br from-slate-500 to-slate-700',
    'bg-gradient-to-br from-neutral-500 to-neutral-700',
    'bg-gradient-to-br from-zinc-400 to-zinc-600',
  ]

  const colorClass = colors[index % colors.length]

  return (
    <div
      className={`h-3 w-3 rounded-full shadow-md md:h-4 md:w-4 ${colorClass} ring-1 ring-white/30 ${!isReducedMotion ? 'animate-stone-drop' : ''}`}
      style={
        !isReducedMotion
          ? {
              animationDelay: `${delay}ms`,
            }
          : undefined
      }
    />
  )
}
