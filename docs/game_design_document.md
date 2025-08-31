# Game Design Document (GDD) — “Mamba Kick”

Version: 0.1  
Authors: Project Team  
Target Platforms: Web (desktop browser), iOS/Android (via Capacitor)  
Primary Tech Stack: Phaser 3 (TypeScript), Matter.js, Vite, Capacitor

1. Vision and Goals
- Vision: Create a fast, satisfying 2D physics puzzle-arcade game centered on precision aiming, strength management, and visually impactful destruction.
- Player Fantasy: Master shots by reading the field, optimizing angles and power, and causing chain reactions that rack up high scores.
- Design Pillars:
  - Precision + Clarity: Clear aiming aids and consistent physics.
  - Satisfying Destruction: Visual and audio feedback for impactful collisions.
  - Smooth Loop: Minimal downtime; quick reset and try-again flow.

2. Core Gameplay Summary
- Core Loop:
  1) Aim horizontally along a half-circle arc.
  2) Build and optionally lock shot strength; preview trajectory.
  3) Release to fire; ball collides with blocks, possibly causing chain reactions.
  4) Score points; on stop/out-of-bounds, auto reset for next shot.
- Primary Objective: Clear block formations and maximize score through multipliers and efficient shot usage.
- Failure/End Conditions: Running out of shots or failing to reach level goals.

3. Mechanics Specification
3.1 Input and Controls (Desktop)
- Arrow Keys (Left/Right): Move aiming arc horizontally along the half-circle span.
- Spacebar:
  - Press and hold: Start shot; strength meter increases.
  - Press again (while holding): Lock current strength; show trajectory preview.
  - Release: Fire with current angle/strength (locked or current).

3.2 Aiming System
- Aiming Arc: Half-circle (180° range) along the bottom center. Dot indicates current aim.
- Horizontal Sweep: Configurable speed (constant initially; adjustable later via settings).
- Trajectory Preview: Appears when strength is locked; simulated with current angle/strength and gravity.

3.3 Shot Strength and Launch
- Progressive Buildup: Linear increase from min to max over a fixed duration (e.g., 1.2s).
- Locking: Freezes power for fine angle tuning.
- Release-to-Fire: Applies force/impulse to the ball; caps initial velocity to avoid tunneling.

3.4 Physics and Collisions (Matter.js)
- Ball: Dynamic rigid body, circular collider, “bullet” mode if needed for CCD (via sub-stepping/time-step tuning).
- Blocks:
  - Standard Block: Destructible when collision impulse exceeds threshold.
  - Unbreakable Block: Collision response only; no destruction.
  - Special Blocks (Phase 3+):
    - Explosive: Destroys neighbors in radius on destruction.
    - Multiplier: Increases scoring multiplier on destruction.
- Tuning:
  - Fixed timestep (1/60s); clamp max delta.
  - Iteration counts balanced for stability and performance.
  - Enable sleeping for resting bodies.
  - Use collision categories/filters to reduce unnecessary contact pairs.

3.5 Scoring System
- Base Score: Per-block destruction awards a base value.
- Combo/Chain Bonuses: Destroying multiple blocks within a single shot multiplies score.
- Multipliers: Earned from special multiplier blocks or combo criteria; decays or persists per design.
- UI: Real-time score display with pop-up feedback on destruction.

3.6 Game State and Flow
- States: Main Menu → Gameplay (HUD) → Pause → Level Complete → Game Over.
- Auto Reset: After the ball rests/out-of-bounds, reset to aiming state; decrement remaining shots.
- Progression: Clear all required blocks or meet target score to advance.

3.7 UI/UX Overview
- HUD: Score (left), Level (center), Shots remaining (right).
- Aiming Meter: Horizontal bar and animated dot; color shift with power level.
- Overlays: Pause menu, Level Complete, Game Over.
- Accessibility: High-contrast colors; readable fonts; input remapping in future.

3.8 Visual and Audio Design
- Visual: Clean, readable shapes; distinct block types by color/icon; polished particle effects on destruction.
- Audio:
  - Charge: Rising tone.
  - Lock: Click.
  - Fire: Launch thwack.
  - Collision Variants: Based on impact strength.
  - Destruction: Crunch/explosion.
  - Music: Non-intrusive, upbeat loops with volume controls.

4. Technical Design
4.1 Stack and Tools
- Framework: Phaser 3 with TypeScript.
- Physics: Matter.js (integrated in Phaser).
- Build: Vite (dev: HMR; prod: Rollup bundling).
- Mobile: Capacitor (iOS/Android).
- Lint/Format: ESLint + Prettier.
- Testing: Jest (unit), Playwright (E2E/manual assistance), manual protocol from test_plan.md.

4.2 Project Structure (proposed)
- src/
  - main.ts (Phaser game bootstrap)
  - config/
    - gameConfig.ts
    - physicsConfig.ts
  - scenes/
    - BootScene.ts
    - PreloadScene.ts
    - MainMenuScene.ts
    - GameScene.ts
    - PauseScene.ts
    - UIScene.ts (HUD)
  - systems/
    - InputSystem.ts
    - AimSystem.ts
    - ShotSystem.ts
    - PhysicsSystem.ts
    - BlockSystem.ts
    - ScoringSystem.ts
    - EffectsSystem.ts
  - entities/
    - Ball.ts
    - Block.ts
    - SpecialBlocks/
      - ExplosiveBlock.ts
      - MultiplierBlock.ts
  - services/
    - AudioService.ts
    - LevelService.ts
    - SaveService.ts
    - AnalyticsService.ts (Phase 4+)
  - ui/
    - components/ (HUD elements, meters)
  - assets/
    - images, atlases, audio
  - utils/
    - math, pooling, types
- tests/ (unit/integration utilities)
- vite.config.ts
- capacitor/ (added Phase 4)
- docs/ (optional)

4.3 Coding Standards
- Strict TypeScript configuration; noImplicitAny; exactOptionalPropertyTypes.
- Separation of concerns: Scenes orchestrate; Systems own logic; Entities encapsulate state.
- Event-driven interactions (Phaser events) with typed payloads.
- Object pooling for particles and frequently spawned bodies.

4.4 Physics Configuration
- Gravity: Downward, tuned per feel.
- Solver iterations: start with defaults, increase as needed for stacks.
- Sub-stepping: Enable when max velocity threshold exceeded.
- Collision thresholds: Blocks require minimum impulse for destruction.
- Performance: Keep collision shapes convex and low vertex count.

4.5 Performance Strategy
- Use WebGL renderer; batch sprites; texture atlases.
- Pool bodies/particles; cap debris lifetime and count.
- Enable sleeping; limit concurrent active collisions via filters.
- Profile frequently and add frame budget guards.

4.6 Platform and Responsiveness
- Desktop-first (keyboard); plan touch mapping (drag to aim, press/hold to charge) for mobile.
- Resolution/scaling via Phaser Scale Manager; letterboxing safe area handling.
- 60 FPS target on mid-range devices.

4.7 Build and Deployment
- Development: Vite HMR; tsc --noEmit (or vite-plugin-checker) for live type checks.
- Production: Rollup builds with code splitting, asset hashing; gzip/brotli.
- Mobile: Capacitor add ios/android; copy web build; implement platform icons/splash; app signing.
- CI/CD: Node LTS matrix; cache deps; run lint, type-check, tests; produce web build artifact; optional deploy to static hosting and Capacitor pipelines.

5. Modular Development Roadmap and Milestones
Phase 0 — Project Setup (1-2 days)
- Deliverables:
  - Repo initialized; Vite + Phaser + TypeScript template.
  - ESLint/Prettier; tsc configured.
  - Basic Boot/Preload/MainMenu scenes; placeholder assets.
- Acceptance Criteria:
  - App runs with HMR; scenes transition.
  - Type checks pass.
- Tests Referenced: None (smoke validation).

Phase 1 — MVP Core Loop (3-5 days)
- Features:
  - InputSystem (arrows, spacebar).
  - AimSystem: half-circle arc movement; aiming dot.
  - ShotSystem: charge, release-to-fire; ball spawn; basic collision response.
  - BlockSystem: simple destructible blocks; removal on impact threshold.
  - HUD: score, level label, shots remaining.
- Acceptance Criteria:
  - Player can aim, charge, fire; destroy blocks; shot resets automatically.
  - 60 FPS on desktop with small block layout.
- Tests Referenced:
  - UI-P-01/02, IN-P-01..05, SH-P-01/02, PH-P-01, GS-P-01.
- Definition of Done:
  - Manual test results captured in test_results.md.
  - Code reviewed; lint/type-check clean.

Phase 2 — Core Mechanics Complete (4-7 days)
- Features:
  - Strength lock; trajectory preview.
  - ScoringSystem with base values and per-shot combo.
  - Expanded block layouts; walls; improved collision tuning.
- Acceptance Criteria:
  - Locked power persists through aim changes; preview matches actual trajectory within tolerance.
  - Scores apply correctly (single/multi/combos); no score on bounces only.
- Tests Referenced:
  - IN-P-04, SH-P-03/04, SC-P-01..03, SC-N-01, PH-N-03, GS-P-02 (if level goal added).
- Definition of Done:
  - Results recorded in test_results.md; updated test_plan.md if scenarios change.

Phase 3 — Enhancements and Polish (5-8 days)
- Features:
  - Special blocks: unbreakable, multiplier, explosive; chain reactions.
  - Particles and destruction VFX; sound pass.
  - Pause/Resume; Game Over; Level Complete flows.
  - Performance optimization pass (pooling, sleeping).
- Acceptance Criteria:
  - Chain reactions behave deterministically; performance remains smooth under heavy effects.
  - State screens function and are reachable through gameplay.
- Tests Referenced:
  - PH-P-03/04, PH-N-01/02, GS-P-03/04, UI-P-03, PE-P-01..03.
- Definition of Done:
  - Results captured; performance metrics noted (FPS baseline during effects).

Phase 4 — Mobile Readiness and Packaging (4-7 days)
- Features:
  - Touch input mapping (drag aim; long-press strength; second tap to lock).
  - Responsive UI scaling; safe area handling.
  - Capacitor integration; platform icons/splash.
- Acceptance Criteria:
  - Functional gameplay on iOS/Android test devices at target FPS.
- Tests Referenced:
  - Repeat critical test_plan flows on devices; document differences/adjustments.
- Definition of Done:
  - Mobile build artifacts; installation verified; basic store readiness checklist drafted.

Phase 5 — Productionization (optional, 3-5 days)
- Features:
  - Analytics hooks; basic error reporting.
  - Save/Load (local storage) for best scores/settings.
  - Final balancing and visual polish.
- Acceptance Criteria:
  - Stable gameplay; no critical issues; test coverage on core logic.
- Tests Referenced:
  - Regression pass across all sections; add unit tests for scoring and trajectory.

6. Testing Protocols
6.1 Manual Testing
- Source of Truth: test_plan.md (organized by feature with positive/negative cases).
- Recording: test_results.md (date, build, outcomes).
- Cadence: At least once per phase completion; smoke tests nightly during active development.

6.2 Automated Testing
- Unit Tests (Jest):
  - Scoring rules, combo/multiplier application.
  - Trajectory math utilities (predictive path segmentation).
  - Config-bound logic (clamping, thresholds).
- Integration/Playwright:
  - Boot to gameplay smoke test (HUD visible, input events emit).
  - Deterministic physics scenes with seeded setups (within tolerance).
- Performance Checks:
  - Scripted scenarios to measure FPS with many particles/blocks; thresholds documented.

6.3 Acceptance Criteria Mapping
- Each milestone references specific cases from test_plan.md (e.g., SH-P-04 trajectory accuracy).
- All mapped cases must pass before milestone completion.
- Failures must be logged in test_results.md with reproduction steps.

7. Technical Requirements
- TypeScript strictness enforced; no implicit anys.
- Fixed physics timestep; sub-stepping guard for high-velocity shots.
- Collision thresholds for destruction; no tunneling at max power.
- WebGL renderer; atlases; pooled particles; sleeping bodies.
- Build sizes optimized with tree-shaking and asset compression.
- Touch + keyboard input supported by Phase 4.

8. Risks and Mitigations
- Physics Tunneling at High Speed:
  - Mitigate via sub-stepping, velocity caps, “bullet-like” stepping, thicker colliders.
- Performance Degradation with Many Effects:
  - Pool particles; cap debris counts; use batched shaders/atlases.
- Input Complexity (lock/preview cadence):
  - Tutorial tooltips; clear sound/visual cues; input state machine validation.
- Mobile Variability:
  - Early device testing; scale modes; asset resolution strategy.

9. Schedule and Resourcing (estimate)
- Phase 0: 1-2 days
- Phase 1: 3-5 days
- Phase 2: 4-7 days
- Phase 3: 5-8 days
- Phase 4: 4-7 days
- Phase 5: 3-5 days (optional)
Note: Ranges reflect parallel tasking and iteration; adjust based on team velocity.

10. Asset Plan
- Visual: Simple vector-like sprites, later unified via atlas; color-coded block types.
- Audio: Short UI SFX set; collision/destruction layers; one or two background loops.
- Licensing: Use CC0/CC-BY placeholders during dev; replace with licensed final assets.

11. Analytics and Telemetry (optional Phase 5)
- Events: Level start/complete, shot fired, blocks destroyed, chain reactions, session length.
- Privacy: Comply with platform requirements; opt-out toggle.

12. Release and Deployment
- Web: Static hosting (e.g., Netlify/Vercel/GitHub Pages); CI pipeline publishes on tagged releases.
- Mobile: Capacitor builds; test via TestFlight/closed tracks; store metadata; signing and upload documented.

Appendix A — References to Project Docs
- Design consensus and stack: balanced_proposal.md
- Manual test cases: test_plan.md
- Execution records: test_results.md

Appendix B — Acceptance Checklist per Phase (abbrev)
- Phase 1:
  - Pass: UI-P-01/02, IN-P-01..05, SH-P-01/02, PH-P-01, GS-P-01
- Phase 2:
  - Pass: IN-P-04, SH-P-03/04, SC-P-01..03, SC-N-01, PH-N-03
- Phase 3:
  - Pass: PH-P-03/04, PH-N-01/02, GS-P-03/04, UI-P-03, PE-P-01..03
- Phase 4:
  - Mobile passes of core flows with acceptable FPS