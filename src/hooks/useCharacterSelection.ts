import { useMemo } from 'react';
import type { Character, CharacterId } from '@shared/characters';
import { getCharacterById } from '@shared/characters';
import type { Difficulty } from '@/types/mancala.types';

export interface CharacterSelection {
  character: Character;
  characterId: CharacterId;
}

const difficultyToCharacter: Record<Difficulty, CharacterId> = {
  easy: 'bella',
  medium: 'coop',
  hard: 'bentley',
};

const characterToDifficulty: Record<CharacterId, Difficulty> = {
  bella: 'easy',
  coop: 'medium',
  bentley: 'hard',
};

/**
 * Read ?character=bella|coop|bentley from the real query string. The app uses a
 * HashRouter and the arcade links to index.html?character=x (query before the
 * hash), so React Router's useSearchParams never sees it.
 */
export function getCharacterIdFromUrl(search: string = window.location.search): CharacterId | null {
  const value = new URLSearchParams(search).get('character');
  return value && Object.prototype.hasOwnProperty.call(characterToDifficulty, value) ? (value as CharacterId) : null;
}

/** Difficulty implied by the URL parameter, or null when absent/invalid. */
export function getDifficultyFromUrl(search: string = window.location.search): Difficulty | null {
  const id = getCharacterIdFromUrl(search);
  return id ? characterToDifficulty[id] : null;
}

/**
 * The displayed opponent is always derived from the game's difficulty, which is
 * the single source of truth (it is seeded from the URL on load and changed by
 * the dropdown).
 */
export function useCharacterSelection(difficulty: Difficulty): CharacterSelection {
  const characterId = difficultyToCharacter[difficulty];
  const character = useMemo(() => getCharacterById(characterId), [characterId]);
  return { character, characterId };
}
