import { Scene } from 'phaser';
import { GameSettings } from '../settings/GameSettings';

/**
 * SettingsMenu provides a UI for configuring game settings
 * including the ability to disable specific keys.
 */
export class SettingsMenu {
  private scene: Scene;
  private settings: GameSettings;
  private container: Phaser.GameObjects.Container;
  private isVisible: boolean = false;
  
  // Key configuration options
  private keyOptions: { key: string, label: string, description: string }[] = [
    { key: 'spacebar', label: 'Spacebar', description: 'Used for charging and firing' },
    { key: 'left', label: 'Left Arrow', description: 'Used for aiming left' },
    { key: 'right', label: 'Right Arrow', description: 'Used for aiming right' },
    { key: 'pause', label: 'Escape', description: 'Used for pausing the game' },
    { key: 'confirm', label: 'Enter', description: 'Used for confirming actions' }
  ];
  
  /**
   * Creates a new SettingsMenu
   * @param scene The Phaser scene this menu belongs to
   */
  constructor(scene: Scene) {
    this.scene = scene;
    this.settings = GameSettings.getInstance();
    
    // Create container for menu elements
    this.container = this.scene.add.container(0, 0);
    this.container.setDepth(900); // Below dialogs but above game
    
    // Create menu elements
    this.createMenuElements();
    
    // Hide menu initially
    this.container.setVisible(false);
  }
  
  /**
   * Creates all menu UI elements
   */
  private createMenuElements(): void {
    const width = this.scene.scale.width;
    const height = this.scene.scale.height;
    
    // Create semi-transparent background
    const bg = this.scene.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
      0.8
    );
    this.container.add(bg);
    
    // Create title
    const title = this.scene.add.text(
      width / 2,
      50,
      'Settings',
      { fontSize: '32px', color: '#ffffff', fontStyle: 'bold' }
    );
    title.setOrigin(0.5);
    this.container.add(title);
    
    // Create sections
    this.createInputSection(width / 2, 120);
    this.createVisualSection(width / 2, 350);
    this.createAudioSection(width / 2, 450);
    
    // Create close button
    const closeButton = this.scene.add.rectangle(
      width / 2,
      height - 50,
      200,
      40,
      0x555555
    );
    closeButton.setInteractive({ useHandCursor: true });
    
    const closeText = this.scene.add.text(
      width / 2,
      height - 50,
      'Close Settings',
      { fontSize: '18px', color: '#ffffff' }
    );
    closeText.setOrigin(0.5);
    
    closeButton.on('pointerdown', () => {
      this.hide();
    });
    
    this.container.add([closeButton, closeText]);
  }
  
  /**
   * Creates the input settings section
   * @param x X position
   * @param y Y position
   */
  private createInputSection(x: number, y: number): void {
    // Section title
    const title = this.scene.add.text(
      x,
      y,
      'Input Settings',
      { fontSize: '24px', color: '#ffffff', fontStyle: 'bold' }
    );
    title.setOrigin(0.5);
    this.container.add(title);
    
    // Create key disable toggles
    const startY = y + 40;
    const spacing = 40;
    
    this.keyOptions.forEach((option, index) => {
      const yPos = startY + (index * spacing);
      
      // Create label
      const label = this.scene.add.text(
        x - 150,
        yPos,
        `${option.label}:`,
        { fontSize: '18px', color: '#ffffff' }
      );
      label.setOrigin(0, 0.5);
      
      // Create description
      const description = this.scene.add.text(
        x + 150,
        yPos,
        option.description,
        { fontSize: '14px', color: '#aaaaaa' }
      );
      description.setOrigin(1, 0.5);
      
      // Create toggle button
      const isDisabled = this.settings.isKeyDisabled(option.key);
      const toggleBg = this.scene.add.rectangle(
        x,
        yPos,
        60,
        30,
        isDisabled ? 0x555555 : 0x00aa00
      );
      toggleBg.setInteractive({ useHandCursor: true });
      
      const toggleText = this.scene.add.text(
        x,
        yPos,
        isDisabled ? 'Off' : 'On',
        { fontSize: '14px', color: '#ffffff' }
      );
      toggleText.setOrigin(0.5);
      
      // Store reference to toggle elements for updating
      toggleBg.setData('key', option.key);
      toggleBg.setData('text', toggleText);
      
      toggleBg.on('pointerdown', () => {
        const key = toggleBg.getData('key');
        const text = toggleBg.getData('text');
        const currentlyDisabled = this.settings.isKeyDisabled(key);
        
        // Toggle state
        this.settings.setKeyDisabled(key, !currentlyDisabled);
        
        // Update visual
        if (this.settings.isKeyDisabled(key)) {
          toggleBg.fillColor = 0x555555;
          text.setText('Off');
        } else {
          toggleBg.fillColor = 0x00aa00;
          text.setText('On');
        }
      });
      
      this.container.add([label, description, toggleBg, toggleText]);
    });
  }
  
  /**
   * Creates the visual settings section
   * @param x X position
   * @param y Y position
   */
  private createVisualSection(x: number, y: number): void {
    // Section title
    const title = this.scene.add.text(
      x,
      y,
      'Visual Settings',
      { fontSize: '24px', color: '#ffffff', fontStyle: 'bold' }
    );
    title.setOrigin(0.5);
    this.container.add(title);
    
    // Create trajectory toggle
    const trajectoryLabel = this.scene.add.text(
      x - 150,
      y + 40,
      'Show Trajectory:',
      { fontSize: '18px', color: '#ffffff' }
    );
    trajectoryLabel.setOrigin(0, 0.5);
    
    const trajectoryEnabled = this.settings.isTrajectoryEnabled();
    const trajectoryToggle = this.scene.add.rectangle(
      x,
      y + 40,
      60,
      30,
      trajectoryEnabled ? 0x00aa00 : 0x555555
    );
    trajectoryToggle.setInteractive({ useHandCursor: true });
    
    const trajectoryText = this.scene.add.text(
      x,
      y + 40,
      trajectoryEnabled ? 'On' : 'Off',
      { fontSize: '14px', color: '#ffffff' }
    );
    trajectoryText.setOrigin(0.5);
    
    trajectoryToggle.setData('text', trajectoryText);
    trajectoryToggle.on('pointerdown', () => {
      const text = trajectoryToggle.getData('text');
      const currentlyEnabled = this.settings.isTrajectoryEnabled();
      
      // Toggle state
      this.settings.setTrajectoryEnabled(!currentlyEnabled);
      
      // Update visual
      if (this.settings.isTrajectoryEnabled()) {
        trajectoryToggle.fillColor = 0x00aa00;
        text.setText('On');
      } else {
        trajectoryToggle.fillColor = 0x555555;
        text.setText('Off');
      }
    });
    
    // Create charge meter toggle
    const chargeLabel = this.scene.add.text(
      x - 150,
      y + 80,
      'Show Charge Meter:',
      { fontSize: '18px', color: '#ffffff' }
    );
    chargeLabel.setOrigin(0, 0.5);
    
    const chargeEnabled = this.settings.isChargeMeterEnabled();
    const chargeToggle = this.scene.add.rectangle(
      x,
      y + 80,
      60,
      30,
      chargeEnabled ? 0x00aa00 : 0x555555
    );
    chargeToggle.setInteractive({ useHandCursor: true });
    
    const chargeText = this.scene.add.text(
      x,
      y + 80,
      chargeEnabled ? 'On' : 'Off',
      { fontSize: '14px', color: '#ffffff' }
    );
    chargeText.setOrigin(0.5);
    
    chargeToggle.setData('text', chargeText);
    chargeToggle.on('pointerdown', () => {
      const text = chargeToggle.getData('text');
      const currentlyEnabled = this.settings.isChargeMeterEnabled();
      
      // Toggle state
      this.settings.setChargeMeterEnabled(!currentlyEnabled);
      
      // Update visual
      if (this.settings.isChargeMeterEnabled()) {
        chargeToggle.fillColor = 0x00aa00;
        text.setText('On');
      } else {
        chargeToggle.fillColor = 0x555555;
        text.setText('Off');
      }
    });
    
    this.container.add([trajectoryLabel, trajectoryToggle, trajectoryText, chargeLabel, chargeToggle, chargeText]);
  }
  
  /**
   * Creates the audio settings section
   * @param x X position
   * @param y Y position
   */
  private createAudioSection(x: number, y: number): void {
    // Section title
    const title = this.scene.add.text(
      x,
      y,
      'Audio Settings',
      { fontSize: '24px', color: '#ffffff', fontStyle: 'bold' }
    );
    title.setOrigin(0.5);
    this.container.add(title);
    
    // SFX volume slider
    const sfxLabel = this.scene.add.text(
      x - 150,
      y + 40,
      'SFX Volume:',
      { fontSize: '18px', color: '#ffffff' }
    );
    sfxLabel.setOrigin(0, 0.5);
    
    const sfxValue = this.scene.add.text(
      x + 150,
      y + 40,
      `${Math.round(this.settings.getSfxVolume() * 100)}%`,
      { fontSize: '18px', color: '#ffffff' }
    );
    sfxValue.setOrigin(1, 0.5);
    
    // Music volume slider
    const musicLabel = this.scene.add.text(
      x - 150,
      y + 80,
      'Music Volume:',
      { fontSize: '18px', color: '#ffffff' }
    );
    musicLabel.setOrigin(0, 0.5);
    
    const musicValue = this.scene.add.text(
      x + 150,
      y + 80,
      `${Math.round(this.settings.getMusicVolume() * 100)}%`,
      { fontSize: '18px', color: '#ffffff' }
    );
    musicValue.setOrigin(1, 0.5);
    
    this.container.add([title, sfxLabel, sfxValue, musicLabel, musicValue]);
  }
  
  /**
   * Shows the settings menu
   */
  public show(): void {
    this.isVisible = true;
    this.container.setVisible(true);
    
    // Pause the game when settings are open
    this.scene.events.emit('pause-game');
  }
  
  /**
   * Hides the settings menu
   */
  public hide(): void {
    this.isVisible = false;
    this.container.setVisible(false);
    
    // Resume the game when settings are closed
    this.scene.events.emit('resume-game');
  }
  
  /**
   * Toggles the visibility of the settings menu
   */
  public toggle(): void {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }
  
  /**
   * Checks if the settings menu is visible
   */
  public isMenuVisible(): boolean {
    return this.isVisible;
  }
}