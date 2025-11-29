# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Mancala game** - a classic African strategy board game built as a portfolio demonstration piece for www.mcooper.com. The game features AI opponents, leaderboard tracking, and a polished user interface.

### Game Features

- **Classic Mancala gameplay** - Authentic board game rules with stone capture mechanics
- **AI opponents** with 3 difficulty levels:
  - **Easy**: Random move selection
  - **Medium**: Greedy strategy prioritizing captures and extra turns
  - **Hard**: Minimax algorithm with alpha-beta pruning (depth 6)
- **Smooth step-by-step animations** - Watch stones distribute one-by-one (150ms per stone)
- **Leaderboard system** - Track wins, losses, win streaks, highest captures, and fastest wins
- **Achievement system** - Unlock achievements for special accomplishments
- **Local persistence** - Stats, achievements, and game state saved in localStorage with validation
- **Victory dialogs** - Celebrate wins with share functionality and animated graphics
- **Custom SVG graphics** - 25+ scalable graphics including logo, badges, victory/defeat animations, and 5 stone variants
- **History page** - Comprehensive documentation of Mancala's ancient origins and cultural significance
- **Responsive UI** - Beautiful gradient backgrounds with natural stone colors and decorative patterns
- **Move feedback** - Visual indicators for captures, extra turns, and animations
- **Accessibility features** - Keyboard controls, screen reader support, reduced motion support

### Technology Stack

- **React 19** with TypeScript - Latest React with improved performance
- **Vite 5** - Lightning-fast build tool and dev server
- **Tailwind CSS + shadcn/ui** - Beautiful, accessible component library
- **React Router 7** - Client-side routing
- **React Hook Form 7 + Zod** - Type-safe form handling with validation
- **Jest 30 + Playwright** - Comprehensive testing
- **ESLint 9 + Prettier** - Code quality and formatting
- **Husky + lint-staged** - Pre-commit hooks for code quality
- **Error Boundaries** - Graceful error handling
- **GitHub Actions** - Automated CI/CD pipeline

## Common Development Commands

### Development

```bash
npm install --no-bin-links           # Install dependencies (required for WSL on Windows filesystem)
npm run dev                          # Start development server on http://localhost:3000
npm run build                        # Build for production (runs type-check + vite build)
npm run preview                      # Preview production build locally
```

### Code Quality

```bash
npm run lint                         # Run ESLint
npm run lint:fix                     # Run ESLint and auto-fix issues
npm run format                       # Format code with Prettier
npm run format:check                 # Check if code is formatted
npm run type-check                   # Run TypeScript compiler without emitting files
```

### Testing

```bash
npm test                             # Run unit tests
npm run test:watch                   # Run tests in watch mode
npm run test:coverage                # Run tests with coverage report
npm run test:e2e                     # Run Playwright e2e tests
npm run test:e2e:ui                  # Run Playwright tests with UI
```

### Running Individual Commands (WSL Workaround)

Due to WSL file permission issues on Windows filesystems, bin links are disabled. Use these alternatives:

```bash
node node_modules/typescript/lib/tsc.js --noEmit  # Type checking
node node_modules/eslint/bin/eslint.js .          # Linting
node node_modules/vite/bin/vite.js               # Dev server
node node_modules/prettier/bin/prettier.js --write "**/*.{ts,tsx,js,jsx,json,css,md}"  # Format
```

### shadcn/ui Components

```bash
npx shadcn@latest add button         # Add button component
npx shadcn@latest add card            # Add card component
npx shadcn@latest add dialog          # Add dialog component
npx shadcn@latest add form            # Add form component
npx shadcn@latest add input           # Add input component
```

## Project Structure

```
/
├── src/
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components (button, card, dialog, select)
│   │   ├── graphics/               # Custom SVG graphics components
│   │   │   ├── MancalaLogo.tsx          # Brand logo with board design
│   │   │   ├── AchievementBadge.tsx     # 4-tier achievement badges (gold, silver, bronze, platinum)
│   │   │   ├── BoardPattern.tsx         # Wood grain texture and decorative corners
│   │   │   ├── VictoryGraphic.tsx       # Victory trophy, defeat cloud, celebration burst
│   │   │   ├── StoneGraphic.tsx         # 5 stone variants (smooth, textured, gem, rustic, polished)
│   │   │   ├── index.ts                 # Barrel export
│   │   │   └── README.md                # Graphics documentation
│   │   ├── Board.tsx               # Main game board component with animation overlay
│   │   ├── Pit.tsx                 # Individual pit component with stone display
│   │   ├── Store.tsx               # Player store (mancala) component
│   │   ├── Stone.tsx               # Animated stone component with natural colors
│   │   ├── GameControls.tsx        # Game controls (difficulty, new game, leaderboard)
│   │   ├── VictoryDialog.tsx       # End game victory/defeat dialog with graphics
│   │   ├── LeaderboardDialog.tsx   # Stats and leaderboard dialog
│   │   ├── AchievementToast.tsx    # Toast notification for unlocked achievements
│   │   ├── Tutorial.tsx            # Interactive tutorial walkthrough
│   │   ├── HowToPlayDialog.tsx     # Game rules and instructions
│   │   ├── AudioControls.tsx       # Sound toggle controls
│   │   ├── KeyboardShortcutsDialog.tsx # Keyboard shortcuts reference
│   │   ├── AriaAnnouncer.tsx       # Screen reader announcements
│   │   └── ContinueGameDialog.tsx  # Resume saved game prompt
│   ├── pages/
│   │   ├── MancalaGame.tsx      # Main Mancala game page
│   │   ├── HistoryPage.tsx      # Game history and cultural background
│   │   ├── GraphicsShowcase.tsx # Visual showcase of all graphics components
│   │   ├── HomePage.tsx         # Template homepage (accessible via /template)
│   │   └── AboutPage.tsx        # About page
│   ├── hooks/
│   │   ├── useMancalaGame.ts       # Mancala game state management hook with animations
│   │   ├── useLeaderboard.ts       # Leaderboard and stats management hook
│   │   ├── useAchievements.ts      # Achievement tracking and unlocking
│   │   ├── useGamePersistence.ts   # Save/load game state with validation
│   │   ├── useGameAudio.ts         # Sound effects and music
│   │   ├── useReducedMotion.ts     # Accessibility: detect reduced motion preference
│   │   └── useKeyboardControls.ts  # Keyboard navigation and shortcuts
│   ├── lib/
│   │   ├── mancalaRules.ts      # Game rules engine (move validation, execution, scoring)
│   │   ├── aiStrategies.ts      # AI algorithms (random, greedy, minimax)
│   │   └── utils.ts             # Utility functions (cn helper)
│   ├── types/
│   │   └── mancala.types.ts     # TypeScript types for game state, moves, leaderboard
│   ├── __tests__/               # Unit tests
│   ├── App.tsx                  # Main app with routing and error boundary
│   ├── main.tsx                 # Entry point with providers
│   ├── index.css                # Global styles with Tailwind + shadcn variables
│   ├── vite-env.d.ts            # Vite type declarations
│   └── setupTests.ts            # Jest setup file
├── e2e/                         # Playwright end-to-end tests
├── public/                      # Static assets
├── .vscode/                     # VS Code settings and extensions
├── .github/workflows/           # GitHub Actions CI/CD
├── .husky/                      # Git hooks
├── dist/                        # Production build output (gitignored)
├── index.html                   # HTML entry point
├── vite.config.ts               # Vite configuration with @ alias
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.cjs           # PostCSS configuration
├── components.json              # shadcn/ui configuration
├── jest.config.ts               # Jest configuration
├── playwright.config.ts         # Playwright configuration
├── tsconfig.json                # TypeScript configuration for src
├── tsconfig.node.json           # TypeScript configuration for config files
├── eslint.config.js             # ESLint 9 flat config
├── .prettierrc                  # Prettier configuration
├── .lintstagedrc.json           # lint-staged configuration
├── .npmrc                       # npm configuration with WSL workarounds
├── .env.example                 # Environment variables template
└── .gitignore                   # Git ignore patterns
```

## Architecture & Conventions

### Component Organization

- **Pages**: Place page components in `src/pages/`
- **Components**: Reusable components in `src/components/`
- **UI Components**: shadcn/ui components in `src/components/ui/`
- **Hooks**: Custom hooks in `src/hooks/`
- **Game Logic**: Game rules and AI in `src/lib/`
- **Type Definitions**: TypeScript types in `src/types/`
- Use the `@/` path alias for clean imports: `import { cn } from '@/lib/utils'`

### Routing

- React Router 7 configured in `src/App.tsx`
- **Main game**: `/` - Mancala game (default route)
- **History page**: `/history` - Game history and cultural background
- **Graphics showcase**: `/graphics` - Visual demo of all graphics components
- **Template examples**: `/template` - Original template homepage
- **About page**: `/about` - About page

### Game Architecture

#### Game State Management (`useMancalaGame` hook)

- Manages complete game state (board, current player, status, winner, difficulty)
- Handles move validation and execution with step-by-step animation
- **Animation System**:
  - Step-by-step stone distribution at 150ms per stone (configurable via `ANIMATION_DELAY_PER_STONE`)
  - Proper timeout cleanup to prevent memory leaks
  - Race condition protection with `cancelAnimations()` function
  - Animation lock prevents moves during animation playback
  - Uses ref-based step tracking to avoid stale closures
  - Error handling with try-catch for graceful degradation
- Triggers AI moves automatically when it's AI's turn
- Debounced AI move scheduling to prevent duplicate calculations
- Provides game controls (start, reset, difficulty change)
- Cancels animations on game reset for clean state transitions

#### Game Rules Engine (`mancalaRules.ts`)

- **Board layout**: 14 pits total (6 per player + 2 stores)
- **Move execution**: Counter-clockwise stone distribution
  - `executeMove()` - Instant move execution
  - `executeMoveAnimated()` - Returns array of intermediate board states for animation
- **Move simulation**: `simulateMove()` for move preview without modifying state
- **Capture logic**: Landing in empty pit captures opposite stones
- **Extra turns**: Landing in own store grants another turn
- **Win condition**: Most stones in store when one side is empty

#### AI Strategies (`aiStrategies.ts`)

- **Easy AI**: Random valid move selection
- **Medium AI**: Greedy algorithm prioritizing:
  - Extra turns (+50 points)
  - Captures (+10 per stone)
  - Immediate stone gain
- **Hard AI**: Minimax with alpha-beta pruning
  - Search depth: 6 levels
  - Evaluation function: store difference + mobility bonus
  - Handles extra turn chains correctly

#### Leaderboard System (`useLeaderboard` hook)

- Tracks player stats in localStorage
- Metrics: wins, losses, win streak, highest capture, fastest win
- Persistent across sessions
- Player name customization

#### Achievement System (`useAchievements` hook)

- Tracks unlockable achievements (First Victory, Perfect Capture, Chain Master, etc.)
- **Optimized progress tracking**:
  - Uses `currentExtraTurnChain` and `maxExtraTurnChain` instead of unbounded array
  - Prevents localStorage quota errors from data growth
  - Efficient memory usage for long gaming sessions
- Achievement progress persisted in localStorage
- Toast notifications for newly unlocked achievements

#### Game Persistence (`useGamePersistence` hook)

- Auto-saves game state to localStorage during active play
- **Comprehensive data validation**:
  - Validates board structure (14 pits, non-negative integers)
  - Validates player state (1 or 2)
  - Validates game mode and difficulty
  - Type-safe validation with `isValidSavedGame()` guard function
  - Automatic cleanup of corrupted data
- Resume game functionality with saved state restoration
- Prevents crashes from malicious or corrupted localStorage data

#### Graphics Components (`src/components/graphics/`)

Custom SVG graphics library providing scalable, accessible visual elements throughout the game:

**MancalaLogo** - Brand identity
- Stylized mancala board with pits and stones
- Amber/brown gradient color scheme
- Scalable to any size without quality loss
- Used in welcome screen and marketing materials

**AchievementBadge** - Achievement system visuals
- 4 tiers: gold, silver, bronze, platinum
- Star-shaped design with gradients and glow effects
- Lock/unlock states with animated transitions
- Custom emoji/icon support in center
- Used in achievement toasts and leaderboard

**BoardPattern & BoardCorner** - Board decorations
- Wood grain texture with subtle circle patterns
- Decorative corner embellishments (4 positions)
- Layered opacity for depth effects
- Enhances visual polish of game board

**VictoryGraphic, DefeatGraphic, CelebrationBurst** - Game result animations
- **VictoryGraphic**: Animated golden trophy with rotating stars
- **DefeatGraphic**: Sad cloud with animated rain drops
- **CelebrationBurst**: Radial burst effect for special moments
- All use CSS/SVG animations for smooth 60fps performance
- Displayed in victory dialog and special events

**StoneGraphic & AnimatedStone** - Game piece variations
- 5 visual styles: smooth, textured, gem, rustic, polished
- 5 color variants each (25 total combinations)
- Realistic shading, highlights, and textures
- Drop animation support for dynamic effects
- Potential replacement for existing Stone component

**Key Features:**
- 100% SVG for infinite scalability
- Dark mode compatible
- Accessible with ARIA labels
- Optimized for performance (<15KB total)
- Hardware-accelerated animations
- Comprehensive documentation in `graphics/README.md`

### Error Handling

- Error boundaries wrap the app in `src/App.tsx`
- Global error fallback UI for production
- Use `react-error-boundary` for granular error handling

### Styling with Tailwind & shadcn/ui

- Tailwind CSS utility classes are the primary styling method
- shadcn/ui provides pre-built, accessible components
- Use the `cn()` utility from `@/lib/utils` to merge Tailwind classes
- CSS variables defined in `src/index.css` control the theme
- Dark mode supported via the `dark` class on root element

### TypeScript Configuration

- Strict mode enabled for type safety
- Path aliases configured: `@/*` maps to `./src/*`
- React 19 JSX transform (no need to import React in every file)
- Module resolution set to "bundler" for Vite compatibility
- Type checking runs before production builds

### Testing Strategy

- **Unit Tests**: Jest + React Testing Library in `src/__tests__/`
- **E2E Tests**: Playwright tests in `e2e/` directory
- `setupTests.ts` imports `@testing-library/jest-dom` for extended matchers
- Playwright configured to test against Chromium, Firefox, and WebKit

### Code Quality

- **ESLint 9**: Flat config format with TypeScript support
- **Prettier**: Auto-formatting with Tailwind class sorting
- **Husky**: Git hooks for pre-commit checks
- **lint-staged**: Runs linters on staged files only
- Pre-commit hook runs ESLint + Prettier on changed files

### Environment Variables

- Create `.env` file based on `.env.example`
- Vite exposes variables with `VITE_` prefix
- Access in code: `import.meta.env.VITE_API_URL`
- Never commit `.env` to version control

### Build Process

- Development: Vite's HMR for instant updates
- Production: TypeScript compile → Vite build with optimizations
- Source maps enabled in production builds
- Output directory: `dist/`

### CI/CD with GitHub Actions

- Automated workflow in `.github/workflows/ci.yml`
- Runs on push to main/develop and on pull requests
- Jobs: lint & type-check, unit tests, e2e tests, build
- Coverage reports and artifacts uploaded

## Important Notes for WSL + Windows Filesystem

This project includes workarounds for developing on a Windows filesystem in WSL:

1. **`.npmrc`** contains:
   - `ignore-scripts=true` - Skips problematic post-install scripts
   - Script configuration for bash shell

2. **Always use `--no-bin-links`** when running `npm install`:

   ```bash
   npm install --no-bin-links
   ```

3. **Scripts must be run through node_modules** or **npx** since bin links aren't created:

   ```bash
   # Instead of: npm run type-check
   node node_modules/typescript/lib/tsc.js --noEmit

   # Or use npm scripts which work correctly:
   npm run dev
   npm test
   ```

## Game Implementation Details

### How Mancala Works

**Objective**: Capture more stones than your opponent

**Setup**:

- 6 pits per player, each starting with 4 stones
- 2 stores (mancalas), one per player, starting empty

**Gameplay**:

1. Click a pit on your side to pick up all stones
2. Distribute stones counter-clockwise, one per pit
3. Skip opponent's store when distributing
4. **Extra turn**: If your last stone lands in your store, go again
5. **Capture**: If your last stone lands in an empty pit on your side, capture that stone plus all stones in the opposite pit

**Winning**: When one side is empty, the game ends. Remaining stones go to their owner's store. Most stones wins!

### Code Organization

- **Separation of Concerns**: Game logic (rules, AI) is separate from UI components
- **Type Safety**: Full TypeScript coverage with custom types
- **Immutability**: Game state updates use immutable patterns
- **Performance**: Minimax depth limited to 6 for responsive AI
- **Extensibility**: Easy to add new AI strategies or game modes

## Recent Improvements & Bug Fixes

### Custom Graphics Library (Latest)

**New SVG Components:**
- 🎨 **Complete graphics system** - 8 new SVG components with 25+ visual variants
- 🏆 **MancalaLogo** - Custom brand logo with stylized board design
- 🏅 **AchievementBadge** - 4-tier badges (gold/silver/bronze/platinum) with lock states
- 🎭 **Victory/Defeat Graphics** - Animated trophy and sad cloud for game results
- 💎 **StoneGraphic** - 5 realistic stone styles (smooth, textured, gem, rustic, polished)
- 🎨 **BoardPattern** - Wood grain texture and decorative corner embellishments
- ✨ **CelebrationBurst** - Radial burst animation for special moments

**New Pages:**
- 📜 **History Page** (`/history`) - Comprehensive documentation of Mancala's ancient origins
  - Covers 6th century origins in Africa
  - Cultural significance and social functions
  - Game variations (Oware, Bao, Kalah, Congklak)
  - Modern era evolution and mathematical depth
- 🎨 **Graphics Showcase** (`/graphics`) - Interactive display of all graphics components
  - Live demonstrations of all 25+ graphics
  - Size variations and states (locked/unlocked)
  - Technical details and usage examples

**Visual Enhancements:**
- 🎯 **Enhanced Victory Dialog** - Now displays animated trophy or sad cloud
- 🖼️ **Decorated Board** - Wood grain texture with ornamental corners
- 🎨 **Welcome Screen Logo** - Mancala logo replaces generic emoji
- 📚 **Rich Documentation** - Comprehensive README in `graphics/` directory

**Technical Details:**
- 100% SVG-based for infinite scalability
- <15KB total bundle size impact
- 60fps hardware-accelerated animations
- Full TypeScript support with prop types
- Dark mode compatible throughout
- WCAG 2.1 AA accessibility compliant
- Zero external dependencies

### Animation System Overhaul (Critical)

**Fixed Critical Bugs:**
- ✅ **Memory leak** from improper timeout cleanup - Changed from single timeout ref to array tracking
- ✅ **Race condition** allowing concurrent animations - Added `cancelAnimations()` with proper cleanup
- ✅ **Stale closure** in animation loop - Fixed with ref-based step tracking (`stepRef.current`)
- ✅ **Missing cleanup** on game reset - Animations now cancel when starting/resetting games
- ✅ **Error handling** - Added try-catch blocks for graceful degradation

**Performance Improvements:**
- ⚡ **62.5% faster animations** - Reduced from 400ms to 150ms per stone
- 🚫 **Prevented duplicate AI moves** - Added `aiMoveScheduledRef` debouncing
- 💾 **Reduced memory usage** - Proper cleanup prevents timeout accumulation

### Data Validation & Storage (High Priority)

**localStorage Security:**
- 🔒 **Comprehensive validation** - Added `isValidSavedGame()` type guard
  - Validates board structure (14 pits, integers ≥ 0)
  - Validates player (1 or 2), status, mode, difficulty
  - Validates move history and winner fields
- 🧹 **Automatic cleanup** - Corrupted data removed to prevent crashes
- 🛡️ **Security hardening** - Prevents malicious localStorage attacks

**Achievement Tracking:**
- 📊 **Fixed unbounded array growth** - Replaced `extraTurnChains: number[]` with bounded fields:
  - `currentExtraTurnChain: number` - Current chain count
  - `maxExtraTurnChain: number` - Record for achievements
- 💾 **Prevents quota exceeded errors** - No more localStorage limit issues after extended play

### UX Improvements

**Visual Feedback:**
- 👆 **Animation lock indicator** - Cursor changes to `wait` during animations
- 🎯 **Cleaner pit display** - Stone count badge hidden for counts >12 (number already shown)
- 🎨 **Natural stone colors** - Changed from bright colors to earthy tones (stone, amber, slate)
- ✨ **Subtler animations** - Reduced flashing and pulsing effects

**Animation Tuning:**
- Reduced stone drop distance (10px → 4px)
- Smaller scale changes (0.8-1.1 → 0.9-1.05)
- Softer ring indicators (ring-4 → ring-2, reduced opacity)

### Code Quality

**Type Safety:**
- All TypeScript errors resolved
- Proper timeout types with `ReturnType<typeof setTimeout>`
- Type guards for localStorage data validation

**Best Practices:**
- Proper React hooks dependency arrays
- Memory leak prevention with cleanup functions
- Error boundaries and try-catch blocks
- Immutable state updates throughout

## Deployment

This game is designed to be deployed as a static site to www.mcooper.com:

1. Build for production: `npm run build`
2. The `dist/` folder contains all static assets
3. Deploy `dist/` to your web server or static hosting service
4. No backend required - all game logic runs client-side

## Portfolio Highlights

This project demonstrates:

- **Complex State Management**: Multi-step game logic with conditional flows and step-by-step animations
- **Algorithm Implementation**: Minimax with alpha-beta pruning for AI opponent
- **Performance Optimization**:
  - Memory leak prevention with proper cleanup
  - Race condition handling in concurrent animations
  - Debounced AI move scheduling
  - Efficient localStorage usage
- **TypeScript Proficiency**:
  - Strong typing throughout with type guards
  - Discriminated unions for game state
  - Type-safe validation functions
- **React Best Practices**:
  - Custom hooks with proper dependency management
  - Component composition and separation of concerns
  - Error boundaries and graceful degradation
  - Proper cleanup in useEffect hooks
- **Security & Data Validation**:
  - Comprehensive localStorage validation
  - Protection against corrupted/malicious data
  - Type-safe parsing with runtime checks
- **UI/UX Polish**:
  - Smooth step-by-step animations (150ms timing)
  - Visual feedback (cursor states, animation locks)
  - Responsive design with accessibility features
  - Natural color palette and subtle effects
- **Custom Graphics & Visual Design**:
  - 25+ hand-crafted SVG components
  - Scalable vector graphics for crisp rendering
  - Animated victory/defeat graphics
  - 5 distinct stone styles with realistic textures
  - Professional logo design
  - Decorative board patterns
- **Content & Documentation**:
  - Comprehensive game history page
  - Interactive graphics showcase
  - In-component documentation
  - Detailed technical README files
- **Testing**: Unit and E2E test infrastructure with Jest and Playwright
- **Build Tooling**: Modern dev experience with Vite, ESLint, Prettier
- **Code Quality**: ESLint 9 + Prettier with pre-commit hooks via Husky

## VS Code Setup

Recommended extensions (automatically suggested when opening the project):

- ESLint - Code linting
- Prettier - Code formatting
- Tailwind CSS IntelliSense - Tailwind class autocomplete
- Playwright Test - E2E test runner
- Jest Runner - Unit test runner
- Error Lens - Inline error display

Settings are pre-configured for:

- Format on save
- Auto-fix ESLint issues on save
- Tailwind class suggestions

## Technology Versions

- React: 19.2.0
- TypeScript: 5.7.3
- Vite: 5.4.21
- Tailwind CSS: 3.4.18
- React Router: 7.2.0
- TanStack Query: 5.70.0
- React Hook Form: 7.55.2
- Zod: 3.24.1
- Jest: 30.2.0
- Playwright: 1.56.1
- ESLint: 9.39.1
- Prettier: 3.4.2
- shadcn/ui: Latest via CLI

All dependencies are set to the latest stable versions as of template creation.
