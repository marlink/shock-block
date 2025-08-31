# API Reference Documentation

## Overview

This document provides comprehensive API documentation for all game systems in Mamba Kick. It includes detailed specifications for implemented systems and planned APIs for missing components.

## Core System APIs

### InputSystem

#### Class: `InputSystem`
Handles user input processing with debouncing and validation.

**Constructor:**
```typescript
constructor(
  scene: Phaser.Scene,
  handoverManager: HandoverManager,
  settings: GameSettings
)
```

**Methods:**

| Method | Parameters | Return Type | Description |
|--------|------------|-------------|-------------|
| `handleInput` | `type: InputType, data?: any` | `boolean` | Processes input with cooldown |
| `canProcessInput` | `type: InputType` | `boolean` | Checks if input can be processed |
| `getInputState` | - | `InputState` | Returns current input state |
| `resetCooldown` | `type: InputType` | `void` | Resets cooldown for specific input |
| `destroy` | - | `void` | Cleans up event listeners |

**Events:**
```typescript
// Emitted events
'input-charge-start': { power: number }
'input-fire': { power: number }
'input-aim-left': { angle: number }
'input-aim-right': { angle: number }
'input-pause': void
'input-restart': void
'input-exit': void
```

**InputState Interface:**
```typescript
interface InputState {
  isCharging: boolean;
  chargePower: number;
  aimAngle: number;
  lastInputTime: number;
  cooldowns: Map<InputType, number>;
}
```

### ShotSystem

#### Class: `ShotSystem`
Manages shot charging, firing, and validation.

**Constructor:**
```typescript
constructor(
  scene: Phaser.Scene,
  handoverManager: HandoverManager
)
```

**Methods:**

| Method | Parameters | Return Type | Description |
|--------|------------|-------------|-------------|
| `startCharging` | - | `boolean` | Begins shot charging sequence |
| `fireShot` | `power: number` | `boolean` | Executes shot with given power |
| `canStartShot` | - | `boolean` | Checks if shot can be started |
| `getShotState` | - | `ShotState` | Returns current shot state |
| `resetShot` | - | `void` | Resets shot system |
| `destroy` | - | `void` | Cleans up shot system |

**ShotState Interface:**
```typescript
interface ShotState {
  isCharging: boolean;
  chargeStartTime: number;
  maxPower: number;
  currentPower: number;
  lastShotTime: number;
}
```

### AimSystem

#### Class: `AimSystem`
Handles aiming mechanics with angle constraints.

**Constructor:**
```typescript
constructor(
  scene: Phaser.Scene,
  handoverManager: HandoverManager
)
```

**Methods:**

| Method | Parameters | Return Type | Description |
|--------|------------|-------------|-------------|
| `aimLeft` | - | `boolean` | Rotates aim left by step |
| `aimRight` | - | `boolean` | Rotates aim right by step |
| `canAim` | - | `boolean` | Checks if aiming is allowed |
| `getAimAngle` | - | `number` | Returns current aim angle |
| `setAimAngle` | `angle: number` | `void` | Sets aim angle directly |
| `destroy` | - | `void` | Cleans up aim system |

**Constants:**
```typescript
const AIM_CONSTANTS = {
  MIN_ANGLE: -80,
  MAX_ANGLE: 80,
  ANGLE_STEP: 5,
  ANGLE_SMOOTHING: 0.15
};
```

## Missing System APIs (To Be Implemented)

### PhysicsManager

#### Class: `PhysicsManager` *[PLANNED]*
Manages physics world and collision detection.

**Constructor:**
```typescript
constructor(
  scene: Phaser.Scene,
  config: PhysicsConfig
)
```

**Planned Methods:**

| Method | Parameters | Return Type | Description |
|--------|------------|-------------|-------------|
| `createWorld` | `config: PhysicsConfig` | `Matter.World` | Creates physics world |
| `addCollider` | `objA: any, objB: any, callback: Function` | `void` | Adds collision detection |
| `calculateForce` | `mass: number, velocity: number` | `number` | Calculates impact force |
| `setVelocityLimits` | `limits: VelocityLimits` | `void` | Sets max velocities |
| `enableCCD` | `enabled: boolean` | `void` | Enables continuous collision |
| `destroy` | - | `void` | Cleans up physics world |

**PhysicsConfig Interface:**
```typescript
interface PhysicsConfig {
  gravity: { x: number; y: number };
  enableSleeping: boolean;
  debug: {
    showBody: boolean;
    showStaticBody: boolean;
    showVelocity: boolean;
  };
  timing: {
    timeScale: number;
    maxSubSteps: number;
    fixedTimestep: number;
  };
}
```

### BlockSystem

#### Class: `BlockSystem` *[PLANNED]*
Manages block creation, destruction, and behavior.

**Constructor:**
```typescript
constructor(
  scene: Phaser.Scene,
  physicsManager: PhysicsManager
)
```

**Planned Methods:**

| Method | Parameters | Return Type | Description |
|--------|------------|-------------|-------------|
| `createBlock` | `config: BlockConfig` | `Block` | Creates new block |
| `destroyBlock` | `id: string, force: number` | `boolean` | Destroys block with force |
| `getBlock` | `id: string` | `Block | null` | Retrieves block by ID |
| `getAllBlocks` | - | `Block[]` | Returns all active blocks |
| `createExplosion` | `position: Vector2D, radius: number` | `void` | Creates explosion effect |
| `clearAllBlocks` | - | `void` | Removes all blocks |
| `destroy` | - | `void` | Cleans up block system |

**BlockConfig Interface:**
```typescript
interface BlockConfig {
  id: string;
  type: BlockType;
  position: Vector2D;
  health: number;
  points: number;
  color: number;
  size: { width: number; height: number };
  velocity?: Vector2D;
  isStatic?: boolean;
}

enum BlockType {
  NORMAL = 'normal',
  MULTIPLIER = 'multiplier', 
  EXPLOSIVE = 'explosive',
  INDESTRUCTIBLE = 'indestructible',
  MOVING = 'moving'
}
```

### LevelService

#### Class: `LevelService` *[PLANNED]*
Manages level loading, progression, and state.

**Constructor:**
```typescript
constructor(
  scene: Phaser.Scene,
  saveService: SaveService
)
```

**Planned Methods:**

| Method | Parameters | Return Type | Description |
|--------|------------|-------------|-------------|
| `loadLevel` | `levelId: string` | `Promise<Level>` | Loads level by ID |
| `getCurrentLevel` | - | `Level | null` | Returns current level |
| `getNextLevel` | - | `string | null` | Returns next level ID |
| `completeLevel` | `score: number` | `Promise<void>` | Marks level complete |
| `getLevelProgress` | - | `LevelProgress` | Returns progress data |
| `restartLevel` | - | `Promise<void>` | Restarts current level |
| `destroy` | - | `void` | Cleans up level service |

**Level Interface:**
```typescript
interface Level {
  id: string;
  name: string;
  difficulty: number;
  parScore: number;
  maxShots: number;
  blocks: BlockConfig[];
  background: string;
  music: string;
  objectives: Objective[];
}

interface LevelProgress {
  completed: boolean;
  bestScore: number;
  stars: number;
  attempts: number;
}
```

### SaveService

#### Class: `SaveService` *[PLANNED]*
Manages game state persistence and loading.

**Constructor:**
```typescript
constructor(
  encryptionKey?: string
)
```

**Planned Methods:**

| Method | Parameters | Return Type | Description |
|--------|------------|-------------|-------------|
| `save` | `data: SaveData` | `Promise<void>` | Saves game state |
| `load` | - | `Promise<SaveData>` | Loads game state |
| `clear` | - | `Promise<void>` | Clears all save data |
| `backup` | - | `Promise<string>` | Creates backup |
| `restore` | `backup: string` | `Promise<void>` | Restores from backup |
| `migrate` | `oldVersion: string` | `Promise<void>` | Migrates old save data |

**SaveData Interface:**
```typescript
interface SaveData {
  version: string;
  playerProgress: {
    currentLevel: number;
    unlockedLevels: number[];
    totalScore: number;
    highScores: Map<string, number>;
    achievements: string[];
  };
  settings: GameSettings;
  statistics: GameStatistics;
  lastSaved: Date;
}
```

### ParticleSystem

#### Class: `ParticleSystem` *[PLANNED]*
Manages visual effects and particle animations.

**Constructor:**
```typescript
constructor(
  scene: Phaser.Scene
)
```

**Planned Methods:**

| Method | Parameters | Return Type | Description |
|--------|------------|-------------|-------------|
| `createExplosion` | `config: ExplosionConfig` | `void` | Creates explosion effect |
| `createDestruction` | `config: DestructionConfig` | `void` | Creates destruction particles |
| `createScoring` | `config: ScoringConfig` | `void` | Creates scoring feedback |
| `createTrail` | `config: TrailConfig` | `void` | Creates trail effect |
| `clearAll` | - | `void` | Clears all particles |
| `pause` | - | `void` | Pauses all effects |
| `resume` | - | `void` | Resumes all effects |
| `destroy` | - | `void` | Cleans up particle system |

**Particle Configuration Interfaces:**
```typescript
interface ExplosionConfig {
  position: Vector2D;
  radius: number;
  intensity: number;
  color: number;
  duration: number;
}

interface DestructionConfig {
  position: Vector2D;
  blockType: BlockType;
  particleCount: number;
  spread: number;
}

interface ScoringConfig {
  position: Vector2D;
  score: number;
  color: number;
  duration: number;
}
```

### ScoringSystem

#### Class: `ScoringSystem` *[PLANNED]*
Manages score calculation and progression tracking.

**Constructor:**
```typescript
constructor(
  scene: Phaser.Scene,
  saveService: SaveService
)
```

**Planned Methods:**

| Method | Parameters | Return Type | Description |
|--------|------------|-------------|-------------|
| `addScore` | `points: number, multiplier?: number` | `void` | Adds points to current score |
| `calculateChainBonus` | `chainLength: number` | `number` | Calculates chain reaction bonus |
| `checkPerfectShot` | `shots: number, par: number` | `boolean` | Checks for perfect shot bonus |
| `getCurrentScore` | - | `number` | Returns current level score |
| `getTotalScore` | - | `number` | Returns total game score |
| `resetLevelScore` | - | `void` | Resets score for current level |
| `saveHighScore` | `level: string, score: number` | `Promise<void>` | Saves high score |

## Utility APIs

### Vector2D

#### Interface: `Vector2D`
2D vector utility for positions and velocities.

```typescript
interface Vector2D {
  x: number;
  y: number;
  
  // Methods (static)
  add(v1: Vector2D, v2: Vector2D): Vector2D;
  subtract(v1: Vector2D, v2: Vector2D): Vector2D;
  multiply(v: Vector2D, scalar: number): Vector2D;
  normalize(v: Vector2D): Vector2D;
  distance(v1: Vector2D, v2: Vector2D): number;
  magnitude(v: Vector2D): number;
}
```

### GameSettings

#### Interface: `GameSettings`
Configuration for game settings and preferences.

```typescript
interface GameSettings {
  input: {
    sensitivity: number;
    deadzone: number;
    keyBindings: Map<string, string>;
  };
  graphics: {
    quality: 'low' | 'medium' | 'high';
    showDebug: boolean;
    particleQuality: number;
  };
  audio: {
    masterVolume: number;
    sfxVolume: number;
    musicVolume: number;
  };
  gameplay: {
    difficulty: 'easy' | 'normal' | 'hard';
    enableHints: boolean;
    showTrajectory: boolean;
  };
}
```

## Event System APIs

### EventEmitter

#### Class: `EventEmitter`
Central event management system.

**Methods:**
```typescript
class EventEmitter {
  on(event: string, callback: Function): void;
  off(event: string, callback: Function): void;
  emit(event: string, data?: any): void;
  once(event: string, callback: Function): void;
  removeAllListeners(event?: string): void;
}
```

### Custom Events

#### Game Events
```typescript
// System Events
'game:started': { level: string }
'game:paused': void
'game:resumed': void
'game:over': { score: number, level: string }
'game:level:loaded': { level: Level }
'game:level:completed': { score: number, stars: number }

// Physics Events
'physics:collision': { objA: any, objB: any, force: number }
'physics:block:destroyed': { block: Block, force: number }
'physics:shot:landed': { position: Vector2D }

// UI Events
'ui:dialog:opened': { dialog: string }
'ui:dialog:closed': { dialog: string }
'ui:settings:changed': { settings: GameSettings }
```

## Configuration APIs

### GameConfig

#### Interface: `GameConfig`
Main game configuration object.

```typescript
interface GameConfig {
  type: typeof Phaser.AUTO;
  width: number;
  height: number;
  parent: string;
  backgroundColor: number;
  physics: {
    default: string;
    matter: PhysicsConfig;
  };
  scene: {
    preload: () => void;
    create: () => void;
    update: (time: number, delta: number) => void;
  };
  scale: {
    mode: Phaser.Scale.ScaleMode;
    autoCenter: Phaser.Scale.CenterType;
  };
}
```

## Error Handling APIs

### GameError

#### Class: `GameError`
Custom error class for game-specific errors.

```typescript
class GameError extends Error {
  code: string;
  level: 'error' | 'warning' | 'info';
  context: any;
  timestamp: Date;
  
  constructor(code: string, message: string, level?: string, context?: any);
}
```

### Error Codes
```typescript
const ERROR_CODES = {
  PHYSICS_INIT_FAILED: 'PHYSICS_INIT_FAILED',
  ASSET_LOAD_FAILED: 'ASSET_LOAD_FAILED',
  SAVE_CORRUPTED: 'SAVE_CORRUPTED',
  LEVEL_NOT_FOUND: 'LEVEL_NOT_FOUND',
  BLOCK_DESTROY_FAILED: 'BLOCK_DESTROY_FAILED',
  PERFORMANCE_DEGRADED: 'PERFORMANCE_DEGRADED'
};
```

## Testing APIs

### TestUtilities

#### Class: `TestUtilities`
Utility methods for testing game systems.

**Methods:**
```typescript
class TestUtilities {
  static createMockScene(): Phaser.Scene;
  static createMockBlock(config?: Partial<BlockConfig>): Block;
  static simulateInput(inputType: InputType, data?: any): void;
  static measureFPS(duration: number): Promise<FPSResult>;
  static createLevelData(blocks: BlockConfig[]): LevelConfig;
}
```

## Version History

### API Version: 1.0.0
- Initial API specification
- Core systems documented
- Missing system APIs defined
- Event system established

### Planned API Changes
- **v1.1.0**: Add multiplayer support
- **v1.2.0**: Add level editor APIs
- **v1.3.0**: Add cloud save support
- **v1.4.0**: Add achievement system

## Usage Examples

### Basic Game Setup
```typescript
import { GameManager } from './GameManager';

const game = new GameManager({
  width: 800,
  height: 600,
  parent: 'game-container'
});

game.start();
```

### Creating a Block
```typescript
const blockSystem = new BlockSystem(scene, physicsManager);
const block = blockSystem.createBlock({
  id: 'block-001',
  type: BlockType.NORMAL,
  position: { x: 100, y: 200 },
  health: 100,
  points: 100,
  color: 0xff0000,
  size: { width: 32, height: 32 }
});
```

### Loading a Level
```typescript
const levelService = new LevelService(scene, saveService);
await levelService.loadLevel('level-1');
```

## Support and Resources

### Documentation Links
- [Phaser 3 Documentation](https://phaser.io/docs/)
- [Matter.js Documentation](https://brm.io/matter-js/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Community Resources
- [Game Development Discord](https://discord.gg/gamedev)
- [Phaser Community Forum](https://phaser.discourse.group/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/phaser-framework)

---

**API Version:** 1.0.0  
**Last Updated:** [Current Date]  
**Next Review:** [Review Date]  
**Maintainer:** Development Team