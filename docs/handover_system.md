# Handover System Documentation

## Overview

The Handover System is a comprehensive state management framework designed for the Mamba Kick game. It provides structured session management, roadmap integration, and stage-based progression to ensure consistent game state tracking and transitions.

## Core Capabilities

### 1. Session Management

The Handover System implements clear session control with the following features:

- **Session Creation**: Each game scene can initialize and start a unique session
- **Session Tracking**: Maintains session state data throughout gameplay
- **Session Termination**: Properly ends sessions when scenes are shutdown
- **State Persistence**: Stores and retrieves session-specific data

### 2. Roadmap Integration

The system enforces strict adherence to predefined roadmaps:

- **Roadmap Definition**: Clearly defined progression paths with stages
- **Roadmap Enforcement**: Ensures all actions align with the current roadmap
- **Multiple Roadmap Support**: Different roadmaps for main gameplay and tutorials
- **Custom Roadmap Creation**: Factory methods for creating specialized roadmaps

### 3. Stage-Based Progression

The Handover System implements a structured staging system:

- **Stage Definition**: Each stage has a name, allowed actions, and requirements
- **Stage Transitions**: Clear mechanisms for advancing between stages
- **Action Validation**: Ensures only allowed actions can be performed in each stage
- **Stage Events**: Emits events when stages change for UI updates

## System Architecture

The Handover System consists of the following components:

### 1. Handover Core (Handover.ts)

The core singleton class that manages sessions, roadmaps, and stages. It provides methods for:

- Initializing the system with a roadmap
- Starting and ending sessions
- Managing stage transitions
- Validating allowed actions

### 2. HandoverFactory (HandoverFactory.ts)

A utility class for creating roadmaps and stages with predefined configurations:

- Main game roadmap with stages for menu, gameplay, pausing, and completion
- Tutorial roadmap with more granular stages for learning game mechanics
- Custom roadmap creation for specialized gameplay modes

### 3. HandoverManager (HandoverManager.ts)

An integration layer that connects the Handover system with Phaser scenes:

- Initializes the system for each scene
- Manages session lifecycle with the scene lifecycle
- Provides simplified methods for stage management
- Sets up event listeners for stage transitions

## Usage Examples

### Basic Integration

```typescript
// In a Phaser scene
import { HandoverManager } from '../systems/HandoverManager';

export class GameScene extends Phaser.Scene {
    handoverManager: HandoverManager;
    
    create() {
        // Initialize Handover
        this.handoverManager = new HandoverManager(this);
        this.handoverManager.initialize();
        this.handoverManager.startSession();
        
        // Set initial stage
        this.handoverManager.setStage('GamePreparation');
    }
}
```

### Action Validation

```typescript
// Check if an action is allowed before performing it
this.input.on('pointerdown', () => {
    this.handoverManager.performAction('fire', () => {
        // This code only runs if 'fire' is allowed in the current stage
        this.fireBall();
    });
});
```

### Stage Transitions

```typescript
// Advance to the next stage
if (this.levelComplete) {
    this.handoverManager.advanceStage();
}

// Or set a specific stage
if (this.gamePaused) {
    this.handoverManager.setStage('Paused');
}
```

### Session State Management

```typescript
// Store data in the session
this.handoverManager.setSessionState('score', 1000);

// Retrieve data from the session
const score = this.handoverManager.getSessionState('score');
```

## Implementation Guidelines

1. **Initialize Early**: Set up the Handover system at the beginning of each scene's create method
2. **Validate Actions**: Always use performAction() to ensure actions are allowed in the current stage
3. **Manage Transitions**: Update stages when game state changes (pausing, completing levels, etc.)
4. **Listen for Events**: Set up listeners for 'handover-stage-changed' to update UI elements
5. **End Sessions**: Sessions are automatically ended when scenes are shutdown

## Benefits

- **Consistent State Management**: Prevents invalid state transitions
- **Structured Progression**: Clear roadmap for game flow
- **Separation of Concerns**: Game logic separated from state management
- **Improved Debugging**: Clear visibility into current game state
- **Extensibility**: Easy to add new stages or roadmaps for future features