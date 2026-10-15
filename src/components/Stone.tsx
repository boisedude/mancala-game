// A single stone: a small matte disc in one of three muted tones

interface StoneProps {
  index: number
  isReducedMotion?: boolean
}

// slate, sand, moss
const STONE_TONES = ['#6f7f8b', '#c4b28e', '#82966a']

export function Stone({ index, isReducedMotion = false }: StoneProps) {
  const delay = isReducedMotion ? undefined : `${Math.min(index, 6) * 40}ms`
  return (
    <span
      aria-hidden="true"
      className={`block h-[0.4375rem] w-[0.4375rem] rounded-full sm:h-3 sm:w-3 ${isReducedMotion ? '' : 'animate-stone-drop'}`}
      style={{
        backgroundColor: STONE_TONES[index % STONE_TONES.length],
        boxShadow: '0 1px 1px rgba(0,0,0,0.45)',
        animationDelay: delay,
      }}
    />
  )
}
