// Confetti celebration component

import { useEffect, useState } from 'react'

interface ConfettiProps {
  active: boolean
  duration?: number
}

interface ConfettiParticle {
  id: number
  x: number
  y: number
  rotation: number
  color: string
  size: number
  velocityX: number
  velocityY: number
  rotationSpeed: number
}

const generateConfetti = (): ConfettiParticle[] => {
  const colors = [
    '#10b981', // green
    '#3b82f6', // blue
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // purple
    '#ec4899', // pink
  ]

  return Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -10,
    rotation: Math.random() * 360,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 10 + 5,
    velocityX: (Math.random() - 0.5) * 3,
    velocityY: Math.random() * 2 + 2,
    rotationSpeed: (Math.random() - 0.5) * 10,
  }))
}

export function Confetti({ active, duration = 3000 }: ConfettiProps) {
  const [particles, setParticles] = useState<ConfettiParticle[]>([])

  useEffect(() => {
    if (!active) return

    // Use requestAnimationFrame to avoid setState during render
    requestAnimationFrame(() => {
      setParticles(generateConfetti())
    })

    // Clear particles after duration
    const timeout = setTimeout(() => {
      setParticles([])
    }, duration)

    return () => {
      clearTimeout(timeout)
      setParticles([])
    }
  }, [active, duration])

  if (!active || particles.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute animate-confetti-fall"
          style={
            {
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              transform: `rotate(${particle.rotation}deg)`,
              '--velocity-x': particle.velocityX,
              '--velocity-y': particle.velocityY,
              '--rotation-speed': particle.rotationSpeed,
              animationDuration: `${duration}ms`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
