# UI Assets Documentation

## Overview
This document details all UI assets created for Mamba Kick, their locations, and usage guidelines.

## Asset Directory Structure
```
public/assets/
├── ui/
│   ├── buttons/
│   │   ├── play.svg         # Main play button
│   │   ├── settings.svg     # Settings menu button
│   │   ├── help.svg         # Help/tutorial button
│   │   └── pause_resume.svg # Pause/resume game controls
│   ├── meters/
│   │   └── power_meter.svg  # Shot power indicator
│   ├── indicators/
│   │   └── aim.svg          # Aiming reticle
│   ├── hud/
│   │   ├── score_display.svg    # Score and multiplier
│   │   └── game_status.svg      # Level and shots remaining
│   └── logo.svg             # Game logo
└── blocks/
    └── block_types.svg      # All block variations
```

## UI Components

### Buttons
- **Play Button**
  - Usage: Main menu, level complete screens
  - Colors: Primary green (#4CAF50)
  - States: Normal, Hover, Active

- **Settings Button**
  - Usage: Main menu, pause menu
  - Colors: Blue (#2196F3)
  - States: Normal, Hover, Active

- **Help Button**
  - Usage: Main menu, pause menu
  - Colors: Orange (#FF9800)
  - States: Normal, Hover, Active

- **Pause/Resume**
  - Usage: In-game controls
  - Colors: Gray (#607D8B), Green (#4CAF50)
  - States: Normal, Hover, Active

### Game Elements
- **Power Meter**
  - Usage: Shot strength indicator
  - States: Empty, 25%, 50%, 75%, Full, Locked
  - Colors:
    - Empty: Red (#f44336)
    - Charging: Orange to Green gradient
    - Locked: Gold accent

- **Aim Indicator**
  - Usage: Shot direction
  - Features: Outer ring, inner crosshair, direction arrow
  - Colors: Blue (#2196F3)

### HUD Elements
- **Score Display**
  - Components: Score label, value, multiplier
  - Animations: Value change pulse, multiplier spin
  - Colors: 
    - Background: Dark (#212121)
    - Text: Light (#BDBDBD)
    - Values: Green (#4CAF50)

- **Game Status**
  - Components: Level indicator, shots remaining
  - Animations: Level change bounce, shot usage fade
  - Colors:
    - Active shots: Red (#F44336)
    - Used shots: Gray (#757575)

### Blocks
- **Standard Block**
  - Color: Blue (#2196F3)
  - Features: Inner stroke detail

- **Unbreakable Block**
  - Color: Dark gray (#424242)
  - Features: Cross pattern

- **Explosive Block**
  - Color: Red (#F44336)
  - Features: Bomb symbol

- **Multiplier Block**
  - Color: Gold (#FFD700)
  - Features: Multiplier text

## Animation Guidelines
1. **Button Interactions**
   - Hover: Scale 1.1x
   - Click: Scale 0.9x
   - Transition: 0.2s ease

2. **Score Changes**
   - Duration: 0.3s
   - Style: Pulse animation
   - Timing: Ease-in-out

3. **Multiplier Updates**
   - Duration: 0.5s
   - Style: Spin animation
   - Timing: Ease-out

4. **Level Changes**
   - Duration: 0.5s
   - Style: Bounce animation
   - Timing: Ease-in-out

## Implementation Notes
1. All SVGs use consistent color variables for easy theming
2. Animations are defined in CSS classes for performance
3. Interactive elements have appropriate hover states
4. All text elements use Arial/Arial Black for consistency
5. Assets are optimized for both desktop and mobile displays

## Accessibility Considerations
1. Minimum contrast ratio 4.5:1 for text elements
2. Touch targets minimum 44x44px for mobile
3. Visual feedback for all interactive elements
4. Text alternatives for icon-only buttons

## Asset Loading Strategy
1. Preload essential UI elements in boot scene
2. Lazy load level-specific assets
3. Use texture atlases for performance
4. Cache common elements for reuse