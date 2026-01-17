// Custom hook for managing Mancala game audio

import { useCallback, useEffect, useState, useRef } from 'react'

type SoundEffect = 'pickup' | 'drop' | 'capture' | 'extraTurn' | 'victory' | 'defeat'

const MUTE_STORAGE_KEY = 'mancala_audio_muted'

// Audio timing constants (in milliseconds)
const AUDIO_TIMING = {
  PICKUP_DELAY: 40,
  CAPTURE_DELAY_1: 80,
  CAPTURE_DELAY_2: 160,
  EXTRA_TURN_DELAY_1: 80,
  EXTRA_TURN_DELAY_2: 160,
  VICTORY_DELAY_1: 120,
  VICTORY_DELAY_2: 240,
  VICTORY_DELAY_3: 360,
  DEFEAT_DELAY_1: 150,
  DEFEAT_DELAY_2: 300,
  DROP_SEQUENCE_INTERVAL: 80,
  DROP_SEQUENCE_MAX_SOUNDS: 8,
} as const

// Audio frequency constants (in Hz)
const AUDIO_FREQUENCIES = {
  PICKUP_1: 440,
  PICKUP_2: 550,
  DROP: 330,
  CAPTURE_C5: 523,
  CAPTURE_E5: 659,
  CAPTURE_G5: 784,
  EXTRA_TURN_E5: 659,
  EXTRA_TURN_G5: 784,
  EXTRA_TURN_C6: 1047,
  VICTORY_C5: 523,
  VICTORY_E5: 659,
  VICTORY_G5: 784,
  VICTORY_C6: 1047,
  DEFEAT_G4: 392,
  DEFEAT_E4: 330,
  DEFEAT_C4: 262,
  DROP_SEQUENCE_BASE: 330,
  DROP_SEQUENCE_INCREMENT: 20,
} as const

// Audio volume constants
const AUDIO_VOLUMES = {
  DEFAULT: 0.3,
  SOFT: 0.15,
  MEDIUM: 0.25,
  LOUD: 0.35,
  DROP_SEQUENCE: 0.12,
} as const

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
  } catch {
    // Silent fail for localStorage errors - non-critical functionality
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
          createTone(ctx, AUDIO_FREQUENCIES.PICKUP_1, 0.1, 'triangle', 0.2)
          setTimeout(() => createTone(ctx, AUDIO_FREQUENCIES.PICKUP_2, 0.08, 'triangle', AUDIO_VOLUMES.SOFT), AUDIO_TIMING.PICKUP_DELAY)
          break

        case 'drop':
          // Short descending tone
          createTone(ctx, AUDIO_FREQUENCIES.DROP, 0.08, 'sine', AUDIO_VOLUMES.SOFT)
          break

        case 'capture':
          // Triumphant ascending sequence
          createTone(ctx, AUDIO_FREQUENCIES.CAPTURE_C5, 0.1, 'square', AUDIO_VOLUMES.MEDIUM)
          setTimeout(() => createTone(ctx, AUDIO_FREQUENCIES.CAPTURE_E5, 0.1, 'square', AUDIO_VOLUMES.MEDIUM), AUDIO_TIMING.CAPTURE_DELAY_1)
          setTimeout(() => createTone(ctx, AUDIO_FREQUENCIES.CAPTURE_G5, 0.2, 'square', AUDIO_VOLUMES.DEFAULT), AUDIO_TIMING.CAPTURE_DELAY_2)
          break

        case 'extraTurn':
          // Ascending chime
          createTone(ctx, AUDIO_FREQUENCIES.EXTRA_TURN_E5, 0.12, 'sine', AUDIO_VOLUMES.MEDIUM)
          setTimeout(() => createTone(ctx, AUDIO_FREQUENCIES.EXTRA_TURN_G5, 0.15, 'sine', AUDIO_VOLUMES.DEFAULT), AUDIO_TIMING.EXTRA_TURN_DELAY_1)
          setTimeout(() => createTone(ctx, AUDIO_FREQUENCIES.EXTRA_TURN_C6, 0.2, 'sine', AUDIO_VOLUMES.MEDIUM), AUDIO_TIMING.EXTRA_TURN_DELAY_2)
          break

        case 'victory':
          // Victory fanfare
          createTone(ctx, AUDIO_FREQUENCIES.VICTORY_C5, 0.15, 'sawtooth', AUDIO_VOLUMES.DEFAULT)
          setTimeout(() => createTone(ctx, AUDIO_FREQUENCIES.VICTORY_E5, 0.15, 'sawtooth', AUDIO_VOLUMES.DEFAULT), AUDIO_TIMING.VICTORY_DELAY_1)
          setTimeout(() => createTone(ctx, AUDIO_FREQUENCIES.VICTORY_G5, 0.15, 'sawtooth', AUDIO_VOLUMES.DEFAULT), AUDIO_TIMING.VICTORY_DELAY_2)
          setTimeout(() => createTone(ctx, AUDIO_FREQUENCIES.VICTORY_C6, 0.4, 'sawtooth', AUDIO_VOLUMES.LOUD), AUDIO_TIMING.VICTORY_DELAY_3)
          break

        case 'defeat':
          // Descending disappointment
          createTone(ctx, AUDIO_FREQUENCIES.DEFEAT_G4, 0.2, 'triangle', AUDIO_VOLUMES.DEFAULT)
          setTimeout(() => createTone(ctx, AUDIO_FREQUENCIES.DEFEAT_E4, 0.2, 'triangle', AUDIO_VOLUMES.DEFAULT), AUDIO_TIMING.DEFEAT_DELAY_1)
          setTimeout(() => createTone(ctx, AUDIO_FREQUENCIES.DEFEAT_C4, 0.3, 'triangle', AUDIO_VOLUMES.MEDIUM), AUDIO_TIMING.DEFEAT_DELAY_2)
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
      for (let i = 0; i < Math.min(count, AUDIO_TIMING.DROP_SEQUENCE_MAX_SOUNDS); i++) {
        setTimeout(() => {
          createTone(ctx, AUDIO_FREQUENCIES.DROP_SEQUENCE_BASE + i * AUDIO_FREQUENCIES.DROP_SEQUENCE_INCREMENT, 0.06, 'sine', AUDIO_VOLUMES.DROP_SEQUENCE)
        }, i * AUDIO_TIMING.DROP_SEQUENCE_INTERVAL)
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
