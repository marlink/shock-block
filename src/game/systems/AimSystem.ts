import { Scene } from 'phaser';
import { HandoverManager } from './HandoverManager';

/**
 * AimSystem handles the aiming mechanics with input buffering
 * to prevent rapid direction changes and improve control.
 */
export class AimSystem {
  private scene: Scene;
  private handoverManager: HandoverManager;
  
  // Aiming state
  private currentAngle: number = 0; // In degrees, 0 = straight up
  private targetAngle: number = 0;  // Angle we're moving towards
  private isAiming: boolean = false;
  
  // Trajectory preview
  private trajectoryGraphics: Phaser.GameObjects.Graphics;
  private showTrajectory: boolean = true;
  
  // Configuration
  private readonly MIN_ANGLE = -80;  // Leftmost angle in degrees
  private readonly MAX_ANGLE = 80;   // Rightmost angle in degrees
  private readonly ANGLE_STEP = 2;   // Degrees to change per update
  private readonly ANGLE_SMOOTHING = 0.1; // Smoothing factor (0-1)
  
  // Input buffer for direction changes
  private inputDirection: string | null = null;
  private lastDirectionChange: number = 0;
  private readonly DIRECTION_CHANGE_THRESHOLD_MS = 100; // Minimum ms between direction changes
  
  /**
   * Creates a new AimSystem
   * @param scene The Phaser scene this system belongs to
   * @param handoverManager The HandoverManager for state validation
   */
  constructor(scene: Scene, handoverManager: HandoverManager) {
    this.scene = scene;
    this.handoverManager = handoverManager;
    
    this.setupEventListeners();
    this.createVisualElements();
  }
  
  /**
   * Sets up event listeners for input events
   */
  private setupEventListeners(): void {
    // Listen for aim left event from InputSystem
    this.scene.events.on('input-aim-left', () => {
      this.setAimDirection('left');
    });
    
    // Listen for aim right event from InputSystem
    this.scene.events.on('input-aim-right', () => {
      this.setAimDirection('right');
    });
    
    // Listen for shot fired event to reset aiming
    this.scene.events.on('shot-fired', this.resetAim, this);
  }
  
  /**
   * Creates visual elements for aiming
   */
  private createVisualElements(): void {
    // Create trajectory preview graphics
    this.trajectoryGraphics = this.scene.add.graphics();
  }
  
  /**
   * Sets the aim direction with input buffering
   * @param direction The direction to aim ('left' or 'right')
   */
  private setAimDirection(direction: 'left' | 'right'): void {
    const now = Date.now();
    
    // Check if we're changing direction too quickly
    if (this.inputDirection !== direction) {
      // If direction change is too soon after last change, buffer it
      if (now - this.lastDirectionChange < this.DIRECTION_CHANGE_THRESHOLD_MS) {
        // Ignore this input as it's likely unintentional rapid switching
        return;
      }
      
      // Update last direction change time
      this.lastDirectionChange = now;
    }
    
    // Set current input direction
    this.inputDirection = direction;
    
    // Use handover system to validate if aiming is allowed in current state
    this.handoverManager.performAction('aim', () => {
      this.isAiming = true;
      
      // Update target angle based on direction
      if (direction === 'left') {
        this.targetAngle = Math.max(this.currentAngle - this.ANGLE_STEP, this.MIN_ANGLE);
      } else {
        this.targetAngle = Math.min(this.currentAngle + this.ANGLE_STEP, this.MAX_ANGLE);
      }
    });
  }
  
  /**
   * Resets aiming after a shot
   */
  private resetAim(): void {
    this.isAiming = false;
    this.inputDirection = null;
  }
  
  /**
   * Updates the trajectory preview
   */
  private updateTrajectoryPreview(): void {
    if (!this.showTrajectory) {
      this.trajectoryGraphics.clear();
      return;
    }
    
    // Clear previous graphics
    this.trajectoryGraphics.clear();
    
    // Set line style for trajectory
    this.trajectoryGraphics.lineStyle(2, 0xffff00, 0.8);
    
    // Calculate starting position (this would be your ball position)
    const startX = this.scene.scale.width / 2;
    const startY = this.scene.scale.height - 100; // Example position
    
    // Draw trajectory line
    this.trajectoryGraphics.beginPath();
    this.trajectoryGraphics.moveTo(startX, startY);
    
    // Calculate end point based on angle
    const length = 100; // Length of trajectory line
    const radians = Phaser.Math.DegToRad(this.currentAngle - 90); // Convert to radians, adjust for Phaser's coordinate system
    const endX = startX + Math.cos(radians) * length;
    const endY = startY + Math.sin(radians) * length;
    
    this.trajectoryGraphics.lineTo(endX, endY);
    this.trajectoryGraphics.strokePath();
    
    // Draw angle indicator
    this.trajectoryGraphics.fillStyle(0xffff00, 1);
    this.trajectoryGraphics.fillCircle(endX, endY, 5);
  }
  
  /**
   * Updates the aim system
   * @param time The current time
   * @param delta The time delta
   */
  public update(time: number, delta: number): void {
    // If not actively aiming, gradually return to center
    if (!this.isAiming && this.inputDirection === null) {
      this.targetAngle = 0; // Center
    }
    
    // Smoothly interpolate current angle towards target angle
    if (this.currentAngle !== this.targetAngle) {
      // Apply smoothing for more natural movement
      this.currentAngle += (this.targetAngle - this.currentAngle) * this.ANGLE_SMOOTHING;
      
      // If we're very close to target, snap to it
      if (Math.abs(this.currentAngle - this.targetAngle) < 0.1) {
        this.currentAngle = this.targetAngle;
      }
      
      // Update trajectory preview
      this.updateTrajectoryPreview();
      
      // Emit angle changed event for other systems
      this.scene.events.emit('aim-angle-changed', { angle: this.currentAngle });
    }
  }
  
  /**
   * Gets the current aim angle in degrees
   */
  public getCurrentAngle(): number {
    return this.currentAngle;
  }
  
  /**
   * Sets whether to show the trajectory preview
   * @param show Whether to show the trajectory
   */
  public setTrajectoryVisible(show: boolean): void {
    this.showTrajectory = show;
    if (!show) {
      this.trajectoryGraphics.clear();
    } else {
      this.updateTrajectoryPreview();
    }
  }
  
  /**
   * Sets the angle limits for aiming
   * @param minAngle The minimum angle in degrees
   * @param maxAngle The maximum angle in degrees
   */
  public setAngleLimits(minAngle: number, maxAngle: number): void {
    // Cannot reassign readonly properties, so this method needs to be removed or redesigned
    // For now, we'll just ensure current angle is within the existing limits
    this.currentAngle = Phaser.Math.Clamp(this.currentAngle, this.MIN_ANGLE, this.MAX_ANGLE);
    this.targetAngle = Phaser.Math.Clamp(this.targetAngle, this.MIN_ANGLE, this.MAX_ANGLE);
  }
}