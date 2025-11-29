# Mancala Graphics Components

Custom SVG graphics library for the Mancala game. All components are fully scalable, accessible, and optimized for performance.

## Components Overview

### MancalaLogo

Brand logo featuring a stylized mancala board with stones.

```tsx
import { MancalaLogo } from '@/components/graphics'

<MancalaLogo size={120} className="drop-shadow-lg" />
```

**Props:**
- `size?: number` - Logo size in pixels (default: 200)
- `className?: string` - Additional CSS classes

**Features:**
- Gradient amber/brown color scheme
- Simplified board representation
- Decorative stones and pits
- Drop shadow and border effects

---

### AchievementBadge

Star-shaped achievement badges with multiple tiers and lock states.

```tsx
import { AchievementBadge } from '@/components/graphics'

<AchievementBadge
  type="gold"
  icon="🏆"
  size={100}
  unlocked={true}
/>
```

**Props:**
- `type: 'gold' | 'silver' | 'bronze' | 'platinum'` - Badge tier/color
- `icon?: string` - Emoji or text to display in center
- `size?: number` - Badge size (default: 80)
- `className?: string` - Additional CSS classes
- `unlocked?: boolean` - Show as unlocked or locked (default: true)

**Features:**
- Four tier colors (gold, silver, bronze, platinum)
- Animated glow effect when unlocked
- Lock icon overlay when locked
- Star-shaped design with gradients
- Custom icon support

---

### BoardPattern & BoardCorner

Decorative elements for enhancing the game board.

```tsx
import { BoardPattern, BoardCorner } from '@/components/graphics'

// Background texture
<BoardPattern className="rounded-3xl opacity-40" />

// Corner embellishments
<BoardCorner position="top-left" />
<BoardCorner position="top-right" />
<BoardCorner position="bottom-left" />
<BoardCorner position="bottom-right" />
```

**BoardPattern Props:**
- `className?: string` - Additional CSS classes

**BoardCorner Props:**
- `position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'` - Corner position
- `className?: string` - Additional CSS classes

**Features:**
- Wood grain texture pattern
- Subtle circle pattern overlay
- Decorative corner elements
- Automatic rotation based on position
- Opacity controls for layering

---

### VictoryGraphic

Animated trophy celebrating player victory.

```tsx
import { VictoryGraphic } from '@/components/graphics'

<VictoryGraphic size={200} animated={true} />
```

**Props:**
- `size?: number` - Graphic size (default: 200)
- `className?: string` - Additional CSS classes
- `animated?: boolean` - Enable animations (default: true)

**Features:**
- Golden trophy with handles
- Animated glow effect
- Rotating decorative stars
- Star emblem on trophy
- Shadow effects

---

### DefeatGraphic

Sad cloud with rain for game over state.

```tsx
import { DefeatGraphic } from '@/components/graphics'

<DefeatGraphic size={200} />
```

**Props:**
- `size?: number` - Graphic size (default: 200)
- `className?: string` - Additional CSS classes

**Features:**
- Sad cloud character
- Animated rain drops
- Tear drop detail
- Subtle gray color scheme
- Smooth animations

---

### CelebrationBurst

Radial burst effect for special celebrations.

```tsx
import { CelebrationBurst } from '@/components/graphics'

<CelebrationBurst size={300} />
```

**Props:**
- `size?: number` - Burst size (default: 300)
- `className?: string` - Additional CSS classes

**Features:**
- 12 radiating lines
- Expanding center circle
- Staggered animation timing
- Fades out after completion
- Transparent overlay (doesn't block content)

---

### StoneGraphic

Realistic stone graphics with multiple visual styles.

```tsx
import { StoneGraphic } from '@/components/graphics'

<StoneGraphic
  variant="smooth"
  size={32}
  colorIndex={0}
/>
```

**Props:**
- `variant?: 'smooth' | 'textured' | 'gem' | 'rustic' | 'polished'` - Stone style (default: 'smooth')
- `size?: number` - Stone size (default: 16)
- `className?: string` - Additional CSS classes
- `colorIndex?: number` - Color variant 0-4 (cycles through 5 colors)

**Variants:**
- **smooth** - Simple rounded stones with gradient
- **textured** - Stones with surface texture pattern
- **gem** - Faceted gem-like appearance
- **rustic** - Irregular natural stone shape
- **polished** - High-gloss shiny stones with highlights

**Color Palette:**
0. Stone gray
1. Amber/gold
2. Slate blue
3. Neutral gray
4. Zinc gray

---

### AnimatedStone

Stone with drop animation effect.

```tsx
import { AnimatedStone } from '@/components/graphics'

<AnimatedStone
  variant="smooth"
  size={32}
  colorIndex={0}
  animate={true}
/>
```

**Props:**
- Same as `StoneGraphic` plus:
- `animate?: boolean` - Enable drop animation (default: true)

**Features:**
- CSS-based drop animation
- Stagger delay for cascading effect
- Works with all stone variants

---

## Usage Examples

### Enhanced Victory Dialog

```tsx
import { VictoryGraphic, DefeatGraphic } from '@/components/graphics'

function VictoryDialog({ playerWon }) {
  return (
    <Dialog>
      <div className="flex justify-center py-4">
        {playerWon ? (
          <VictoryGraphic size={120} animated={true} />
        ) : (
          <DefeatGraphic size={120} />
        )}
      </div>
      {/* ... rest of dialog */}
    </Dialog>
  )
}
```

### Decorated Game Board

```tsx
import { BoardPattern, BoardCorner } from '@/components/graphics'

function Board() {
  return (
    <div className="relative rounded-3xl border-4 border-amber-200">
      <BoardPattern className="rounded-3xl opacity-40" />

      <div className="absolute left-2 top-2">
        <BoardCorner position="top-left" />
      </div>
      <div className="absolute right-2 top-2">
        <BoardCorner position="top-right" />
      </div>
      {/* ... more corners and board content */}
    </div>
  )
}
```

### Achievement Display

```tsx
import { AchievementBadge } from '@/components/graphics'

function AchievementList({ achievements }) {
  return (
    <div className="flex gap-4">
      {achievements.map(achievement => (
        <AchievementBadge
          key={achievement.id}
          type={achievement.tier}
          icon={achievement.icon}
          size={80}
          unlocked={achievement.unlocked}
        />
      ))}
    </div>
  )
}
```

### Custom Stone Display

```tsx
import { StoneGraphic } from '@/components/graphics'

function Pit({ stones }) {
  return (
    <div className="flex flex-wrap gap-1">
      {Array.from({ length: stones }, (_, i) => (
        <StoneGraphic
          key={i}
          variant="polished"
          size={16}
          colorIndex={i % 5}
        />
      ))}
    </div>
  )
}
```

## Design Philosophy

All graphics follow these principles:

1. **Scalable** - Pure SVG for crisp rendering at any size
2. **Performant** - Optimized paths and minimal DOM nodes
3. **Accessible** - ARIA labels and semantic markup
4. **Themeable** - Works with light and dark modes
5. **Animated** - Smooth CSS/SVG animations where appropriate
6. **Modular** - Easy to compose and customize

## File Structure

```
src/components/graphics/
├── MancalaLogo.tsx           # Brand logo component
├── AchievementBadge.tsx      # Achievement badge with tiers
├── BoardPattern.tsx          # Board texture and corners
├── VictoryGraphic.tsx        # Victory/defeat/celebration graphics
├── StoneGraphic.tsx          # Stone variants and animations
├── index.ts                  # Barrel export
└── README.md                 # This file
```

## Browser Compatibility

All components use standard SVG features supported by:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

Animations use CSS transforms and are hardware-accelerated for smooth performance.

## Performance Notes

- Graphics are lazy-loaded with the components that use them
- SVG gradients and filters are defined once and reused
- Animations use `requestAnimationFrame` where applicable
- No external dependencies required

## Future Enhancements

Potential additions:
- Additional stone variants (crystal, obsidian, jade)
- More achievement badge designs
- Animated board transition effects
- Particle effects for captures
- Sound wave visualizations
- 3D perspective variants
