// Achievement Badge SVG Component

interface AchievementBadgeProps {
  type: 'gold' | 'silver' | 'bronze' | 'platinum'
  icon?: string
  size?: number
  className?: string
  unlocked?: boolean
}

export function AchievementBadge({
  type = 'gold',
  icon,
  size = 80,
  className = '',
  unlocked = true,
}: AchievementBadgeProps) {
  const colors = {
    gold: {
      primary: '#fbbf24',
      secondary: '#d97706',
      tertiary: '#92400e',
      glow: '#fef3c7',
    },
    silver: {
      primary: '#e5e7eb',
      secondary: '#9ca3af',
      tertiary: '#4b5563',
      glow: '#f9fafb',
    },
    bronze: {
      primary: '#d97706',
      secondary: '#92400e',
      tertiary: '#451a03',
      glow: '#fef3c7',
    },
    platinum: {
      primary: '#f0f9ff',
      secondary: '#38bdf8',
      tertiary: '#0284c7',
      glow: '#dbeafe',
    },
  }

  const color = colors[type]
  const opacity = unlocked ? 1 : 0.3

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={`${type} achievement badge`}
    >
      <defs>
        <linearGradient id={`badge-gradient-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color.primary} />
          <stop offset="100%" stopColor={color.secondary} />
        </linearGradient>
        <radialGradient id={`glow-${type}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color.glow} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color.glow} stopOpacity="0" />
        </radialGradient>
        <filter id={`shadow-${type}`}>
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Glow effect (only when unlocked) */}
      {unlocked && (
        <circle cx="50" cy="50" r="48" fill={`url(#glow-${type})`} opacity="0.6">
          <animate
            attributeName="r"
            values="48;52;48"
            dur="2s"
            repeatCount="indefinite"
            begin="0s"
          />
          <animate
            attributeName="opacity"
            values="0.6;0.8;0.6"
            dur="2s"
            repeatCount="indefinite"
            begin="0s"
          />
        </circle>
      )}

      {/* Star shape badge */}
      <g opacity={opacity} filter={`url(#shadow-${type})`}>
        {/* Outer star */}
        <path
          d="M50 5 L58 35 L90 35 L65 54 L75 85 L50 65 L25 85 L35 54 L10 35 L42 35 Z"
          fill={`url(#badge-gradient-${type})`}
          stroke={color.tertiary}
          strokeWidth="2"
        />

        {/* Inner star highlight */}
        <path
          d="M50 15 L55 32 L72 32 L58 43 L63 60 L50 48 L37 60 L42 43 L28 32 L45 32 Z"
          fill={color.glow}
          opacity="0.4"
        />

        {/* Center circle */}
        <circle cx="50" cy="45" r="18" fill={color.primary} stroke={color.tertiary} strokeWidth="2" />
        <circle cx="50" cy="45" r="15" fill={color.secondary} opacity="0.5" />
      </g>

      {/* Icon text */}
      {icon && unlocked && (
        <text
          x="50"
          y="52"
          fontSize="20"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ userSelect: 'none' }}
        >
          {icon}
        </text>
      )}

      {/* Lock icon (when locked) */}
      {!unlocked && (
        <g transform="translate(50, 45)">
          <rect x="-6" y="-2" width="12" height="10" rx="1" fill="#666" />
          <path
            d="M -4 -2 L -4 -6 A 4 4 0 0 1 4 -6 L 4 -2"
            stroke="#666"
            strokeWidth="2"
            fill="none"
          />
        </g>
      )}
    </svg>
  )
}
