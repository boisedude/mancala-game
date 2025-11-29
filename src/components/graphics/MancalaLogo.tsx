// Mancala Logo SVG Component

interface MancalaLogoProps {
  className?: string
  size?: number
}

export function MancalaLogo({ className = '', size = 200 }: MancalaLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Mancala Logo"
    >
      {/* Background circle */}
      <circle cx="100" cy="100" r="95" fill="url(#logo-gradient)" />

      {/* Gradient definitions */}
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
        <linearGradient id="board-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>
        <radialGradient id="stone-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>
      </defs>

      {/* Board representation - simplified mancala board */}
      <g transform="translate(100, 100)">
        {/* Board base */}
        <rect
          x="-70"
          y="-25"
          width="140"
          height="50"
          rx="10"
          fill="url(#board-gradient)"
          stroke="#451a03"
          strokeWidth="2"
        />

        {/* Pits (6 small circles) */}
        {[-50, -30, -10, 10, 30, 50].map((xPos, i) => (
          <circle
            key={`pit-${i}`}
            cx={xPos}
            cy="0"
            r="6"
            fill="#292524"
            stroke="#78350f"
            strokeWidth="1"
          />
        ))}

        {/* Stores (2 larger circles on sides) */}
        <ellipse cx="-80" cy="0" rx="8" ry="20" fill="#292524" stroke="#78350f" strokeWidth="2" />
        <ellipse cx="80" cy="0" rx="8" ry="20" fill="#292524" stroke="#78350f" strokeWidth="2" />

        {/* Decorative stones */}
        <circle cx="-50" cy="0" r="4" fill="url(#stone-gradient)" opacity="0.9" />
        <circle cx="-30" cy="0" r="4" fill="url(#stone-gradient)" opacity="0.8" />
        <circle cx="10" cy="0" r="4" fill="url(#stone-gradient)" opacity="0.9" />
        <circle cx="30" cy="0" r="4" fill="url(#stone-gradient)" opacity="0.7" />

        {/* Stones in store */}
        <circle cx="80" cy="-8" r="3" fill="url(#stone-gradient)" opacity="0.8" />
        <circle cx="80" cy="0" r="3" fill="url(#stone-gradient)" opacity="0.9" />
        <circle cx="80" cy="8" r="3" fill="url(#stone-gradient)" opacity="0.8" />
      </g>

      {/* Decorative border */}
      <circle cx="100" cy="100" r="95" fill="none" stroke="#92400e" strokeWidth="3" opacity="0.3" />
      <circle cx="100" cy="100" r="92" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.5" />
    </svg>
  )
}
