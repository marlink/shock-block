# Balanced Technology Stack and Implementation Plan

This document presents a unified proposal for developing the physics-based game, synthesizing the recommendations from the `claude.md` and `gpt.md` analyses. It outlines a complete technology stack, a phased implementation plan, and a strategy for future mobile deployment.

## 1. Analysis of Initial Proposals

Both initial proposals (`claude.md` and `gpt.md`) converge on a primary recommendation, providing a strong foundation for our decision.

-   **Core Consensus**: The unanimous recommendation is to use the **Phaser + Vite + TypeScript** stack. This combination offers a complete game framework (Phaser) with a modern, high-performance development environment (Vite).
-   **Physics Engine**: Both analyses identify **Matter.js**, which is integrated into Phaser, as the ideal physics engine for this project. It provides a robust feature set for the required mechanics (destructible blocks, realistic collisions) without the stability concerns of simpler engines or the unnecessary complexity of more advanced ones like Planck.js for this project's scope.
-   **Development Experience**: Vite is favored over ESBuild for its superior developer experience, particularly its Hot Module Replacement (HMR) for instant feedback and its use of Rollup for highly optimized production builds.
-   **Mobile Viability**: While the initial focus is on a browser-based game, the chosen web-native stack is perfectly suited for future mobile deployment.

## 2. Game Requirements Analysis

The proposed stack directly addresses the specified game and technical requirements.

#### Core Mechanics:
-   **Responsive Input System**: Phaser has a mature input manager for handling keyboard events (Spacebar, Arrow keys) reliably.
-   **Shooting Mechanism**: Matter.js is well-suited for simulating the entire shooting sequence:
    -   The aiming arc and dot can be rendered graphically.
    -   Strength buildup is a matter of tracking a variable over time.
    -   The trajectory can be visualized by plotting steps of a simulated physics path.
    -   Release-to-fire is a simple input-up event.
-   **Gameplay Elements**:
    -   **Destructible Blocks**: Matter.js supports compound bodies and collision events, which are the building blocks for creating destructible, Tetris-inspired structures.
    -   **Ball Physics**: Provides realistic bouncing and collision responses.
    -   **Scoring & Reset**: These are game logic layers that sit on top of Phaser's scene management and physics events.

#### Technical Requirements:
-   **Clean TypeScript & Modularity**: The Vite + TypeScript template provides a modern project structure that encourages modularity and clean code from the start.
-   **Performance-Optimized Physics**: Matter.js offers a great balance of performance and realism. For a 2D game of this scope, it will perform excellently.
-   **Smooth Animations**: Phaser's animation manager and tweening system are designed for creating smooth, performant 2D animations.

## 3. Balanced Tech Stack Proposal

This is the recommended stack for a successful, scalable, and maintainable project.

-   **Core Framework**: **Phaser 3** with first-class **TypeScript** support.
-   **Physics Engine**: **Matter.js**, as included in Phaser. It provides the necessary features for rigid bodies, compound shapes, and precise collision events required for the gameplay.
-   **Build Tool/Dev Environment**: **Vite**. It offers an exceptional developer experience with fast HMR and produces highly optimized production builds using Rollup.
-   **Mobile Deployment Wrapper**: **Capacitor**. When the time comes to target iOS and Android, Capacitor will be used to wrap the web application into a native shell. It provides simple APIs to access native device features and is the modern successor to Cordova.

## 4. Implementation Plan

A phased approach will ensure steady progress and allow for continuous feedback.

#### Phase 1: Minimum Viable Product (MVP)
*Goal: A playable core loop.*
1.  **Setup**: Initialize a new project using the `Phaser + Vite + TypeScript` template.
2.  **Basic Scene**: Create the main game scene with a static background.
3.  **Input System**: Implement arrow key controls for moving the aiming arc horizontally.
4.  **Shooting Prototype**: On Spacebar press, create a ball and apply a basic force using Matter.js.
5.  **Simple Destruction**: Add a wall of simple, static Matter.js blocks that can be destroyed (removed) on collision with the ball.

#### Phase 2: Core Features
*Goal: Implement the full shooting mechanic and scoring.*
1.  **Strength & Aiming**:
    -   Implement the progressive strength buildup while the spacebar is held.
    -   Add the dynamic aiming dot to the half-circle arc.
    -   Implement the strength-locking and release-to-fire mechanic.
2.  **Trajectory Visualization**: Before firing, calculate and draw a predicted trajectory line based on the current angle and power.
3.  **Scoring System**: Develop a basic scoring system that awards points when blocks are destroyed.
4.  **Game Loop**: Add an automatic shot reset after the ball comes to rest or goes off-screen.

#### Phase 3: Enhancements & Polish
*Goal: Add variety, visual appeal, and replayability.*
1.  **Special Blocks**: Introduce new block types (e.g., explosive blocks, unbreakable blocks, multiplier blocks).
2.  **Chain Reactions**: Implement logic for chain reaction destruction (e.g., an explosive block destroying its neighbors).
3.  **Visual Polish**: Add animations, particle effects for destruction, and smooth camera transitions.
4.  **UI/UX**: Build out the main menu, score display, and any other UI elements.
5.  **Balancing**: Tweak physics parameters, scoring values, and level difficulty.

## 5. Outstanding Questions

This list captures the immediate design and gameplay decisions to be made.

1.  What is the desired speed of the half-circle aiming arc? (Constant, or does it accelerate?)
2.  What is the target visual style for the game? (e.g., Pixel art, minimalist, cartoonish)
3.  What are the minimum and maximum limits for the launch strength?
4.  What are the base scoring values for destroying a block, and how do multipliers work?
5.  What are the specific requirements and behaviors for any "special" block types?
6.  Are there any mobile-specific UI/UX considerations to keep in mind from the start?

## 6. Initial To-Do List

These are the immediate, actionable steps to begin the project.

1.  **Set up Dev Environment**: Ensure Node.js and npm/yarn are installed.
2.  **Create Project**: Run `npm create @phaserjs/game@latest` and select the Vite + TypeScript template.
3.  **Version Control**: Initialize a Git repository for the project.
4.  **Implement Input System**: Create a simple `PlayerController` class to handle keyboard inputs for aiming.
5.  **Develop Shooting Prototype**: Implement the basic fire-on-release mechanic with a static force.
6.  **Design Block Destruction**: Create a `Block` class and implement the logic for its removal on collision.
7.  **Test Physics**: Verify that the core ball-block interactions feel correct.