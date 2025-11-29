// Enhanced Stone Graphics - SVG-based stones with realistic textures

interface StoneGraphicProps {
  variant?: 'smooth' | 'textured' | 'gem' | 'rustic' | 'polished'
  size?: number
  className?: string
  colorIndex?: number
}

export function StoneGraphic({
  variant = 'smooth',
  size = 16,
  className = '',
  colorIndex = 0,
}: StoneGraphicProps) {
  const colors = [
    { base: '#78716c', highlight: '#a8a29e', shadow: '#57534e' }, // Stone
    { base: '#d97706', highlight: '#fbbf24', shadow: '#92400e' }, // Amber
    { base: '#64748b', highlight: '#94a3b8', shadow: '#475569' }, // Slate
    { base: '#737373', highlight: '#a3a3a3', shadow: '#525252' }, // Neutral
    { base: '#71717a', highlight: '#a1a1aa', shadow: '#52525b' }, // Zinc
  ]

  const color = colors[colorIndex % colors.length]

  if (variant === 'smooth') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <radialGradient id={`stone-smooth-${colorIndex}`} cx="35%" cy="35%">
            <stop offset="0%" stopColor={color.highlight} />
            <stop offset="70%" stopColor={color.base} />
            <stop offset="100%" stopColor={color.shadow} />
          </radialGradient>
          <filter id={`stone-shadow-${colorIndex}`}>
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.4" />
          </filter>
        </defs>
        <circle
          cx="10"
          cy="10"
          r="8"
          fill={`url(#stone-smooth-${colorIndex})`}
          filter={`url(#stone-shadow-${colorIndex})`}
        />
        <circle cx="7" cy="7" r="2.5" fill={color.highlight} opacity="0.4" />
      </svg>
    )
  }

  if (variant === 'textured') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <radialGradient id={`stone-textured-${colorIndex}`} cx="40%" cy="40%">
            <stop offset="0%" stopColor={color.highlight} />
            <stop offset="60%" stopColor={color.base} />
            <stop offset="100%" stopColor={color.shadow} />
          </radialGradient>
          <pattern id={`texture-${colorIndex}`} x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.5" fill={color.shadow} opacity="0.2" />
          </pattern>
          <filter id={`textured-shadow-${colorIndex}`}>
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.4" />
          </filter>
        </defs>
        <circle
          cx="10"
          cy="10"
          r="8"
          fill={`url(#stone-textured-${colorIndex})`}
          filter={`url(#textured-shadow-${colorIndex})`}
        />
        <circle cx="10" cy="10" r="8" fill={`url(#texture-${colorIndex})`} />
        <ellipse cx="7" cy="7" rx="3" ry="2" fill={color.highlight} opacity="0.3" />
      </svg>
    )
  }

  if (variant === 'gem') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <linearGradient id={`gem-gradient-${colorIndex}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color.highlight} />
            <stop offset="50%" stopColor={color.base} />
            <stop offset="100%" stopColor={color.shadow} />
          </linearGradient>
          <filter id={`gem-shadow-${colorIndex}`}>
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.5" />
          </filter>
        </defs>
        <path
          d="M10,2 L14,6 L16,10 L14,14 L10,18 L6,14 L4,10 L6,6 Z"
          fill={`url(#gem-gradient-${colorIndex})`}
          filter={`url(#gem-shadow-${colorIndex})`}
        />
        <path d="M10,2 L12,8 L10,10 L8,8 Z" fill={color.highlight} opacity="0.5" />
        <path d="M10,18 L12,12 L10,10 L8,12 Z" fill={color.shadow} opacity="0.3" />
      </svg>
    )
  }

  if (variant === 'rustic') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <radialGradient id={`stone-rustic-${colorIndex}`} cx="30%" cy="30%">
            <stop offset="0%" stopColor={color.highlight} />
            <stop offset="80%" stopColor={color.base} />
            <stop offset="100%" stopColor={color.shadow} />
          </radialGradient>
          <filter id={`rustic-shadow-${colorIndex}`}>
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.4" />
          </filter>
        </defs>
        {/* Irregular stone shape */}
        <path
          d="M10,2 Q13,3 15,6 Q17,9 16,12 Q15,15 12,17 Q9,18 6,16 Q3,14 3,11 Q2,8 4,5 Q6,2 10,2"
          fill={`url(#stone-rustic-${colorIndex})`}
          filter={`url(#rustic-shadow-${colorIndex})`}
        />
        {/* Rough texture spots */}
        <ellipse cx="7" cy="6" rx="2" ry="1.5" fill={color.shadow} opacity="0.2" />
        <ellipse cx="12" cy="11" rx="1.5" ry="2" fill={color.shadow} opacity="0.15" />
        <ellipse cx="6" cy="8" rx="2.5" ry="2" fill={color.highlight} opacity="0.3" />
      </svg>
    )
  }

  if (variant === 'polished') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <radialGradient id={`stone-polished-${colorIndex}`} cx="30%" cy="30%">
            <stop offset="0%" stopColor={color.highlight} stopOpacity="0.9" />
            <stop offset="50%" stopColor={color.base} />
            <stop offset="100%" stopColor={color.shadow} />
          </radialGradient>
          <filter id={`polished-shadow-${colorIndex}`}>
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" />
            <feGaussianBlur stdDeviation="0.3" />
          </filter>
        </defs>
        <circle
          cx="10"
          cy="10"
          r="8"
          fill={`url(#stone-polished-${colorIndex})`}
          filter={`url(#polished-shadow-${colorIndex})`}
        />
        {/* Shine highlight */}
        <ellipse cx="6" cy="6" rx="4" ry="3" fill="white" opacity="0.5" />
        <ellipse cx="5.5" cy="5.5" rx="2" ry="1.5" fill="white" opacity="0.7" />
        {/* Subtle reflection */}
        <path d="M10,18 Q8,16 8,14 Q8,12 10,10 Q12,12 12,14 Q12,16 10,18" fill={color.highlight} opacity="0.2" />
      </svg>
    )
  }

  return null
}

// Animated stone component for game actions
export function AnimatedStone({
  variant = 'smooth',
  size = 16,
  className = '',
  colorIndex = 0,
  animate = true,
}: StoneGraphicProps & { animate?: boolean }) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <StoneGraphic variant={variant} size={size} colorIndex={colorIndex} />
      {animate && (
        <div className="absolute inset-0 animate-stone-drop">
          <StoneGraphic variant={variant} size={size} colorIndex={colorIndex} />
        </div>
      )}
    </div>
  )
}
