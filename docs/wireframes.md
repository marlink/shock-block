# Mamba Kick - Wireframes

## Game States and UI Elements

### 1. Main Menu Scene
```
+------------------+
|    MAMBA KICK    | <- Game Logo
|                  |
|     [PLAY]       | <- Primary Button
|   [SETTINGS]     |
|     [HELP]       |
|                  |
| High Score: 1000 | <- Persistent Stats
+------------------+
```

### 2. Game Scene (Active Play)
```
+------------------+
| Score: 0  ⭐ x3  | <- Score & Multiplier
| Level: 1  🎯 x5  | <- Level & Shots Left
|                  |
|    🟦 🟨 🟥      | <- Blocks
|    🟨 💣 🟦      | <- Special Blocks
|                  |
|       [P]        | <- Pause Button
|                  |
|    ⬅️ 🎯 ➡️      | <- Aim Controls
|   [POWER: 75%]   | <- Power Meter
+------------------+
```

### 3. Pause Menu Overlay
```
+------------------+
|      PAUSED      |
|                  |
|    [RESUME]      |
|    [RESTART]     |
|    [SETTINGS]    |
|     [QUIT]       |
|                  |
+------------------+
```

### 4. Level Complete Screen
```
+------------------+
| LEVEL COMPLETE!  |
|                  |
| Score: 1500      |
| Blocks: 12/15    |
| Shots Used: 4/5  |
| Perfect: ⭐⭐⭐   |
|                  |
|    [CONTINUE]    |
|     [RETRY]      |
+------------------+
```

### 5. Game Over Screen
```
+------------------+
|    GAME OVER     |
|                  |
| Final Score: 1500|
| Levels Clear: 5  |
| Best Combo: x4   |
|                  |
|   [TRY AGAIN]    |
|   [MAIN MENU]    |
+------------------+
```

### 6. Settings Menu
```
+------------------+
|    SETTINGS      |
|                  |
| Sound: [▮▮▮▯▯]  |
| Music: [▮▮▯▯▯]  |
|                  |
| Vibration: [ON]  |
| Hints: [ON]      |
|                  |
|      [BACK]      |
+------------------+
```

### 7. Help/Tutorial Overlay
```
+------------------+
|   HOW TO PLAY    |
|                  |
| ← → Aim         |
| SPACE Charge    |
| SPACE Lock Power|
| Release to Fire |
|                  |
| [NEXT TIP] [1/3] |
|     [CLOSE]      |
+------------------+
```

## Mobile-Specific Controls
```
+------------------+
|                  |
|    Swipe Area    | <- Drag to Aim
|                  |
| Hold to Charge   | <- Long Press
| Tap to Lock      | <- Second Tap
|                  |
+------------------+
```

## Special Elements

### Power Meter States
```
[POWER: 0%  ] <- Empty
[POWER: ▮▮▯▯] <- Charging
[POWER: ▮▮▮▮] <- Full
[POWER: ▮▮==] <- Locked
```

### Trajectory Preview
```
     ·  ·         <- Predicted Path
    ·    ·        
   ·      · 
  🎯        ·     <- Impact Point
```

### Block Types
```
🟦 - Standard Block
⬛ - Unbreakable
💣 - Explosive
⭐ - Multiplier
```

### Score Popup
```
+100!      <- Base Score
x2 COMBO!  <- Combo Multiplier
CHAIN! x3  <- Chain Reaction
```

## Notes
1. All screens should maintain 16:9 aspect ratio with safe areas for mobile
2. UI elements scale proportionally with screen size
3. Touch targets minimum 44x44px on mobile
4. High contrast colors for accessibility
5. Consistent padding and alignment across all screens