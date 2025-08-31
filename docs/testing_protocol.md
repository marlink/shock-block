# Testing Protocol Documentation

## Overview

This document provides comprehensive testing procedures for validating all game systems, including the missing test cases identified in the risk assessment. It covers unit tests, integration tests, performance tests, and user acceptance testing.

## Test Case Matrix

### Input System Tests (✅ Complete)
| Test ID | Description | Status | Priority |
|---------|-------------|--------|----------|
| IN-P-01 | Fast multiple clicks debounced | ✅ Complete | High |
| IN-P-02 | Spacebar hold/release mechanics | ✅ Complete | High |
| IN-P-03 | Rapid key alternation handling | ✅ Complete | High |
| IN-P-04 | Accidental key press prevention | ✅ Complete | High |
| IN-P-05 | Settings key disabling | ✅ Complete | Medium |

### Physics System Tests (❌ Missing)
| Test ID | Description | Status | Priority | Test File |
|---------|-------------|--------|----------|-----------|
| PH-P-01 | Collision detection accuracy | ❌ Missing | Critical | `tests/physics/collision.test.ts` |
| PH-P-02 | Force calculation for destruction | ❌ Missing | Critical | `tests/physics/force.test.ts` |
| PH-P-03 | Object velocity limits | ❌ Missing | High | `tests/physics/velocity.test.ts` |
| PH-P-04 | Sub-stepping and CCD effectiveness | ❌ Missing | High | `tests/physics/substepping.test.ts` |

### Scoring System Tests (❌ Missing)
| Test ID | Description | Status | Priority | Test File |
|---------|-------------|--------|----------|-----------|
| SC-P-01 | Point calculation accuracy | ❌ Missing | High | `tests/scoring/points.test.ts` |
| SC-P-02 | Multiplier mechanics | ❌ Missing | High | `tests/scoring/multipliers.test.ts` |
| SC-P-03 | Score persistence | ❌ Missing | Medium | `tests/scoring/persistence.test.ts` |

### Game State Tests (❌ Missing)
| Test ID | Description | Status | Priority | Test File |
|---------|-------------|--------|----------|-----------|
| GS-P-01 | Level loading/unloading | ❌ Missing | High | `tests/state/level.test.ts` |
| GS-P-02 | Pause/resume functionality | ❌ Missing | Medium | `tests/state/pause.test.ts` |
| GS-P-03 | Game over conditions | ❌ Missing | High | `tests/state/gameover.test.ts` |
| GS-P-04 | State persistence | ❌ Missing | Medium | `tests/state/persistence.test.ts` |

### Performance Tests (❌ Missing)
| Test ID | Description | Status | Priority | Test File |
|---------|-------------|--------|----------|-----------|
| PE-P-01 | 60 FPS maintenance | ❌ Missing | Critical | `tests/performance/fps.test.ts` |
| PE-P-02 | Memory usage optimization | ❌ Missing | High | `tests/performance/memory.test.ts` |
| PE-P-03 | Asset loading efficiency | ❌ Missing | Medium | `tests/performance/assets.test.ts` |

## Physics System Testing Protocol

### PH-P-01: Collision Detection Accuracy

#### Test Setup
```typescript
describe('Collision Detection Accuracy', () => {
  let scene: Phaser.Scene;
  let physicsManager: PhysicsManager;
  let blockSystem: BlockSystem;
  
  beforeEach(() => {
    // Initialize test environment
    scene = createTestScene();
    physicsManager = new PhysicsManager(scene, TEST_PHYSICS_CONFIG);
    blockSystem = new BlockSystem(scene);
  });

  test('Detects collision between shot and block', () => {
    // Arrange: Create block at fixed position
    const block = blockSystem.createBlock({
      id: 'test-block',
      type: BlockType.NORMAL,
      position: { x: 100, y: 100 },
      health: 100,
      points: 100,
      color: 0xff0000,
      size: { width: 32, height: 32 }
    });
    
    // Act: Fire shot directly at block
    const shot = fireShotAtPosition(100, 100);
    
    // Assert: Collision detected within 1 frame
    expect(collisionDetected(shot, block)).toBe(true);
  });

  test('No collision when objects are separated', () => {
    // Arrange: Create block and shot with gap
    const block = blockSystem.createBlock({
      id: 'test-block',
      type: BlockType.NORMAL,
      position: { x: 100, y: 100 },
      health: 100,
      points: 100,
      color: 0xff0000,
      size: { width: 32, height: 32 }
    });
    
    // Act: Fire shot at distance
    const shot = fireShotAtPosition(200, 200);
    
    // Assert: No collision detected
    expect(collisionDetected(shot, block)).toBe(false);
  });
});
```

#### Acceptance Criteria
- [ ] Collision detected within 16.67ms (1 frame at 60 FPS)
- [ ] No false positives for separated objects
- [ ] Edge cases handled (corner collisions, grazing contacts)
- [ ] Performance impact < 1ms per collision check

### PH-P-02: Force Calculation for Destruction

#### Test Cases

```typescript
describe('Force Calculation for Destruction', () => {
  test('Normal block destroyed at threshold force', () => {
    const block = createBlock(BlockType.NORMAL);
    const result = blockSystem.destroyBlock(block.id, 50); // Threshold
    expect(result).toBe(true);
  });

  test('Multiplier block requires higher force', () => {
    const block = createBlock(BlockType.MULTIPLIER);
    const result = blockSystem.destroyBlock(block.id, 50); // Below threshold
    expect(result).toBe(false);
  });

  test('Indestructible block never destroyed', () => {
    const block = createBlock(BlockType.INDESTRUCTIBLE);
    const result = blockSystem.destroyBlock(block.id, 1000);
    expect(result).toBe(false);
  });

  test('Force scales correctly with velocity', () => {
    const shot = createShot(100); // 100 pixels/second
    const force = physicsManager.calculateForce(shot);
    expect(force).toBeCloseTo(50, 1); // Expected force calculation
  });
});
```

#### Force Calculation Formula
```typescript
function calculateForce(mass: number, velocity: number): number {
  return 0.5 * mass * Math.pow(velocity, 2);
}
```

### PH-P-03: Object Velocity Limits

#### Test Configuration
```typescript
const VELOCITY_LIMITS = {
  maxShotSpeed: 1000, // pixels/second
  minShotSpeed: 50,   // pixels/second
  maxBlockSpeed: 200, // pixels/second (for explosive blocks)
};

describe('Object Velocity Limits', () => {
  test('Shot speed capped at maximum', () => {
    const shot = createShot(1500); // Exceeds limit
    expect(shot.body.velocity.length()).toBeLessThanOrEqual(1000);
  });

  test('Minimum velocity enforced', () => {
    const shot = createShot(10); // Below minimum
    expect(shot.body.velocity.length()).toBeGreaterThanOrEqual(50);
  });

  test('Explosive block velocity within limits', () => {
    const block = createBlock(BlockType.EXPLOSIVE);
    blockSystem.explodeBlock(block.id);
    expect(block.body.velocity.length()).toBeLessThanOrEqual(200);
  });
});
```

### PH-P-04: Sub-stepping and CCD Effectiveness

#### Test Setup
```typescript
describe('Sub-stepping and CCD', () => {
  test('High-velocity objects detected with CCD', () => {
    const fastShot = createShot(2000);
    const thinBlock = createThinBlock(1); // 1 pixel thick
    
    // Fast object should not tunnel through thin block
    expect(tunnelingOccurred(fastShot, thinBlock)).toBe(false);
  });

  test('Sub-stepping maintains accuracy', () => {
    const startTime = performance.now();
    
    // Simulate 1000 physics steps
    for (let i = 0; i < 1000; i++) {
      physicsManager.update();
    }
    
    const endTime = performance.now();
    const avgTime = (endTime - startTime) / 1000;
    
    expect(avgTime).toBeLessThan(1); // < 1ms per step
  });
});
```

## Scoring System Testing Protocol

### SC-P-01: Point Calculation Accuracy

#### Test Matrix

| Block Type | Base Points | Multiplier | Expected Score |
|------------|-------------|------------|----------------|
| NORMAL     | 100         | 1.0        | 100            |
| MULTIPLIER | 250         | 1.0        | 250            |
| EXPLOSIVE  | 500         | 1.0        | 500            |
| CHAIN 3x   | 100         | 1.5        | 450            |

#### Test Implementation
```typescript
describe('Point Calculation Accuracy', () => {
  const scoringSystem = new ScoringSystem(scene, saveService);

  test.each([
    [BlockType.NORMAL, 100, 1.0, 100],
    [BlockType.MULTIPLIER, 250, 1.0, 250],
    [BlockType.EXPLOSIVE, 500, 1.0, 500],
    [BlockType.NORMAL, 100, 1.5, 150],
    [BlockType.NORMAL, 100, 2.0, 200],
  ])('calculates %s block score correctly', (type, base, multiplier, expected) => {
    const score = scoringSystem.calculateScore(type, base, multiplier);
    expect(score).toBe(expected);
  });
});
```

### SC-P-02: Multiplier Mechanics

#### Test Cases

```typescript
describe('Multiplier Mechanics', () => {
  test('Chain reaction increases multiplier', () => {
    scoringSystem.startChain();
    
    // Destroy 3 blocks in quick succession
    scoringSystem.addDestroyedBlock(BlockType.NORMAL);
    scoringSystem.addDestroyedBlock(BlockType.NORMAL);
    scoringSystem.addDestroyedBlock(BlockType.NORMAL);
    
    expect(scoringSystem.getCurrentMultiplier()).toBe(1.5);
  });

  test('Multiplier resets after delay', async () => {
    scoringSystem.startChain();
    scoringSystem.addDestroyedBlock(BlockType.NORMAL);
    
    // Wait longer than chain timeout
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    expect(scoringSystem.getCurrentMultiplier()).toBe(1.0);
  });

  test('Perfect shot bonus applied', () => {
    const isPerfect = scoringSystem.checkPerfectShot(100, 100, 100);
    expect(isPerfect).toBe(true);
    expect(scoringSystem.getBonusScore()).toBe(1000);
  });
});
```

### SC-P-03: Score Persistence

#### Test Implementation
```typescript
describe('Score Persistence', () => {
  test('Score saved to localStorage', async () => {
    const score = 5000;
    await scoringSystem.saveScore('level1', score);
    
    const saved = await saveService.load();
    expect(saved?.highScores.get('level1')).toBe(5000);
  });

  test('Score persists across sessions', async () => {
    await scoringSystem.saveScore('level1', 7500);
    
    // Simulate new session
    const newScoringSystem = new ScoringSystem(scene, saveService);
    const loaded = await newScoringSystem.loadHighScore('level1');
    
    expect(loaded).toBe(7500);
  });

  test('Invalid score data handled gracefully', async () => {
    // Corrupt save data
    localStorage.setItem('mamba_kick_save', 'invalid json');
    
    const score = await scoringSystem.loadHighScore('level1');
    expect(score).toBe(0); // Default fallback
  });
});
```

## Game State Testing Protocol

### GS-P-01: Level Loading/Unloading

#### Test Scenarios

```typescript
describe('Level Loading/Unloading', () => {
  let levelService: LevelService;
  
  beforeEach(() => {
    levelService = new LevelService(scene, saveService);
  });

  test('Level loads with correct block configuration', async () => {
    const levelData = createTestLevelData();
    await levelService.loadLevel(levelData);
    
    const blocks = levelService.getCurrentBlocks();
    expect(blocks.length).toBe(levelData.blocks.length);
    expect(blocks[0].type).toBe(levelData.blocks[0].type);
  });

  test('Level unloads cleanly', async () => {
    await levelService.loadLevel(createTestLevelData());
    await levelService.unloadLevel();
    
    expect(levelService.getCurrentBlocks().length).toBe(0);
    expect(levelService.getCurrentLevel()).toBeNull();
  });

  test('Invalid level data handled gracefully', async () => {
    const invalidLevel = { invalid: 'data' };
    
    await expect(levelService.loadLevel(invalidLevel))
      .rejects.toThrow('Invalid level data');
  });
});
```

### GS-P-02: Pause/Resume Functionality

#### Test Implementation
```typescript
describe('Pause/Resume Functionality', () => {
  test('Game pauses correctly', () => {
    gameState.pause();
    
    expect(gameState.isPaused()).toBe(true);
    expect(physicsManager.isPaused()).toBe(true);
    expect(inputSystem.isPaused()).toBe(true);
  });

  test('Game resumes correctly', () => {
    gameState.pause();
    gameState.resume();
    
    expect(gameState.isPaused()).toBe(false);
    expect(physicsManager.isPaused()).toBe(false);
    expect(inputSystem.isPaused()).toBe(false);
  });

  test('Score calculation paused during pause', () => {
    gameState.pause();
    
    const initialScore = scoringSystem.getCurrentScore();
    scoringSystem.addDestroyedBlock(BlockType.NORMAL);
    
    expect(scoringSystem.getCurrentScore()).toBe(initialScore);
  });
});
```

## Performance Testing Protocol

### PE-P-01: 60 FPS Maintenance

#### Test Configuration
```typescript
describe('60 FPS Maintenance', () => {
  const PERFORMANCE_THRESHOLDS = {
    targetFPS: 60,
    minFPS: 55,
    maxFrameTime: 16.67, // ms
    memoryLimit: 100, // MB
  };

  test('Maintains 60 FPS with 100 blocks', () => {
    // Setup: Create 100 blocks
    for (let i = 0; i < 100; i++) {
      blockSystem.createBlock(generateRandomBlock());
    }
    
    // Measure: 60 seconds of gameplay
    const measurements = measureFPS(60);
    
    expect(measurements.averageFPS).toBeGreaterThanOrEqual(55);
    expect(measurements.minFPS).toBeGreaterThanOrEqual(50);
    expect(measurements.maxFrameTime).toBeLessThanOrEqual(20);
  });

  test('Memory usage within limits', () => {
    const initialMemory = performance.memory.usedJSHeapSize;
    
    // Run intensive operations
    runIntensiveGameplay(30);
    
    const finalMemory = performance.memory.usedJSHeapSize;
    const memoryIncrease = (finalMemory - initialMemory) / 1024 / 1024;
    
    expect(memoryIncrease).toBeLessThan(50); // MB increase
  });
});
```

### PE-P-02: Memory Usage Optimization

#### Memory Leak Detection
```typescript
describe('Memory Usage Optimization', () => {
  test('No memory leaks in level transitions', () => {
    const initialMemory = performance.memory.usedJSHeapSize;
    
    // Load and unload 50 levels
    for (let i = 0; i < 50; i++) {
      levelService.loadLevel(createTestLevelData());
      levelService.unloadLevel();
    }
    
    // Force garbage collection if available
    if (global.gc) global.gc();
    
    const finalMemory = performance.memory.usedJSHeapSize;
    const memoryIncrease = (finalMemory - initialMemory) / 1024 / 1024;
    
    expect(memoryIncrease).toBeLessThan(10); // Acceptable increase
  });

  test('Particle system cleanup', () => {
    const particleCount = 1000;
    
    // Create and destroy many particles
    for (let i = 0; i < particleCount; i++) {
      particleSystem.createExplosion(100, 100);
    }
    
    particleSystem.destroy();
    
    expect(particleSystem.getActiveParticles()).toBe(0);
  });
});
```

### PE-P-03: Asset Loading Efficiency

#### Test Implementation
```typescript
describe('Asset Loading Efficiency', () => {
  test('Assets load within acceptable time', async () => {
    const startTime = performance.now();
    
    await assetLoader.loadLevelAssets('test_level');
    
    const loadTime = performance.now() - startTime;
    expect(loadTime).toBeLessThan(1000); // 1 second max
  });

  test('Asset caching prevents duplicate loads', async () => {
    const loadSpy = jest.spyOn(assetLoader, 'loadTexture');
    
    await assetLoader.loadTexture('block_red');
    await assetLoader.loadTexture('block_red'); // Second load
    
    expect(loadSpy).toHaveBeenCalledTimes(1);
  });

  test('Memory usage scales appropriately', () => {
    const textures = ['block_red', 'block_blue', 'block_green'];
    const initialMemory = performance.memory.usedJSHeapSize;
    
    textures.forEach(texture => {
      assetLoader.loadTexture(texture);
    });
    
    const finalMemory = performance.memory.usedJSHeapSize;
    const memoryPerTexture = (finalMemory - initialMemory) / textures.length;
    
    expect(memoryPerTexture).toBeLessThan(1024 * 1024); // 1MB per texture
  });
});
```

## Test Environment Setup

### Required Dependencies

```json
{
  "devDependencies": {
    "jest": "^29.0.0",
    "@types/jest": "^29.0.0",
    "phaser3-jest": "^1.0.0",
    "puppeteer": "^19.0.0",
    "performance-observer": "^1.0.0"
  }
}
```

### Test Configuration Files

#### `jest.config.js`
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  collectCoverageFrom: [
    'src/game/systems/**/*.ts',
    'src/game/services/**/*.ts',
    '!src/game/systems/**/*.d.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

#### `tests/setup.ts`
```typescript
import 'jest-canvas-mock';
import * as Phaser from 'phaser';

// Mock Phaser for testing
global.Phaser = Phaser;

// Performance mock
global.performance = {
  ...global.performance,
  memory: {
    usedJSHeapSize: 0,
    totalJSHeapSize: 0,
    jsHeapSizeLimit: 0
  }
};
```

## Continuous Integration

### GitHub Actions Workflow

```yaml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:ci
      - run: npm run test:performance
      - uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results/
```

## Test Execution Commands

### Development Commands
```bash
# Run all tests
npm test

# Run specific test suite
npm test -- tests/physics/

# Run with coverage
npm run test:coverage

# Run performance tests
npm run test:performance

# Run in watch mode
npm run test:watch
```

## Reporting and Documentation

### Test Report Format

```json
{
  "summary": {
    "totalTests": 150,
    "passed": 145,
    "failed": 3,
    "skipped": 2,
    "coverage": 85.5
  },
  "performance": {
    "averageFPS": 58.7,
    "memoryUsage": "45.2MB",
    "loadTime": "850ms"
  },
  "failedTests": [
    {
      "test": "PH-P-02: Force calculation",
      "error": "Expected 50, received 47.3",
      "priority": "High"
    }
  ]
}
```

## Maintenance and Updates

### Test Review Schedule
- **Weekly:** Review new test failures
- **Monthly:** Update performance baselines
- **Quarterly:** Review and expand test coverage
- **Pre-release:** Full regression testing

### Test Data Management
- **Test fixtures:** Stored in `tests/fixtures/`
- **Mock data:** Generated for each test run
- **Performance baselines:** Updated quarterly
- **Asset cache:** Cleaned after each test run

## Conclusion

This testing protocol ensures comprehensive validation of all game systems. By following these procedures, we can identify issues early, maintain performance standards, and ensure a high-quality player experience. Regular execution of these tests will prevent regression and maintain code quality throughout development.