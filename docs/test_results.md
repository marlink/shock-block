# Test Execution Results

This document records the actual results from executing the test cases defined in `test_plan.md`.

## Execution Summary

-   **Test Date**: YYYY-MM-DD
-   **Build Version**: [e.g., v0.1.0]
-   **Overall Status**: [e.g., Pass / Fail / In Progress]

---

## Detailed Test Results

### 3.1 Main Menu & UI

| Test Case ID | Scenario | Expected Result | Actual Result | Status (Pass/Fail) | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **UI-P-01** | Start Game | Game scene loads. | | | |
| **UI-P-02** | Score Display | Score updates correctly. | | | |
| **UI-P-03** | Game Over Screen | Game Over screen appears. | | | |
| **UI-N-01** | Invalid UI Interaction | No action occurs. | | | |

### 3.2 Input System

| Test Case ID | Scenario | Expected Result | Actual Result | Status (Pass/Fail) | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **IN-P-01** | Aim Left | Arc moves left. | | | |
| **IN-P-02** | Aim Right | Arc moves right. | | | |
| **IN-P-03** | Initiate Shot | Strength meter fills. | | | |
| **IN-P-04** | Lock Strength | Strength locks, trajectory appears. | | | |
| **IN-P-05** | Fire Ball | Ball is fired. | | | |
| **IN-N-01** | Invalid Key Press | No action occurs. | | | |
| **IN-N-02** | Input During Firing | No new actions initiated. | | | |
| **IN-N-03** | Rapid Key Presses | Game remains stable. | | | |

### 3.3 Shooting Mechanism

| Test Case ID | Scenario | Expected Result | Actual Result | Status (Pass/Fail) | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SH-P-01** | Minimum Strength Shot | Ball fired with minimum strength. | | | |
| **SH-P-02** | Maximum Strength Shot | Ball fired with maximum strength. | | | |
| **SH-P-03** | Locked Strength Shot | Ball fired with locked strength. | | | |
| **SH-P-04** | Trajectory Preview Accuracy | Ball follows trajectory line. | | | |
| **SH-N-01** | Cancel Shot | Shot is aborted. | | | |

### 3.4 Physics and Collisions

| Test Case ID | Scenario | Expected Result | Actual Result | Status (Pass/Fail) | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **PH-P-01** | Ball-Block Collision | Block destroyed, ball bounces. | | | |
| **PH-P-02** | Ball-Wall Collision | Ball bounces realistically. | | | |
| **PH-P-03** | Block Destruction | Block removed, particles trigger. | | | |
| **PH-P-04** | Chain Reaction | Adjacent blocks destroyed. | | | |
| **PH-N-01** | Ball Tunneling | Ball does not pass through objects. | | | |
| **PH-N-02** | Unbreakable Block Collision | Block is not destroyed. | | | |
| **PH-N-03** | No-Force Collision | Block is not destroyed. | | | |

### 3.5 Scoring System

| Test Case ID | Scenario | Expected Result | Actual Result | Status (Pass/Fail) | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SC-P-01** | Single Block Score | Score increases by base value. | | | |
| **SC-P-02** | Multi-Block Score | Score increases by sum of values. | | | |
| **SC-P-03** | Multiplier Score | Score is multiplied. | | | |
| **SC-N-01** | No Score on Bounce | Score does not change. | | | |

### 3.6 Game State

| Test Case ID | Scenario | Expected Result | Actual Result | Status (Pass/Fail) | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GS-P-01** | Shot Reset | Controls are re-enabled. | | | |
| **GS-P-02** | Level Complete | "Level Complete" screen appears. | | | |
| **GS-P-03** | Pause Game | Game freezes, menu appears. | | | |
| **GS-P-04** | Resume Game | Gameplay continues correctly. | | | |
| **GS-N-01** | Pause During State Transition | Game handles it gracefully. | | | |

### 3.7 Performance

| Test Case ID | Scenario | Expected Result | Actual Result | Status (Pass/Fail) | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **PE-P-01** | Smooth Frame Rate | Maintains consistent 60 FPS. | | | |
| **PE-P-02** | Many Particles | Frame rate remains stable. | | | |
| **PE-P-03** | Many Physics Bodies | Game runs smoothly. | | | |