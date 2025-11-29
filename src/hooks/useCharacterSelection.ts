import { useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Character, CharacterId } from '@shared/characters';
import { getCharacterById } from '@shared/characters';
import type { Difficulty } from '@/types/mancala.types';

export interface CharacterSelection {
  character: Character;
  characterId: CharacterId;
}

/**
 * Hook to manage character selection based on URL parameters or difficulty setting
 * Maps URL parameter ?character=bella|coop|bentley to appropriate character
 * Also maps difficulty to character (bella=easy, coop=medium, bentley=hard)
 */
export function useCharacterSelection(difficulty: Difficulty): CharacterSelection {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get character from URL parameter or map from difficulty
  const characterId = useMemo<CharacterId>(() => {
    const urlCharacter = searchParams.get('character');

    // If valid character in URL, use it
    if (urlCharacter && (urlCharacter === 'bella' || urlCharacter === 'coop' || urlCharacter === 'bentley')) {
      return urlCharacter as CharacterId;
    }

    // Otherwise, map difficulty to character
    const difficultyMap: Record<Difficulty, CharacterId> = {
      easy: 'bella',
      medium: 'coop',
      hard: 'bentley',
    };

    return difficultyMap[difficulty];
  }, [searchParams, difficulty]);

  // Sync URL parameter when character changes
  useEffect(() => {
    const currentUrlCharacter = searchParams.get('character');
    if (currentUrlCharacter !== characterId) {
      setSearchParams({ character: characterId }, { replace: true });
    }
  }, [characterId, searchParams, setSearchParams]);

  const character = useMemo(() => getCharacterById(characterId), [characterId]);

  return {
    character,
    characterId,
  };
}
