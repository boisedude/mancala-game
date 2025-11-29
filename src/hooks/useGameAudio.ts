// Custom hook for managing Mancala game audio

import { useCallback, useEffect, useState, useRef } from 'react'

type SoundEffect = 'pickup' | 'drop' | 'capture' | 'extraTurn' | 'victory' | 'defeat'

const MUTE_STORAGE_KEY = 'mancala_audio_muted'

/**
 * Get mute preference from localStorage
 */
function getMutePreference(): boolean {
  try {
    const stored = localStorage.getItem(MUTE_STORAGE_KEY)
    return stored === 'true'
  } catch {
    return false
  }
}

/**
 * Save mute preference to localStorage
 */
function saveMutePreference(muted: boolean): void {
  try {
    localStorage.setItem(MUTE_STORAGE_KEY, String(muted))
  } catch (error) {
    console.error('Error saving mute preference:', error)
  }
}

/**
 * Generate a simple tone using Web Audio API
 */
function createTone(
  audioContext: AudioContext,
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.3
): void {
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  oscillator.frequency.value = frequency
  oscillator.type = type

  // Envelope for smooth sound
  const now = audioContext.currentTime
  gainNode.gain.setValueAtTime(0, now)
  gainNode.gain.linearRampToValueAtTime(volume, now + 0.01)
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration)

  oscillator.start(now)
  oscillator.stop(now + duration)
}

/**
 * Play sound effects based on game events
 */
export function useGameAudio() {
  const [isMuted, setIsMuted] = useState(() => getMutePreference())
  const audioContextRef = useRef<AudioContext | null>(null)

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      audioContextRef.current = new AudioContext()
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  /**
   * Toggle mute state
   */
  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newValue = !prev
      saveMutePreference(newValue)
      return newValue
    })
  }, [])

  /**
   * Play a sound effect
   */
  const playSound = useCallback(
    (effect: SoundEffect) => {
      if (isMuted || !audioContextRef.current) return

      const ctx = audioContextRef.current

      // Resume audio context if suspended (browser autoplay policy)
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      switch (effect) {
        case 'pickup':
          // Quick ascending chirp
          createTone(ctx, 440, 0.1, 'triangle', 0.2)
          setTimeout(() => createTone(ctx, 550, 0.08, 'triangle', 0.15), 40)
          break

        case 'drop':
          // Short descending tone
          createTone(ctx, 330, 0.08, 'sine', 0.15)
          break

        case 'capture':
          // Triumphant ascending sequence
          createTone(ctx, 523, 0.1, 'square', 0.25) // C5
          setTimeout(() => createTone(ctx, 659, 0.1, 'square', 0.25), 80) // E5
          setTimeout(() => createTone(ctx, 784, 0.2, 'square', 0.3), 160) // G5
          break

        case 'extraTurn':
          // Ascending chime
          createTone(ctx, 659, 0.12, 'sine', 0.25) // E5
          setTimeout(() => createTone(ctx, 784, 0.15, 'sine', 0.3), 80) // G5
          setTimeout(() => createTone(ctx, 1047, 0.2, 'sine', 0.25), 160) // C6
          break

        case 'victory':
          // Victory fanfare
          createTone(ctx, 523, 0.15, 'sawtooth', 0.3) // C5
          setTimeout(() => createTone(ctx, 659, 0.15, 'sawtooth', 0.3), 120) // E5
          setTimeout(() => createTone(ctx, 784, 0.15, 'sawtooth', 0.3), 240) // G5
          setTimeout(() => createTone(ctx, 1047, 0.4, 'sawtooth', 0.35), 360) // C6
          break

        case 'defeat':
          // Descending disappointment
          createTone(ctx, 392, 0.2, 'triangle', 0.3) // G4
          setTimeout(() => createTone(ctx, 330, 0.2, 'triangle', 0.3), 150) // E4
          setTimeout(() => createTone(ctx, 262, 0.3, 'triangle', 0.25), 300) // C4
          break
      }
    },
    [isMuted]
  )

  /**
   * Play a sequence of drop sounds
   */
  const playDropSequence = useCallback(
    (count: number) => {
      if (isMuted || !audioContextRef.current) return

      const ctx = audioContextRef.current
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      // Play drop sounds with slight delay between each
      for (let i = 0; i < Math.min(count, 8); i++) {
        setTimeout(() => {
          createTone(ctx, 330 + i * 20, 0.06, 'sine', 0.12)
        }, i * 80)
      }
    },
    [isMuted]
  )

  return {
    isMuted,
    toggleMute,
    playSound,
    playDropSequence,
  }
}
