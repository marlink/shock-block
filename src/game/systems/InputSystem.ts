import { Scene } from 'phaser';
import { HandoverManager } from './HandoverManager';

/**
 * InputSystem handles all user input with debouncing and validation
 * to prevent common input handling issues.
 */
export class InputSystem {
  private scene: Scene;
  private handoverManager: HandoverManager;
  
  // Input state tracking
  private lastInputTime: Record<string, number> = {};
  private isInputActive: Record<string, boolean> = {};
  private inputBuffer: Record<string, number[]> = {};
  
  // Configuration
  private readonly CLICK_DEBOUNCE_MS = 200; // Debounce period for clicks/taps
  private readonly KEY_DELAY_MS = 100;      // Delay for non-critical keys
  private readonly BUFFER_SIZE = 5;         // Size of direction input buffer
  
  // Disabled keys (can be modified via settings)
  private disabledKeys: Set<string> = new Set();
  
  /**
   * Creates a new InputSystem
   * @param scene The Phaser scene this system belongs to
   * @param handoverManager The HandoverManager for state validation
   */
  constructor(scene: Scene, handoverManager: HandoverManager) {
    this.scene = scene;
    this.handoverManager = handoverManager;
    
    // Initialize input buffers for directional inputs
    this.inputBuffer['left'] = [];
    this.inputBuffer['right'] = [];
    
    this.setupInputHandlers();
  }
  
  /**
   * Sets up all input event handlers
   */
  private setupInputHandlers(): void {
    const keyboard = this.scene.input.keyboard;
    if (!keyboard) return;
    
    // Setup keyboard handlers with debouncing and validation
    keyboard.on('keydown-SPACE', () => {
      this.handleSpacebarPress();
    });
    
    keyboard.on('keyup-SPACE', () => {
      this.handleSpacebarRelease();
    });
    
    keyboard.on('keydown-LEFT', () => {
      this.handleDirectionalInput('left');
    });
    
    keyboard.on('keydown-RIGHT', () => {
      this.handleDirectionalInput('right');
    });
    
    keyboard.on('keydown-ESC', () => {
      this.handleDelayedInput('pause');
    });
    
    keyboard.on('keydown-ENTER', () => {
      this.handleDelayedInput('confirm');
    });
    
    // Mouse/touch input with debouncing
    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.handlePointerDown(pointer);
    });
  }
  
  /**
   * Handles spacebar press with debouncing and state validation
   */
  private handleSpacebarPress(): void {
    const now = Date.now();
    const lastPress = this.lastInputTime['spacebar'] || 0;
    
    // Check if key is disabled in settings
    if (this.disabledKeys.has('spacebar')) return;
    
    // Implement debouncing - ignore rapid presses
    if (now - lastPress < this.CLICK_DEBOUNCE_MS) return;
    
    // Update last press time
    this.lastInputTime['spacebar'] = now;
    
    // Track that spacebar is being held
    this.isInputActive['spacebar'] = true;
    
    // Use handover system to validate if this action is allowed in current state
    this.handoverManager.performAction('charge', () => {
      // Emit event for other systems to respond to
      this.scene.events.emit('input-charge-start');
    });
  }
  
  /**
   * Handles spacebar release with state validation
   */
  private handleSpacebarRelease(): void {
    // Only process if we were tracking an active press
    if (!this.isInputActive['spacebar']) return;
    
    // Mark spacebar as no longer active
    this.isInputActive['spacebar'] = false;
    
    // Use handover system to validate if this action is allowed in current state
    this.handoverManager.performAction('fire', () => {
      // Emit event for other systems to respond to
      this.scene.events.emit('input-fire');
    });
  }
  
  /**
   * Handles directional input with input buffering
   * @param direction The direction ('left' or 'right')
   */
  private handleDirectionalInput(direction: 'left' | 'right'): void {
    const now = Date.now();
    
    // Check if key is disabled in settings
    if (this.disabledKeys.has(direction)) return;
    
    // Add timestamp to buffer
    this.inputBuffer[direction].push(now);
    
    // Keep buffer at fixed size
    if (this.inputBuffer[direction].length > this.BUFFER_SIZE) {
      this.inputBuffer[direction].shift();
    }
    
    // Check for rapid direction changes (filter out if too rapid)
    if (this.isRapidDirectionChange(direction)) {
      return; // Ignore this input as it's likely unintentional
    }
    
    // Use handover system to validate if this action is allowed in current state
    this.handoverManager.performAction('aim', () => {
      // Emit event for other systems to respond to
      this.scene.events.emit(`input-aim-${direction}`);
    });
  }
  
  /**
   * Handles non-critical inputs with delay to prevent accidental presses
   * @param action The action to perform
   */
  private handleDelayedInput(action: string): void {
    const now = Date.now();
    const lastAction = this.lastInputTime[action] || 0;
    
    // Check if key is disabled in settings
    if (this.disabledKeys.has(action)) return;
    
    // Implement debouncing - ignore rapid presses
    if (now - lastAction < this.CLICK_DEBOUNCE_MS) return;
    
    // Update last action time
    this.lastInputTime[action] = now;
    
    // Add delay for non-critical keys
    this.scene.time.delayedCall(this.KEY_DELAY_MS, () => {
      // Use handover system to validate if this action is allowed in current state
      this.handoverManager.performAction(action, () => {
        // Emit event for other systems to respond to
        this.scene.events.emit(`input-${action}`);
      });
    });
  }
  
  /**
   * Handles pointer (mouse/touch) input with debouncing
   * @param pointer The pointer input
   */
  private handlePointerDown(pointer: Phaser.Input.Pointer): void {
    const now = Date.now();
    const lastClick = this.lastInputTime['pointer'] || 0;
    
    // Implement debouncing - ignore rapid clicks
    if (now - lastClick < this.CLICK_DEBOUNCE_MS) return;
    
    // Update last click time
    this.lastInputTime['pointer'] = now;
    
    // Determine action based on pointer position
    // This is a simplified example - actual implementation would check UI elements
    const action = this.getActionFromPointerPosition(pointer);
    
    if (action) {
      // Use handover system to validate if this action is allowed in current state
      this.handoverManager.performAction(action, () => {
        // Emit event for other systems to respond to
        this.scene.events.emit(`input-${action}`);
      });
    }
  }
  
  /**
   * Determines if there are rapid direction changes that should be filtered
   * @param direction The current direction
   * @returns True if this appears to be a rapid unintentional direction change
   */
  private isRapidDirectionChange(direction: 'left' | 'right'): boolean {
    const oppositeDir = direction === 'left' ? 'right' : 'left';
    const currentBuffer = this.inputBuffer[direction];
    const oppositeBuffer = this.inputBuffer[oppositeDir];
    
    // If no opposite inputs, this isn't a direction change
    if (oppositeBuffer.length === 0) return false;
    
    // Get the most recent timestamps
    const latestCurrent = currentBuffer[currentBuffer.length - 1];
    const latestOpposite = oppositeBuffer[oppositeBuffer.length - 1];
    
    // If opposite direction was pressed very recently, this might be unintentional
    return Math.abs(latestCurrent - latestOpposite) < 50; // 50ms threshold
  }
  
  /**
   * Determines what action to take based on pointer position
   * @param pointer The pointer input
   * @returns The action to perform, or null if no action
   */
  private getActionFromPointerPosition(pointer: Phaser.Input.Pointer): string | null {
    // This is a simplified implementation
    // In a real game, you would check if the pointer is over specific UI elements
    
    // Example: Check if pointer is in the bottom half (aim area)
    if (pointer.y > this.scene.scale.height / 2) {
      // Left side = aim left, right side = aim right
      return pointer.x < this.scene.scale.width / 2 ? 'aim-left' : 'aim-right';
    }
    
    // Example: Check if pointer is in the top area (menu/pause)
    if (pointer.y < 50) {
      return 'pause';
    }
    
    // Default action for center area
    return 'fire';
  }
  
  /**
   * Enables or disables specific keys
   * @param key The key to enable/disable
   * @param disabled Whether the key should be disabled
   */
  public setKeyDisabled(key: string, disabled: boolean): void {
    if (disabled) {
      this.disabledKeys.add(key);
    } else {
      this.disabledKeys.delete(key);
    }
  }
  
  /**
   * Updates the input system
   * @param time The current time
   * @param delta The time delta
   */
  public update(time: number, delta: number): void {
    // Check for held spacebar exceeding maximum duration
    if (this.isInputActive['spacebar']) {
      const holdDuration = Date.now() - this.lastInputTime['spacebar'];
      
      // If spacebar has been held too long, force a release event
      // This prevents the issue of holding down spacebar causing unintended behavior
      if (holdDuration > 2000) { // 2 seconds max charge time
        this.isInputActive['spacebar'] = false;
        this.scene.events.emit('input-charge-max');
      }
    }
  }
}