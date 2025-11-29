# Mancala

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://reactjs.org/)

A feature-rich, browser-based Mancala game with AI opponents, achievements, custom SVG graphics, and smooth animations. Play the ancient African strategy game with modern web technology.

![Screenshot](screenshot.png)

## Features

- **Classic Mancala Gameplay** - Authentic board game mechanics with stone capture and extra turn rules
- **AI Opponents** - Three difficulty levels (Easy, Medium, Hard) with distinct strategies
- **Achievement System** - Unlock badges for special accomplishments and milestones
- **Custom SVG Graphics** - 25+ hand-crafted vector graphics including logos, badges, stones, and victory animations
- **Statistics Tracking** - Monitor wins, losses, win streaks, and personal records
- **History Page** - Learn about Mancala's ancient origins and cultural significance
- **Smooth Animations** - Watch stones distribute step-by-step with configurable timing
- **Game Persistence** - Resume your game exactly where you left off
- **Responsive Design** - Optimized for desktop and mobile devices
- **Accessibility** - Keyboard navigation, screen reader support, and reduced motion options

## Tech Stack

- **React 19** with TypeScript 5.7
- **Vite 5** - Fast development and optimized builds
- **Tailwind CSS 3** + shadcn/ui component library
- **React Router 7** - Client-side routing
- **Jest + Playwright** - Unit and E2E testing
- **ESLint + Prettier** - Code quality and formatting

## Quick Start

### Prerequisites
- Node.js v16 or higher
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mancala.git
cd mancala

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
npm run preview
```

Production files will be in the `dist/` directory.

## How to Play

**Objective**: Capture more stones than your opponent!

**Setup**
- The board has 6 pits per player, each starting with 4 stones
- Each player has a store (mancala) on their side, starting empty
- You control the bottom row of pits

**On Your Turn**
1. Click any pit on your side that contains stones
2. All stones from that pit are picked up
3. Stones are distributed counter-clockwise, one per pit
4. Your opponent's store is skipped during distribution

**Special Rules**
- **Extra Turn**: If your last stone lands in your store, you get another turn
- **Capture**: If your last stone lands in an empty pit on your side, you capture that stone plus all stones in the opposite pit
- **Game End**: When one side runs out of stones, remaining stones go to their owner's store
- **Winner**: The player with the most stones in their store wins

## AI Difficulty Levels

**Easy AI**
- Random move selection from valid moves
- Perfect for learning the game mechanics

**Medium AI**
- Greedy algorithm with tactical scoring
- Prioritizes extra turns and captures

**Hard AI**
- Minimax algorithm with alpha-beta pruning (depth 6)
- Challenging opponent that plans several moves ahead

## Project Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── graphics/              # Custom SVG graphics (25+ components)
│   ├── Board.tsx              # Main game board
│   ├── Pit.tsx                # Individual pit component
│   ├── Store.tsx              # Player store component
│   └── ...                    # Game controls, dialogs, etc.
├── pages/
│   ├── MancalaGame.tsx        # Main game page
│   ├── HistoryPage.tsx        # Game history and culture
│   └── GraphicsShowcase.tsx   # Graphics demo
├── hooks/
│   ├── useMancalaGame.ts      # Game state management
│   ├── useLeaderboard.ts      # Statistics tracking
│   ├── useAchievements.ts     # Achievement system
│   └── ...                    # Additional game hooks
├── lib/
│   ├── mancalaRules.ts        # Game rules engine
│   └── aiStrategies.ts        # AI algorithms
└── types/
    └── mancala.types.ts       # TypeScript definitions
```

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm test             # Run unit tests
npm run test:e2e     # Run E2E tests
```

## Deployment

This is a static site with no backend requirements:

1. Build for production: `npm run build`
2. Deploy the `dist/` directory to any static hosting service:
   - Netlify
   - Vercel
   - GitHub Pages
   - Cloudflare Pages
   - Or your own web server

All game logic runs client-side - no server or database needed!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines

1. Follow the existing code style (ESLint + Prettier are configured)
2. Add tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PR

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

Created by M. Cooper for [www.mcooper.com](https://www.mcooper.com)

Built with assistance from [Claude](https://claude.ai)

---

**Enjoy the game!** If you find this project useful, please consider giving it a star on GitHub.
