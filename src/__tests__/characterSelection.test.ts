import { renderHook } from '@testing-library/react'
import {
  getCharacterIdFromUrl,
  getDifficultyFromUrl,
  useCharacterSelection,
} from '@/hooks/useCharacterSelection'

describe('character URL parameter', () => {
  it('maps bentley, bella and coop to ids and difficulties', () => {
    expect(getCharacterIdFromUrl('?character=bentley')).toBe('bentley')
    expect(getDifficultyFromUrl('?character=bentley')).toBe('hard')
    expect(getDifficultyFromUrl('?character=bella')).toBe('easy')
    expect(getDifficultyFromUrl('?character=coop')).toBe('medium')
  })

  it('returns null for missing or invalid values', () => {
    expect(getDifficultyFromUrl('')).toBeNull()
    expect(getDifficultyFromUrl('?character=nobody')).toBeNull()
    expect(getDifficultyFromUrl('?character=toString')).toBeNull()
  })

  it('reads window.location.search by default', () => {
    window.history.pushState({}, '', '/?character=bentley')
    expect(getDifficultyFromUrl()).toBe('hard')
    window.history.pushState({}, '', '/')
    expect(getDifficultyFromUrl()).toBeNull()
  })

  it('derives the displayed character from difficulty', () => {
    expect(renderHook(() => useCharacterSelection('hard')).result.current.characterId).toBe('bentley')
    expect(renderHook(() => useCharacterSelection('easy')).result.current.character.name).toBe('Bella')
    expect(renderHook(() => useCharacterSelection('medium')).result.current.characterId).toBe('coop')
  })
})
