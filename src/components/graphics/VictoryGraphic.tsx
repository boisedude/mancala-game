// Victory and Defeat Graphics

interface VictoryGraphicProps {
  size?: number
  className?: string
  animated?: boolean
}

export function VictoryGraphic({ size = 200, className = '', animated = true }: VictoryGraphicProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Victory celebration"
    >
      <defs>
        <linearGradient id="trophy-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <radialGradient id="victory-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#fef3c7" stopOpacity="0" />
        </radialGradient>
        <filter id="victory-shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Glow background */}
      {animated && (
        <circle cx="100" cy="100" r="90" fill="url(#victory-glow)">
          <animate
            attributeName="r"
            values="85;95;85"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      )}

      {/* Trophy */}
      <g transform="translate(100, 110)" filter="url(#victory-shadow)">
        {/* Base */}
        <rect x="-25" y="40" width="50" height="8" rx="2" fill="url(#trophy-gradient)" />
        <rect x="-20" y="35" width="40" height="5" fill="url(#trophy-gradient)" />

        {/* Stem */}
        <rect x="-6" y="15" width="12" height="20" fill="url(#trophy-gradient)" />

        {/* Cup */}
        <path
          d="M-30,-15 L-25,-15 L-25,10 Q-25,18 0,18 Q25,18 25,10 L25,-15 L30,-15 L30,-5 Q30,0 35,0 Q40,0 40,-10 L40,-20 L30,-20 L30,-18 L-30,-18 L-30,-20 L-40,-20 L-40,-10 Q-40,0 -35,0 Q-30,0 -30,-5 Z"
          fill="url(#trophy-gradient)"
        />

        {/* Cup highlight */}
        <ellipse cx="-8" cy="-8" rx="8" ry="12" fill="#fef3c7" opacity="0.4" />

        {/* Handles */}
        <path
          d="M-30,-18 Q-38,-15 -38,-10 Q-38,-5 -32,-3"
          stroke="#f59e0b"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M30,-18 Q38,-15 38,-10 Q38,-5 32,-3"
          stroke="#f59e0b"
          strokeWidth="3"
          fill="none"
        />

        {/* Star on trophy */}
        <path
          d="M0,-25 L2,-18 L9,-18 L3,-13 L5,-6 L0,-11 L-5,-6 L-3,-13 L-9,-18 L-2,-18 Z"
          fill="#fef3c7"
        />
      </g>

      {/* Decorative stars */}
      {animated && (
        <>
          <g opacity="0.8">
            <path d="M40,50 L42,55 L47,55 L43,58 L45,63 L40,60 L35,63 L37,58 L33,55 L38,55 Z" fill="#fbbf24">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 40 50"
                to="360 40 50"
                dur="4s"
                repeatCount="indefinite"
              />
            </path>
          </g>
          <g opacity="0.8">
            <path d="M160,50 L162,55 L167,55 L163,58 L165,63 L160,60 L155,63 L157,58 L153,55 L158,55 Z" fill="#fbbf24">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 160 50"
                to="-360 160 50"
                dur="5s"
                repeatCount="indefinite"
              />
            </path>
          </g>
          <g opacity="0.6">
            <path d="M100,30 L102,35 L107,35 L103,38 L105,43 L100,40 L95,43 L97,38 L93,35 L98,35 Z" fill="#f59e0b">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 100 30"
                to="360 100 30"
                dur="3s"
                repeatCount="indefinite"
              />
            </path>
          </g>
        </>
      )}
    </svg>
  )
}

export function DefeatGraphic({ size = 200, className = '' }: VictoryGraphicProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Game over"
    >
      <defs>
        <linearGradient id="cloud-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <filter id="defeat-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Sad cloud */}
      <g transform="translate(100, 80)" filter="url(#defeat-shadow)">
        {/* Cloud body */}
        <circle cx="-30" cy="0" r="25" fill="url(#cloud-gradient)" />
        <circle cx="0" cy="-10" r="35" fill="url(#cloud-gradient)" />
        <circle cx="30" cy="0" r="25" fill="url(#cloud-gradient)" />
        <rect x="-30" y="0" width="60" height="30" fill="url(#cloud-gradient)" />

        {/* Sad face */}
        <circle cx="-15" cy="-5" r="4" fill="#64748b" />
        <circle cx="15" cy="-5" r="4" fill="#64748b" />

        {/* Frown */}
        <path
          d="M-15,15 Q0,8 15,15"
          stroke="#64748b"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Tear drops */}
        <path
          d="M-15,5 Q-15,12 -18,15 Q-15,12 -12,15 Q-15,12 -15,5"
          fill="#7dd3fc"
          opacity="0.7"
        >
          <animate
            attributeName="opacity"
            values="0.7;0.3;0.7"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
      </g>

      {/* Rain drops */}
      {[30, 60, 90, 130, 160].map((x, i) => (
        <g key={`rain-${i}`}>
          <path
            d={`M${x},120 Q${x},125 ${x - 2},130`}
            stroke="#7dd3fc"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.5"
          >
            <animate
              attributeName="d"
              values={`M${x},120 Q${x},125 ${x - 2},130;M${x},140 Q${x},145 ${x - 2},150;M${x},120 Q${x},125 ${x - 2},130`}
              dur={`${1.5 + i * 0.2}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.5;0.2;0.5"
              dur={`${1.5 + i * 0.2}s`}
              repeatCount="indefinite"
            />
          </path>
        </g>
      ))}
    </svg>
  )
}

// Celebration burst graphic
export function CelebrationBurst({ size = 300, className = '' }: VictoryGraphicProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="burst-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Radiating lines */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
        <line
          key={`burst-${i}`}
          x1="150"
          y1="150"
          x2={150 + Math.cos((angle * Math.PI) / 180) * 100}
          y2={150 + Math.sin((angle * Math.PI) / 180) * 100}
          stroke="#fbbf24"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;0.8;0"
            dur="1.5s"
            begin={`${i * 0.05}s`}
            repeatCount="1"
          />
          <animate
            attributeName="x2"
            values={`150;${150 + Math.cos((angle * Math.PI) / 180) * 120}`}
            dur="1.5s"
            begin={`${i * 0.05}s`}
            repeatCount="1"
          />
          <animate
            attributeName="y2"
            values={`150;${150 + Math.sin((angle * Math.PI) / 180) * 120}`}
            dur="1.5s"
            begin={`${i * 0.05}s`}
            repeatCount="1"
          />
        </line>
      ))}

      {/* Center burst */}
      <circle cx="150" cy="150" r="20" fill="url(#burst-gradient)">
        <animate attributeName="r" values="20;80;0" dur="1.5s" repeatCount="1" />
        <animate attributeName="opacity" values="1;0.5;0" dur="1.5s" repeatCount="1" />
      </circle>
    </svg>
  )
}
