# Handover System

## Overview

The Handover System is a comprehensive state management framework for the Mamba Kick game. It provides structured session management, roadmap integration, and stage-based progression to ensure consistent game state tracking and transitions.

## Core Components

### 1. Handover.ts

The core singleton class that manages sessions, roadmaps, and stages.

```typescript
// Get the Handover instance
const handover = Handover.getInstance();

// Initialize with a roadmap
handover.initialize(roadmap);

// Start a session
const session = handover.startSession('session_id', sceneInstance);

// Set or advance stages
handover.setStage('StageName');
handover.advanceStage();

// Check if actions are allowed
if (handover.isActionAllowed('action')) {
  // Perform the action
}
```

### 2. HandoverFactory.ts

Utility class for creating roadmaps and stages with predefined configurations.

```typescript
// Create the main game roadmap
const mainRoadmap = HandoverFactory.createGameRoadmap();

// Create a tutorial roadmap
const tutorialRoadmap = HandoverFactory.createTutorialRoadmap();

// Create a custom roadmap
const customRoadmap = HandoverFactory.createCustomRoadmap('CustomRoadmap', [
  { name: 'Stage1', allowedActions: ['action1', 'action2'] },
  { name: 'Stage2', allowedActions: ['action2', 'action3'] }
]);
```

### 3. HandoverManager.ts

Integration layer that connects the Handover system with Phaser scenes.

```typescript
// In a Phaser scene
export class GameScene extends Phaser.Scene {
  handoverManager: HandoverManager;
  
  create() {
    // Initialize Handover
    this.handoverManager = new HandoverManager(this);
    this.handoverManager.initialize();
    this.handoverManager.startSession();
    
    // Set initial stage
    this.handoverManager.setStage('GamePreparation');
    
    // Perform actions
    this.input.on('pointerdown', () => {
      this.handoverManager.performAction('fire', () => {
        // This code only runs if 'fire' is allowed
        this.fireBall();
      });
    });
  }
}
```

## Testing and Debugging

### HandoverTest.ts

Utility class for testing the Handover system.

```typescript
// Run a basic test
HandoverTest.runBasicTest();

// Run a test from a scene
HandoverTest.runFromScene(this);
```

### HandoverDebug.ts

Utility functions for debugging and testing.

```typescript
// Start the example scene
HandoverDebug.startExample(game);

// Add a debug button to the DOM
HandoverDebug.addDebugButton(game);

// Log the current state
HandoverDebug.logState(handoverManager);
```

## Example Usage

See `HandoverExample.ts` in the examples directory for a complete example of using the Handover system in a Phaser scene.

## Documentation

For more detailed documentation, see the `handover_system.md` file in the docs directory.