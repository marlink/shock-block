import { Scene } from 'phaser';

/**
 * DialogManager handles confirmation dialogs for pause/menu actions
 * to prevent accidental key presses from disrupting gameplay.
 */
export class DialogManager {
  private scene: Scene;
  private dialogContainer: Phaser.GameObjects.Container;
  private overlay: Phaser.GameObjects.Rectangle;
  private isDialogOpen: boolean = false;
  private currentCallback: Function | null = null;
  
  /**
   * Creates a new DialogManager
   * @param scene The Phaser scene this manager belongs to
   */
  constructor(scene: Scene) {
    this.scene = scene;
    
    // Create container for dialog elements
    this.dialogContainer = this.scene.add.container(0, 0);
    this.dialogContainer.setDepth(1000); // Ensure it's above other elements
    
    // Create semi-transparent overlay
    this.overlay = this.scene.add.rectangle(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2,
      this.scene.scale.width,
      this.scene.scale.height,
      0x000000,
      0.7
    );
    this.overlay.setInteractive();
    this.dialogContainer.add(this.overlay);
    
    // Hide dialog initially
    this.dialogContainer.setVisible(false);
    
    // Setup event listeners
    this.setupEventListeners();
  }
  
  /**
   * Sets up event listeners for input events
   */
  private setupEventListeners(): void {
    // Listen for pause event from InputSystem
    this.scene.events.on('input-pause', () => {
      this.showConfirmationDialog(
        'Pause Game',
        'Are you sure you want to pause the game?',
        () => {
          // Emit pause confirmed event
          this.scene.events.emit('pause-confirmed');
        }
      );
    });
    
    // Listen for other menu actions that need confirmation
    this.scene.events.on('input-exit', () => {
      this.showConfirmationDialog(
        'Exit Game',
        'Are you sure you want to exit to the main menu?\nYour progress will be lost.',
        () => {
          // Emit exit confirmed event
          this.scene.events.emit('exit-confirmed');
        }
      );
    });
    
    // Listen for restart action
    this.scene.events.on('input-restart', () => {
      this.showConfirmationDialog(
        'Restart Level',
        'Are you sure you want to restart the level?\nYour progress will be lost.',
        () => {
          // Emit restart confirmed event
          this.scene.events.emit('restart-confirmed');
        }
      );
    });
  }
  
  /**
   * Shows a confirmation dialog with title, message, and callback
   * @param title The dialog title
   * @param message The dialog message
   * @param callback Function to call if confirmed
   */
  public showConfirmationDialog(title: string, message: string, callback: Function): void {
    // Don't show another dialog if one is already open
    if (this.isDialogOpen) return;
    
    this.isDialogOpen = true;
    this.currentCallback = callback;
    
    // Clear any existing dialog content
    this.dialogContainer.removeAll();
    this.dialogContainer.add(this.overlay);
    
    // Create dialog background
    const dialogWidth = 400;
    const dialogHeight = 250;
    const dialogX = this.scene.scale.width / 2;
    const dialogY = this.scene.scale.height / 2;
    
    const dialogBg = this.scene.add.rectangle(
      0,
      0,
      dialogWidth,
      dialogHeight,
      0x333333,
      0.9
    );
    dialogBg.setStrokeStyle(2, 0xffffff);
    
    // Create title text
    const titleText = this.scene.add.text(
      0,
      -dialogHeight / 2 + 30,
      title,
      { fontSize: '24px', color: '#ffffff', fontStyle: 'bold' }
    );
    titleText.setOrigin(0.5);
    
    // Create message text
    const messageText = this.scene.add.text(
      0,
      0,
      message,
      { fontSize: '18px', color: '#ffffff', align: 'center', wordWrap: { width: dialogWidth - 40 } }
    );
    messageText.setOrigin(0.5);
    
    // Create confirm button
    const confirmButton = this.scene.add.rectangle(
      -70,
      dialogHeight / 2 - 40,
      120,
      40,
      0x00aa00
    );
    confirmButton.setInteractive({ useHandCursor: true });
    
    const confirmText = this.scene.add.text(
      -70,
      dialogHeight / 2 - 40,
      'Confirm',
      { fontSize: '16px', color: '#ffffff' }
    );
    confirmText.setOrigin(0.5);
    
    // Create cancel button
    const cancelButton = this.scene.add.rectangle(
      70,
      dialogHeight / 2 - 40,
      120,
      40,
      0xaa0000
    );
    cancelButton.setInteractive({ useHandCursor: true });
    
    const cancelText = this.scene.add.text(
      70,
      dialogHeight / 2 - 40,
      'Cancel',
      { fontSize: '16px', color: '#ffffff' }
    );
    cancelText.setOrigin(0.5);
    
    // Add event listeners to buttons
    confirmButton.on('pointerdown', () => {
      this.closeDialog();
      if (this.currentCallback) {
        this.currentCallback();
      }
    });
    
    cancelButton.on('pointerdown', () => {
      this.closeDialog();
    });
    
    // Add all elements to the container
    this.dialogContainer.add([dialogBg, titleText, messageText, confirmButton, confirmText, cancelButton, cancelText]);
    
    // Position the container
    this.dialogContainer.setPosition(dialogX, dialogY);
    
    // Show the dialog
    this.dialogContainer.setVisible(true);
    
    // Add keyboard listeners for dialog
    this.scene.input.keyboard?.once('keydown-ENTER', () => {
      if (this.isDialogOpen) {
        this.closeDialog();
        if (this.currentCallback) {
          this.currentCallback();
        }
      }
    });
    
    this.scene.input.keyboard?.once('keydown-ESC', () => {
      if (this.isDialogOpen) {
        this.closeDialog();
      }
    });
  }
  
  /**
   * Closes the current dialog
   */
  private closeDialog(): void {
    this.isDialogOpen = false;
    this.currentCallback = null;
    this.dialogContainer.setVisible(false);
  }
  
  /**
   * Checks if a dialog is currently open
   */
  public isDialogVisible(): boolean {
    return this.isDialogOpen;
  }
}