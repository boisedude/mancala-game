// Centralized constants for the Mancala game

/**
 * UI timing constants (in milliseconds)
 * Used for animations, notifications, and delayed UI updates
 */
export const UI_TIMING = {
  // Welcome/Setup delays
  WELCOME_DIALOG_DELAY: 500,

  // Game start animation
  START_GAME_DELAY: 300,

  // Notification durations
  COPY_NOTIFICATION_DURATION: 2000,
  CONFETTI_DURATION: 3000,
  ACHIEVEMENT_TOAST_DURATION: 5000,
} as const
