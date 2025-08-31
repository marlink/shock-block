import { Scene } from 'phaser';
import { HandoverManager } from '../systems/HandoverManager';

/**
 * Example scene demonstrating the Handover system usage
 */
export class HandoverExample extends Scene {
  // Handover manager instance
  private handoverManager: HandoverManager;
  
  // UI elements
  private stageText: Phaser.GameObjects.Text;
  private actionText: Phaser.GameObjects.Text;
  private sessionText: Phaser.GameObjects.Text;
  
  constructor() {
    super({ key: 'HandoverExample' });
  }
  
  create(): void {
    // Set background
    this.cameras.main.setBackgroundColor('#333333');
    
    // Initialize Handover system
    this.handoverManager = new HandoverManager(this);
    this.handoverManager.initialize();
    const session = this.handoverManager.startSession();
    
    // Set initial stage
    this.handoverManager.setStage('GamePreparation');
    
    // Create UI elements
    this.createUI();
    
    // Add some session data
    this.handoverManager.setSessionState('startTime', Date.now());
    this.handoverManager.setSessionState('score', 0);
    
    // Update session info display
    this.updateSessionInfo();
    
    // Setup input handlers for different actions
    this.setupInputHandlers();
    
    // Listen for stage changes
    this.events.on('handover-stage-changed', this.onStageChanged, this);
  }
  
  /**
   * Create UI elements for the example
   */
  private createUI(): void {
    // Title
    this.add.text(
      this.cameras.main.centerX, 
      50, 
      'Handover System Example', 
      { fontSize: '32px', color: '#ffffff' }
    ).setOrigin(0.5);
    
    // Current stage display
    this.add.text(
      100, 
      120, 
      'Current Stage:', 
      { fontSize: '24px', color: '#ffffff' }
    );
    
    this.stageText = this.add.text(
      350, 
      120, 
      this.handoverManager.getCurrentStage()?.name || 'None', 
      { fontSize: '24px', color: '#ffff00' }
    );
    
    // Action buttons
    this.add.text(
      100, 
      180, 
      'Available Actions:', 
      { fontSize: '24px', color: '#ffffff' }
    );
    
    this.actionText = this.add.text(
      350, 
      180, 
      this.getAvailableActionsText(), 
      { fontSize: '24px', color: '#00ff00' }
    );
    
    // Session info
    this.add.text(
      100, 
      240, 
      'Session Info:', 
      { fontSize: '24px', color: '#ffffff' }
    );
    
    this.sessionText = this.add.text(
      100, 
      280, 
      '', 
      { fontSize: '18px', color: '#cccccc' }
    );
    
    // Action buttons
    this.createActionButtons();
  }
  
  /**
   * Create buttons for different actions
   */
  private createActionButtons(): void {
    const actions = ['prepare', 'aim', 'charge', 'fire', 'reset'];
    const buttonWidth = 150;
    const buttonHeight = 50;
    const startX = this.cameras.main.centerX - ((buttonWidth + 20) * actions.length) / 2;
    
    actions.forEach((action, index) => {
      // Create button background
      const button = this.add.rectangle(
        startX + index * (buttonWidth + 20),
        400,
        buttonWidth,
        buttonHeight,
        0x4444aa
      ).setInteractive();
      
      // Add button text
      const buttonText = this.add.text(
        button.x,
        button.y,
        action.toUpperCase(),
        { fontSize: '18px', color: '#ffffff' }
      ).setOrigin(0.5);
      
      // Add button handler
      button.on('pointerdown', () => {
        this.performAction(action);
      });
      
      // Add hover effect
      button.on('pointerover', () => {
        button.setFillStyle(0x6666cc);
      });
      
      button.on('pointerout', () => {
        button.setFillStyle(0x4444aa);
      });
    });
    
    // Add stage transition button
    const nextStageButton = this.add.rectangle(
      this.cameras.main.centerX,
      480,
      250,
      50,
      0x44aa44
    ).setInteractive();
    
    this.add.text(
      nextStageButton.x,
      nextStageButton.y,
      'ADVANCE STAGE',
      { fontSize: '18px', color: '#ffffff' }
    ).setOrigin(0.5);
    
    nextStageButton.on('pointerdown', () => {
      this.handoverManager.advanceStage();
    });
    
    // Add hover effect
    nextStageButton.on('pointerover', () => {
      nextStageButton.setFillStyle(0x66cc66);
    });
    
    nextStageButton.on('pointerout', () => {
      nextStageButton.setFillStyle(0x44aa44);
    });
  }
  
  /**
   * Set up input handlers for different actions
   */
  private setupInputHandlers(): void {
    // Example keyboard input
    const keyboard = this.input.keyboard;
    if (!keyboard) return;
    
    keyboard.on('keydown-SPACE', () => {
      this.performAction('fire');
    });
    
    keyboard.on('keydown-A', () => {
      this.performAction('aim');
    });
    
    keyboard.on('keydown-C', () => {
      this.performAction('charge');
    });
    
    keyboard.on('keydown-R', () => {
      this.performAction('reset');
    });
    
    keyboard.on('keydown-N', () => {
      this.handoverManager.advanceStage();
    });
  }
  
  /**
   * Perform an action if allowed by the current stage
   */
  private performAction(action: string): void {
    const allowed = this.handoverManager.performAction(action, () => {
      // This code only runs if the action is allowed
      console.log(`Performed action: ${action}`);
      
      // Update score for certain actions
      if (action === 'fire') {
        const currentScore = this.handoverManager.getSessionState('score') || 0;
        this.handoverManager.setSessionState('score', currentScore + 100);
        this.updateSessionInfo();
      }
      
      // Show feedback
      this.showActionFeedback(action, true);
    });
    
    if (!allowed) {
      console.log(`Action not allowed: ${action}`);
      this.showActionFeedback(action, false);
    }
  }
  
  /**
   * Show visual feedback for an action
   */
  private showActionFeedback(action: string, allowed: boolean): void {
    const text = `${action.toUpperCase()} ${allowed ? 'PERFORMED' : 'NOT ALLOWED'}`;
    const color = allowed ? 0x00ff00 : 0xff0000;
    
    const feedback = this.add.text(
      this.cameras.main.centerX,
      550,
      text,
      { fontSize: '24px', color: allowed ? '#00ff00' : '#ff0000' }
    ).setOrigin(0.5);
    
    // Fade out and destroy
    this.tweens.add({
      targets: feedback,
      alpha: 0,
      y: 530,
      duration: 1500,
      onComplete: () => {
        feedback.destroy();
      }
    });
  }
  
  /**
   * Handle stage change events
   */
  private onStageChanged(): void {
    // Update stage display
    this.stageText.setText(this.handoverManager.getCurrentStage()?.name || 'None');
    
    // Update available actions
    this.actionText.setText(this.getAvailableActionsText());
    
    // Show stage change feedback
    const feedback = this.add.text(
      this.cameras.main.centerX,
      200,
      `STAGE CHANGED TO: ${this.handoverManager.getCurrentStage()?.name}`,
      { fontSize: '28px', color: '#ffff00' }
    ).setOrigin(0.5);
    
    // Fade out and destroy
    this.tweens.add({
      targets: feedback,
      alpha: 0,
      scale: 1.5,
      duration: 2000,
      onComplete: () => {
        feedback.destroy();
      }
    });
  }
  
  /**
   * Get text listing available actions
   */
  private getAvailableActionsText(): string {
    const stage = this.handoverManager.getCurrentStage();
    if (!stage) return 'None';
    
    return stage.allowedActions.join(', ');
  }
  
  /**
   * Update session information display
   */
  private updateSessionInfo(): void {
    const session = this.handoverManager.getCurrentSession();
    if (!session) {
      this.sessionText.setText('No active session');
      return;
    }
    
    const startTime = this.handoverManager.getSessionState('startTime') || 0;
    const score = this.handoverManager.getSessionState('score') || 0;
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    
    const sessionInfo = [
      `Session ID: ${session.id}`,
      `Current Stage: ${this.handoverManager.getCurrentStage()?.name}`,
      `Score: ${score}`,
      `Session Time: ${elapsedTime}s`
    ];
    
    this.sessionText.setText(sessionInfo.join('\n'));
  }
  
  update(): void {
    // Update session info every frame
    this.updateSessionInfo();
  }
}