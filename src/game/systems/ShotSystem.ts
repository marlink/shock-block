import { Scene } from 'phaser';
import { HandoverManager } from './HandoverManager';

/**
 * Manages shot charging and firing mechanics
 */
export class ShotSystem {
  private scene: Scene;
  private handoverManager: HandoverManager;
  
  // Shot state tracking
  private isCharging: boolean = false;
  private chargeStartTime: number = 0;
  private currentCharge: number = 0;
  private inCooldown: boolean = false;
  
  // Configuration
  private readonly MAX_CHARGE_DURATION = 2000; // 2 seconds
  private readonly MIN_POWER = 0.1;
  private readonly MAX_POWER = 1.0;
  private readonly POWER_RATE = 0.0005; // Power increase per ms
  
  // Visual feedback elements
  private chargeMeter: Phaser.GameObjects.Graphics;
  private chargeText: Phaser.GameObjects.Text;
  
  /**
   * Creates a new ShotSystem
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
    // Listen for charge and fire events from InputSystem
    this.scene.events.on('input-charge-start', this.startCharging, this);
    
    // Listen for fire event from InputSystem (on spacebar release)
    this.scene.events.on('input-fire', this.releaseShot, this);
    
    // Listen for max charge event from InputSystem
    this.scene.events.on('input-charge-max', this.handleMaxCharge, this);
  }
  
  /**
   * Creates visual elements for charge feedback
   */
  private createVisualElements(): void {
    // Create charge meter graphics
    this.chargeMeter = this.scene.add.graphics();
    
    // Create charge text
    this.chargeText = this.scene.add.text(
      this.scene.scale.width / 2,
      this.scene.scale.height - 50,
      '',
      { fontSize: '16px', color: '#ffffff' }
    );
    this.chargeText.setOrigin(0.5);
    
    // Initially hide visual elements
    this.hideVisualElements();
  }
  
  /**
   * Starts the charging process
   */
  private startCharging(): void {
    // Only start if we can
    if (!this.canStartShot()) return;
    
    this.isCharging = true;
    this.chargeStartTime = Date.now();
    this.currentCharge = this.MIN_POWER;
    
    // Show visual elements
    this.showVisualElements();
  }
  
  /**
   * Handles firing the shot with current charge level
   */
  private releaseShot(): void {
    // Only proceed if charging
    if (!this.isCharging) return;
    
    // Calculate final power based on charge duration
    const finalPower = this.currentCharge;
    
    // Reset charging state
    this.isCharging = false;
    this.hideVisualElements();
    
    // Apply cooldown
    this.inCooldown = true;
    this.scene.time.delayedCall(200, () => {
      this.inCooldown = false;
    });
    
    // Use handover system to validate if firing is allowed in current state
    this.handoverManager.performAction('fire', () => {
      // Emit event with power level for physics system to handle
      this.scene.events.emit('shot-fired', { power: finalPower });
      
      console.log(`Shot fired with power: ${finalPower.toFixed(2)}`);
    });
  }
  
  /**
   * Handles reaching maximum charge duration
   */
  private handleMaxCharge(): void {
    if (!this.isCharging) return;
    
    // Set to maximum power
    this.currentCharge = this.MAX_CHARGE_POWER;
    
    // Auto-fire at max charge
    this.fire();
  }
  
  /**
   * Shows the visual charge elements
   */
  private showVisualElements(): void {
    this.chargeMeter.setVisible(true);
    this.chargeText.setVisible(true);
  }
  
  /**
   * Hides the visual charge elements
   */
  private hideVisualElements(): void {
    this.chargeMeter.setVisible(false);
    this.chargeText.setVisible(false);
  }
  
  /**
   * Updates the charge meter visual
   */
  private updateChargeMeter(): void {
    // Clear previous graphics
    this.chargeMeter.clear();
    
    // Calculate meter dimensions
    const meterWidth = 200;
    const meterHeight = 20;
    const x = (this.scene.scale.width - meterWidth) / 2;
    const y = this.scene.scale.height - 80;
    
    // Draw background
    this.chargeMeter.fillStyle(0x333333);
    this.chargeMeter.fillRect(x, y, meterWidth, meterHeight);
    
    // Draw filled portion based on current charge
    const fillWidth = meterWidth * this.currentCharge;
    
    // Color changes based on charge level (green to yellow to red)
    let fillColor = 0x00ff00; // Green
    if (this.currentCharge > 0.7) {
      fillColor = 0xff0000; // Red for high power
    } else if (this.currentCharge > 0.4) {
      fillColor = 0xffff00; // Yellow for medium power
    }
    
    this.chargeMeter.fillStyle(fillColor);
    this.chargeMeter.fillRect(x, y, fillWidth, meterHeight);
    
    // Update text
    const percentage = Math.floor(this.currentCharge * 100);
    this.chargeText.setText(`Power: ${percentage}%`);
  }
  
  /**
   * Validates if a shot can be started
   * @returns True if shot can be started, false otherwise
   */
  private canStartShot(): boolean {
    // Check if not already charging and not in cooldown
    return !this.isCharging && !this.inCooldown;
  }
  
  /**
   * Updates the shot system
   * @param time The current time
   * @param delta The time delta
   */
  public update(time: number, delta: number): void {
    if (this.isCharging) {
      // Calculate charge duration
      const chargeDuration = Date.now() - this.chargeStartTime;
      
      // Check if max duration exceeded
      if (chargeDuration >= this.MAX_CHARGE_DURATION) {
        this.handleMaxCharge();
        return;
      }
      
      // Calculate current charge based on duration
      this.currentCharge = Math.min(
        this.MIN_POWER + (chargeDuration * this.POWER_RATE),
        this.MAX_POWER
      );
      
      // Update visual elements
      this.updateChargeMeter();
    }
  }
  
  /**
   * Cancels the current charging process
   */
  public cancelCharge(): void {
    if (this.isCharging) {
      this.isCharging = false;
      this.hideVisualElements();
    }
  }
  
  /**
   * Gets the current charge level (0.0 to 1.0)
   */
  public getCurrentCharge(): number {
    return this.currentCharge;
  }
  
  /**
   * Checks if currently in charging state
   */
  public isInChargingState(): boolean {
    return this.isCharging;
  }
}