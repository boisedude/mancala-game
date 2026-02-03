// Centralized localStorage key constants for the Mancala game

export const STORAGE_KEYS = {
  // Game persistence
  SAVED_GAME: 'mancala_saved_game',

  // Achievements
  ACHIEVEMENTS: 'mancala_achievements',
  ACHIEVEMENT_PROGRESS: 'mancala_achievement_progress',

  // User experience
  SEEN_WELCOME: 'mancala_seen_welcome',
  TUTORIAL_COMPLETED: 'mancala_tutorial_completed',

  // Leaderboard/Stats
  LEADERBOARD: 'mancala_leaderboard',
  PLAYER_NAME: 'mancala_player_name',

  // Settings
  GAME_SETTINGS: 'mancala_game_settings',

  // Audio
  AUDIO_MUTED: 'mancala_audio_muted',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]
