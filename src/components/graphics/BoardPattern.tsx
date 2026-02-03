// Decorative Board Pattern SVG Component with enhanced wood grain texture

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
        {/* Enhanced wood grain pattern with more realistic lines */}
        <pattern id="wood-grain-fine" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
          <rect width="200" height="200" fill="#78350f" opacity="0.03" />
          {/* Fine grain lines */}
          <path
            d="M0,10 Q50,8 100,10 T200,10"
            stroke="#92400e"
            strokeWidth="0.5"
            fill="none"
            opacity="0.15"
          />
          <path
            d="M0,30 Q50,32 100,30 T200,30"
            stroke="#92400e"
            strokeWidth="0.3"
            fill="none"
            opacity="0.1"
          />
          <path
            d="M0,50 Q50,48 100,50 T200,50"
            stroke="#92400e"
            strokeWidth="0.5"
            fill="none"
            opacity="0.12"
          />
          <path
            d="M0,70 Q50,72 100,70 T200,70"
            stroke="#92400e"
            strokeWidth="0.4"
            fill="none"
            opacity="0.1"
          />
          <path
            d="M0,90 Q50,88 100,90 T200,90"
            stroke="#92400e"
            strokeWidth="0.5"
            fill="none"
            opacity="0.15"
          />
          <path
            d="M0,110 Q50,112 100,110 T200,110"
            stroke="#78350f"
            strokeWidth="0.3"
            fill="none"
            opacity="0.08"
          />
          <path
            d="M0,130 Q50,128 100,130 T200,130"
            stroke="#92400e"
            strokeWidth="0.5"
            fill="none"
            opacity="0.12"
          />
          <path
            d="M0,150 Q50,152 100,150 T200,150"
            stroke="#92400e"
            strokeWidth="0.4"
            fill="none"
            opacity="0.1"
          />
          <path
            d="M0,170 Q50,168 100,170 T200,170"
            stroke="#92400e"
            strokeWidth="0.5"
            fill="none"
            opacity="0.15"
          />
          <path
            d="M0,190 Q50,192 100,190 T200,190"
            stroke="#78350f"
            strokeWidth="0.3"
            fill="none"
            opacity="0.08"
          />
          {/* Wood knots */}
          <ellipse cx="80" cy="80" rx="8" ry="5" fill="#78350f" opacity="0.05">
            <animate attributeName="opacity" values="0.05;0.08;0.05" dur="4s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="160" cy="140" rx="6" ry="4" fill="#78350f" opacity="0.04" />
        </pattern>

        {/* Subtle circle pattern for decorative effect */}
        <pattern
          id="circle-pattern"
          x="0"
          y="0"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="30" cy="30" r="2" fill="#fbbf24" opacity="0.04" />
          <circle cx="30" cy="30" r="10" stroke="#fbbf24" strokeWidth="0.5" fill="none" opacity="0.02" />
        </pattern>

        {/* Decorative corner flourish pattern */}
        <pattern
          id="corner-flourish"
          x="0"
          y="0"
          width="50"
          height="50"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0,0 L10,0 Q5,5 0,10 Z"
            fill="#d97706"
            opacity="0.04"
          />
          <path
            d="M50,0 L40,0 Q45,5 50,10 Z"
            fill="#d97706"
            opacity="0.04"
          />
          <path
            d="M0,50 L10,50 Q5,45 0,40 Z"
            fill="#d97706"
            opacity="0.04"
          />
          <path
            d="M50,50 L40,50 Q45,45 50,40 Z"
            fill="#d97706"
            opacity="0.04"
          />
        </pattern>

        {/* Ambient light gradient */}
        <radialGradient id="ambient-light" cx="50%" cy="30%" r="60%" fx="50%" fy="30%">
          <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#78350f" stopOpacity="0" />
        </radialGradient>

        {/* Edge vignette */}
        <radialGradient id="edge-vignette" cx="50%" cy="50%" r="70%">
          <stop offset="60%" stopColor="transparent" stopOpacity="0" />
          <stop offset="100%" stopColor="#78350f" stopOpacity="0.1" />
        </radialGradient>
      </defs>

      {/* Apply patterns in layers */}
      <rect width="100%" height="100%" fill="url(#wood-grain-fine)" />
      <rect width="100%" height="100%" fill="url(#circle-pattern)" />
      <rect width="100%" height="100%" fill="url(#corner-flourish)" />
      <rect width="100%" height="100%" fill="url(#ambient-light)" />
      <rect width="100%" height="100%" fill="url(#edge-vignette)" />
    </svg>
  )
}

// Decorative corner embellishments for board with enhanced styling
export function BoardCorner({
  position = 'top-left',
  className = '',
}: {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  className?: string
}) {
  const rotations = {
    'top-left': 0,
    'top-right': 90,
    'bottom-right': 180,
    'bottom-left': 270,
  }

  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transform: `rotate(${rotations[position]}deg)` }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`corner-grad-${position}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.7" />
          <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0.3" />
        </linearGradient>
        <filter id={`corner-glow-${position}`}>
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Enhanced decorative corner design */}
      <g filter={`url(#corner-glow-${position})`}>
        {/* Main corner shape */}
        <path
          d="M0,0 L36,0 Q42,0 42,6 L42,42 L36,36 L36,6 Q36,6 30,6 L6,6 L0,0"
          fill={`url(#corner-grad-${position})`}
        />
        {/* Decorative circles */}
        <circle cx="10" cy="10" r="4" fill="#fbbf24" opacity="0.6">
          <animate attributeName="opacity" values="0.6;0.8;0.6" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="22" cy="10" r="2.5" fill="#f59e0b" opacity="0.5" />
        <circle cx="10" cy="22" r="2.5" fill="#f59e0b" opacity="0.5" />
        {/* Accent line */}
        <path
          d="M4,4 Q18,4 30,16"
          stroke="#fbbf24"
          strokeWidth="1"
          fill="none"
          opacity="0.4"
        />
      </g>
    </svg>
  )
}
