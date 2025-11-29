// Decorative Board Pattern SVG Component

interface BoardPatternProps {
  className?: string
}

export function BoardPattern({ className = '' }: BoardPatternProps) {
  return (
    <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute inset-0 ${className}`}
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <defs>
        {/* Wood grain pattern */}
        <pattern id="wood-grain" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="#78350f" opacity="0.1" />
          <path
            d="M0,20 Q25,18 50,20 T100,20"
            stroke="#92400e"
            strokeWidth="0.5"
            fill="none"
            opacity="0.2"
          />
          <path
            d="M0,50 Q25,48 50,50 T100,50"
            stroke="#92400e"
            strokeWidth="0.5"
            fill="none"
            opacity="0.15"
          />
          <path
            d="M0,80 Q25,78 50,80 T100,80"
            stroke="#92400e"
            strokeWidth="0.5"
            fill="none"
            opacity="0.2"
          />
        </pattern>

        {/* Subtle circle pattern */}
        <pattern
          id="circle-pattern"
          x="0"
          y="0"
          width="50"
          height="50"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="25" cy="25" r="2" fill="#fbbf24" opacity="0.05" />
          <circle cx="25" cy="25" r="8" stroke="#fbbf24" strokeWidth="0.5" fill="none" opacity="0.03" />
        </pattern>

        {/* Decorative corners */}
        <pattern
          id="corner-pattern"
          x="0"
          y="0"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0,0 L8,0 L0,8 Z"
            fill="#d97706"
            opacity="0.05"
          />
          <path
            d="M40,0 L32,0 L40,8 Z"
            fill="#d97706"
            opacity="0.05"
          />
          <path
            d="M0,40 L8,40 L0,32 Z"
            fill="#d97706"
            opacity="0.05"
          />
          <path
            d="M40,40 L32,40 L40,32 Z"
            fill="#d97706"
            opacity="0.05"
          />
        </pattern>
      </defs>

      {/* Apply patterns */}
      <rect width="100%" height="100%" fill="url(#wood-grain)" />
      <rect width="100%" height="100%" fill="url(#circle-pattern)" />
      <rect width="100%" height="100%" fill="url(#corner-pattern)" />
    </svg>
  )
}

// Decorative corner embellishments for board
export function BoardCorner({ position = 'top-left', className = '' }: { position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right', className?: string }) {
  const rotations = {
    'top-left': 0,
    'top-right': 90,
    'bottom-right': 180,
    'bottom-left': 270,
  }

  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transform: `rotate(${rotations[position]}deg)` }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`corner-grad-${position}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Decorative corner design */}
      <path
        d="M0,0 L30,0 Q35,0 35,5 L35,35 L30,30 L30,5 Q30,5 25,5 L5,5 L0,0"
        fill={`url(#corner-grad-${position})`}
      />
      <circle cx="8" cy="8" r="3" fill="#fbbf24" opacity="0.5" />
      <circle cx="18" cy="8" r="2" fill="#d97706" opacity="0.4" />
      <circle cx="8" cy="18" r="2" fill="#d97706" opacity="0.4" />
    </svg>
  )
}
