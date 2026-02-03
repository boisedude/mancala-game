// Victory and Defeat Graphics with enhanced animations

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
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="30%" stopColor="#fbbf24" />
          <stop offset="70%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="trophy-shine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="victory-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#fef3c7" stopOpacity="0" />
        </radialGradient>
        <filter id="victory-shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#d97706" floodOpacity="0.4" />
        </filter>
        <filter id="glow-filter">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Pulsing glow background */}
      {animated && (
        <>
          <circle cx="100" cy="100" r="90" fill="url(#victory-glow)">
            <animate
              attributeName="r"
              values="80;95;80"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.6;1;0.6"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          {/* Secondary glow ring */}
          <circle cx="100" cy="100" r="70" stroke="#fbbf24" strokeWidth="2" fill="none" opacity="0.3">
            <animate
              attributeName="r"
              values="60;80;60"
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.3;0.6;0.3"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
        </>
      )}

      {/* Trophy */}
      <g transform="translate(100, 110)" filter="url(#victory-shadow)">
        {/* Base */}
        <rect x="-28" y="42" width="56" height="10" rx="3" fill="url(#trophy-gradient)" />
        <rect x="-22" y="36" width="44" height="6" fill="url(#trophy-gradient)" />

        {/* Stem */}
        <rect x="-8" y="15" width="16" height="22" fill="url(#trophy-gradient)" />
        <ellipse cx="0" cy="15" rx="10" ry="3" fill="url(#trophy-gradient)" />

        {/* Cup */}
        <path
          d="M-32,-18 L-28,-18 L-28,8 Q-28,20 0,20 Q28,20 28,8 L28,-18 L32,-18 L32,-8 Q32,0 38,0 Q44,0 44,-12 L44,-24 L32,-24 L32,-22 L-32,-22 L-32,-24 L-44,-24 L-44,-12 Q-44,0 -38,0 Q-32,0 -32,-8 Z"
          fill="url(#trophy-gradient)"
        />

        {/* Cup inner highlight */}
        <path
          d="M-24,-16 L-24,4 Q-24,14 0,14 Q24,14 24,4 L24,-16 Z"
          fill="url(#trophy-shine)"
          opacity="0.5"
        />

        {/* Cup shine */}
        <ellipse cx="-10" cy="-8" rx="10" ry="14" fill="#fef3c7" opacity="0.5" />

        {/* Handles */}
        <path
          d="M-32,-20 Q-42,-16 -42,-10 Q-42,-4 -34,-2"
          stroke="#f59e0b"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M32,-20 Q42,-16 42,-10 Q42,-4 34,-2"
          stroke="#f59e0b"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />

        {/* Star on trophy */}
        <path
          d="M0,-28 L3,-18 L13,-18 L5,-12 L8,-2 L0,-8 L-8,-2 L-5,-12 L-13,-18 L-3,-18 Z"
          fill="#fef3c7"
          filter="url(#glow-filter)"
        />
      </g>

      {/* Animated decorative stars */}
      {animated && (
        <>
          {/* Left star */}
          <g opacity="0.9">
            <path d="M35,45 L38,52 L46,52 L40,57 L42,65 L35,60 L28,65 L30,57 L24,52 L32,52 Z" fill="#fbbf24">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 35 55"
                to="360 35 55"
                dur="4s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.9;0.5;0.9"
                dur="2s"
                repeatCount="indefinite"
              />
            </path>
          </g>
          {/* Right star */}
          <g opacity="0.9">
            <path d="M165,45 L168,52 L176,52 L170,57 L172,65 L165,60 L158,65 L160,57 L154,52 L162,52 Z" fill="#fbbf24">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 165 55"
                to="-360 165 55"
                dur="5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.9;0.5;0.9"
                dur="2.5s"
                repeatCount="indefinite"
              />
            </path>
          </g>
          {/* Top star */}
          <g opacity="0.7">
            <path d="M100,25 L103,32 L111,32 L105,37 L107,45 L100,40 L93,45 L95,37 L89,32 L97,32 Z" fill="#f59e0b">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 100 35"
                to="360 100 35"
                dur="3s"
                repeatCount="indefinite"
              />
            </path>
          </g>
          {/* Small sparkles */}
          <circle cx="55" cy="80" r="2" fill="#fcd34d">
            <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="r" values="1;3;1" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="145" cy="75" r="2" fill="#fcd34d">
            <animate attributeName="opacity" values="0;1;0" dur="1.8s" repeatCount="indefinite" begin="0.3s" />
            <animate attributeName="r" values="1;3;1" dur="1.8s" repeatCount="indefinite" begin="0.3s" />
          </circle>
          <circle cx="70" cy="140" r="2" fill="#fcd34d">
            <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" begin="0.6s" />
            <animate attributeName="r" values="1;2;1" dur="2s" repeatCount="indefinite" begin="0.6s" />
          </circle>
          <circle cx="130" cy="145" r="2" fill="#fcd34d">
            <animate attributeName="opacity" values="0;1;0" dur="1.7s" repeatCount="indefinite" begin="0.9s" />
            <animate attributeName="r" values="1;2;1" dur="1.7s" repeatCount="indefinite" begin="0.9s" />
          </circle>
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
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="50%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <filter id="defeat-shadow">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.2" />
        </filter>
        <radialGradient id="sad-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#94a3b8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Subtle background glow */}
      <circle cx="100" cy="80" r="60" fill="url(#sad-glow)" />

      {/* Sad cloud */}
      <g transform="translate(100, 80)" filter="url(#defeat-shadow)">
        {/* Cloud body */}
        <circle cx="-35" cy="0" r="28" fill="url(#cloud-gradient)" />
        <circle cx="0" cy="-12" r="38" fill="url(#cloud-gradient)" />
        <circle cx="35" cy="0" r="28" fill="url(#cloud-gradient)" />
        <rect x="-35" y="0" width="70" height="32" fill="url(#cloud-gradient)" />

        {/* Sad eyes */}
        <g>
          <ellipse cx="-18" cy="-5" rx="5" ry="6" fill="#64748b" />
          <ellipse cx="18" cy="-5" rx="5" ry="6" fill="#64748b" />
          {/* Eye shine */}
          <circle cx="-16" cy="-7" r="2" fill="#94a3b8" opacity="0.5" />
          <circle cx="20" cy="-7" r="2" fill="#94a3b8" opacity="0.5" />
        </g>

        {/* Frown */}
        <path
          d="M-18,18 Q0,10 18,18"
          stroke="#475569"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Tear drops */}
        <g>
          <path
            d="M-18,8 Q-18,16 -22,20 Q-18,16 -14,20 Q-18,16 -18,8"
            fill="#7dd3fc"
            opacity="0.8"
          >
            <animate
              attributeName="opacity"
              values="0.8;0.3;0.8"
              dur="2s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0;0,5;0,0"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d="M18,8 Q18,16 14,20 Q18,16 22,20 Q18,16 18,8"
            fill="#7dd3fc"
            opacity="0.6"
          >
            <animate
              attributeName="opacity"
              values="0.6;0.2;0.6"
              dur="2.5s"
              repeatCount="indefinite"
              begin="0.5s"
            />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0;0,5;0,0"
              dur="2.5s"
              repeatCount="indefinite"
              begin="0.5s"
            />
          </path>
        </g>
      </g>

      {/* Animated rain drops */}
      {[25, 50, 75, 100, 125, 150, 175].map((x, i) => (
        <g key={`rain-${i}`}>
          <path
            d={`M${x},125 Q${x},132 ${x - 2},138`}
            stroke="#7dd3fc"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          >
            <animate
              attributeName="d"
              values={`M${x},125 Q${x},132 ${x - 2},138;M${x},155 Q${x},162 ${x - 2},168;M${x},125 Q${x},132 ${x - 2},138`}
              dur={`${1.2 + i * 0.15}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.6;0.1;0.6"
              dur={`${1.2 + i * 0.15}s`}
              repeatCount="indefinite"
            />
          </path>
        </g>
      ))}
    </svg>
  )
}

// Enhanced celebration burst graphic
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
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
          <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
        <filter id="burst-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Radiating lines with enhanced animation */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
        <line
          key={`burst-${i}`}
          x1="150"
          y1="150"
          x2={150 + Math.cos((angle * Math.PI) / 180) * 100}
          y2={150 + Math.sin((angle * Math.PI) / 180) * 100}
          stroke={i % 2 === 0 ? '#fbbf24' : '#f59e0b'}
          strokeWidth={i % 2 === 0 ? 4 : 2}
          strokeLinecap="round"
          opacity="0"
          filter="url(#burst-glow)"
        >
          <animate
            attributeName="opacity"
            values="0;1;0"
            dur="1.5s"
            begin={`${i * 0.04}s`}
            repeatCount="1"
          />
          <animate
            attributeName="x2"
            values={`150;${150 + Math.cos((angle * Math.PI) / 180) * 140}`}
            dur="1.5s"
            begin={`${i * 0.04}s`}
            repeatCount="1"
          />
          <animate
            attributeName="y2"
            values={`150;${150 + Math.sin((angle * Math.PI) / 180) * 140}`}
            dur="1.5s"
            begin={`${i * 0.04}s`}
            repeatCount="1"
          />
        </line>
      ))}

      {/* Center burst with rings */}
      <circle cx="150" cy="150" r="20" fill="url(#burst-gradient)">
        <animate attributeName="r" values="15;90;0" dur="1.5s" repeatCount="1" />
        <animate attributeName="opacity" values="1;0.3;0" dur="1.5s" repeatCount="1" />
      </circle>
      <circle cx="150" cy="150" r="10" stroke="#fbbf24" strokeWidth="3" fill="none">
        <animate attributeName="r" values="10;120;0" dur="1.8s" repeatCount="1" />
        <animate attributeName="opacity" values="1;0.2;0" dur="1.8s" repeatCount="1" />
        <animate attributeName="stroke-width" values="3;1;0" dur="1.8s" repeatCount="1" />
      </circle>

      {/* Particle effects */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <circle
          key={`particle-${i}`}
          cx="150"
          cy="150"
          r="4"
          fill={i % 2 === 0 ? '#fcd34d' : '#f59e0b'}
        >
          <animate
            attributeName="cx"
            values={`150;${150 + Math.cos((angle * Math.PI) / 180) * 100}`}
            dur="1s"
            begin={`${i * 0.05}s`}
            repeatCount="1"
          />
          <animate
            attributeName="cy"
            values={`150;${150 + Math.sin((angle * Math.PI) / 180) * 100}`}
            dur="1s"
            begin={`${i * 0.05}s`}
            repeatCount="1"
          />
          <animate
            attributeName="opacity"
            values="1;0"
            dur="1s"
            begin={`${i * 0.05}s`}
            repeatCount="1"
          />
          <animate
            attributeName="r"
            values="4;2"
            dur="1s"
            begin={`${i * 0.05}s`}
            repeatCount="1"
          />
        </circle>
      ))}
    </svg>
  )
}
