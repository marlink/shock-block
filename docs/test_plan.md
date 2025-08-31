# Comprehensive Test Plan

## 1. Introduction

This document outlines the test plan for the physics-based game. Its purpose is to validate that all features work as expected, cover all user scenarios, and ensure a high-quality, bug-free experience. The plan is divided into sections based on game features, with clear separation between positive (good path) and negative (bad path) test cases.

## 2. Test Environment

-   **Browser**: Latest stable version of Google Chrome, Mozilla Firefox, and Safari.
-   **Device**: Desktop/Laptop with keyboard.
-   **Build**: Development build running on a local Vite server.

## 3. Test Cases

---

### 3.1 Main Menu & UI

#### Positive Test Cases (Good Path)

| Test Case ID | Scenario | Steps | Expected Result | Actual Result |
| :--- | :--- | :--- | :--- | :--- |
| **UI-P-01** | Start Game | 1. Open the game. <br> 2. Click the "Start Game" button. | The main menu disappears, and the game scene loads. | |
| **UI-P-02** | Score Display | 1. Play the game and destroy a block. | The score display updates with the correct new score. | |
| **UI-P-03** | Game Over Screen | 1. Fail a level or run out of shots. | A "Game Over" or "Level Failed" screen appears with options to restart or return to the menu. | |

#### Negative Test Cases (Bad Path)

| Test Case ID | Scenario | Steps | Expected Result | Actual Result |
| :--- | :--- | :--- | :--- | :--- |
| **UI-N-01** | Invalid UI Interaction | 1. During gameplay, try to click UI elements that should be hidden or inactive. | No action occurs. The game does not crash or enter an invalid state. | |

---

### 3.2 Input System

#### Positive Test Cases (Good Path)

| Test Case ID | Scenario | Steps | Expected Result | Actual Result |
| :--- | :--- | :--- | :--- | :--- |
| **IN-P-01** | Aim Left | 1. Press and hold the Left Arrow key. | The aiming arc moves horizontally to the left. | |
| **IN-P-02** | Aim Right | 1. Press and hold the Right Arrow key. | The aiming arc moves horizontally to the right. | |
| **IN-P-03** | Initiate Shot | 1. Press and hold the Spacebar. | The strength meter begins to fill, and the aiming dot appears. | |
| **IN-P-04** | Lock Strength | 1. While holding the Spacebar, press it again. | The strength meter locks at its current value. The trajectory preview appears. | |
| **IN-P-05** | Fire Ball | 1. After initiating a shot, release the Spacebar. | The ball is fired with the corresponding strength and angle. | |

#### Negative Test Cases (Bad Path)

| Test Case ID | Scenario | Steps | Expected Result | Actual Result |
| :--- | :--- | :--- | :--- | :--- |
| **IN-N-01** | Invalid Key Press | 1. Press keys other than the Arrow keys or Spacebar. | No game action occurs. The game remains in a stable state. | |
| **IN-N-02** | Input During Firing | 1. Fire the ball. <br> 2. While the ball is in motion, press the Arrow keys or Spacebar. | No new actions are initiated. The player cannot aim or fire a new ball until the shot is reset. | |
| **IN-N-03** | Rapid Key Presses | 1. Rapidly press and release the Spacebar and Arrow keys in various combinations. | The game handles the inputs gracefully without crashing or entering a broken state. | |

---

### 3.3 Shooting Mechanism

#### Positive Test Cases (Good Path)

| Test Case ID | Scenario | Steps | Expected Result | Actual Result |
| :--- | :--- | :--- | :--- | :--- |
| **SH-P-01** | Minimum Strength Shot | 1. Tap the Spacebar very quickly to release a shot. | The ball is fired with minimum strength. | |
| **SH-P-02** | Maximum Strength Shot | 1. Hold the Spacebar until the strength meter is full, then release. | The ball is fired with maximum strength. | |
| **SH-P-03** | Locked Strength Shot | 1. Hold Spacebar to build strength. <br> 2. Press Spacebar again to lock. <br> 3. Release Spacebar. | The ball is fired with the exact strength at which it was locked. | |
| **SH-P-04** | Trajectory Preview Accuracy | 1. Lock in a shot with a clear path. | The ball follows the predicted trajectory line very closely. | |

#### Negative Test Cases (Bad Path)

| Test Case ID | Scenario | Steps | Expected Result | Actual Result |
| :--- | :--- | :--- | :--- | :--- |
| **SH-N-01** | Cancel Shot | 1. Hold Spacebar to start a shot. <br> 2. (If a cancel mechanism is implemented) Press the cancel key (e.g., 'Esc'). | The shot is aborted, and the aiming controls are reset without firing a ball. | |

---

### 3.4 Physics and Collisions

#### Positive Test Cases (Good Path)

| Test Case ID | Scenario | Steps | Expected Result | Actual Result |
| :--- | :--- | :--- | :--- | :--- |
| **PH-P-01** | Ball-Block Collision | 1. Fire the ball at a destructible block. | The ball collides with the block, and the block is destroyed/removed. The ball bounces off realistically. | |
| **PH-P-02** | Ball-Wall Collision | 1. Fire the ball at a wall (boundary of the game area). | The ball collides with the wall and bounces off realistically. | |
| **PH-P-03** | Block Destruction | 1. Ensure a block is hit with sufficient force. | The block is removed from the scene. Particle effects are triggered. | |
| **PH-P-04** | Chain Reaction | 1. Hit an explosive block. | The explosive block is destroyed, and it triggers the destruction of adjacent blocks. | |

#### Negative Test Cases (Bad Path)

| Test Case ID | Scenario | Steps | Expected Result | Actual Result |
| :--- | :--- | :--- | :--- | :--- |
| **PH-N-01** | Ball Tunneling | 1. Fire the ball at maximum speed towards a thin block or wall. | The ball does not pass through (tunnel) the object. It collides correctly. | |
| **PH-N-02** | Unbreakable Block Collision | 1. Fire the ball at an unbreakable block. | The ball collides and bounces off, but the block is not destroyed. | |
| **PH-N-03** | No-Force Collision | 1. Let the ball roll gently into a block with minimal force. | The block is not destroyed (assuming a force threshold for destruction). | |

---

### 3.5 Scoring System

#### Positive Test Cases (Good Path)

| Test Case ID | Scenario | Steps | Expected Result | Actual Result |
| :--- | :--- | :--- | :--- | :--- |
| **SC-P-01** | Single Block Score | 1. Destroy a single, standard block. | The score increases by the base value for one block. | |
| **SC-P-02** | Multi-Block Score | 1. Destroy multiple blocks with a single shot. | The score increases by the sum of the values of all destroyed blocks. | |
| **SC-P-03** | Multiplier Score | 1. Destroy a multiplier block or achieve a combo. | The score awarded for subsequent destructions is multiplied accordingly. | |

#### Negative Test Cases (Bad Path)

| Test Case ID | Scenario | Steps | Expected Result | Actual Result |
| :--- | :--- | :--- | :--- | :--- |
| **SC-N-01** | No Score on Bounce | 1. Bounce the ball off an unbreakable block or wall. | The score does not change. | |

---

### 3.6 Game State

#### Positive Test Cases (Good Path)

| Test Case ID | Scenario | Steps | Expected Result | Actual Result |
| :--- | :--- | :--- | :--- | :--- |
| **GS-P-01** | Shot Reset | 1. Fire a shot and wait for the ball to come to a complete stop or go off-screen. | The ball is removed, and the aiming/shooting controls are re-enabled for the next shot. | |
| **GS-P-02** | Level Complete | 1. Destroy all required blocks in a level. | A "Level Complete" screen appears with the final score and an option to proceed. | |
| **GS-P-03** | Pause Game | 1. Press the pause key (e.g., 'P' or 'Esc'). | The game freezes, a pause menu appears. Physics and animations are stopped. | |
| **GS-P-04** | Resume Game | 1. From the pause menu, select "Resume". | The game unpauses, and gameplay continues from the exact moment it was paused. | |

#### Negative Test Cases (Bad Path)

| Test Case ID | Scenario | Steps | Expected Result | Actual Result |
| :--- | :--- | :--- | :--- | :--- |
| **GS-N-01** | Pause During State Transition | 1. Try to pause the game during a level loading screen or a game over animation. | The pause action is either ignored or handled gracefully without crashing the game. | |

---

### 3.7 Performance

#### Positive Test Cases (Good Path)

| Test Case ID | Scenario | Steps | Expected Result | Actual Result |
| :--- | :--- | :--- | :--- | :--- |
| **PE-P-01** | Smooth Frame Rate | 1. Play the game under normal conditions. | The game maintains a consistent and smooth frame rate (e.g., 60 FPS). | |
| **PE-P-02** | Many Particles | 1. Trigger a large chain reaction that generates many particle effects. | The frame rate remains stable, with no significant drops or stuttering. | |
| **PE-P-03** | Many Physics Bodies | 1. Load a level with a large number of destructible blocks. | The game loads and runs smoothly without initial lag or physics-related slowdowns. | |