import { Scene } from 'phaser';
import { InputSystem } from './InputSystem';
import { ShotSystem } from './ShotSystem';
import { AimSystem } from './AimSystem';
import { DialogManager } from '../ui/DialogManager';
import { SettingsMenu } from '../ui/SettingsMenu';
import { GameSettings } from '../settings/GameSettings';
import { HandoverManager } from './HandoverManager';

/**
 * InputIntegration connects all input-related systems together
 * and provides a unified interface for handling input in the game.
 */
export class InputIntegration {
  private scene: Scene;
  private inputSystem: InputSystem;
  private shotSystem: ShotSystem;
  private aimSystem: AimSystem;
  private dialogManager: DialogManager;
  private settingsMenu: SettingsMenu;
  private settings: GameSettings;
  
  /**
   * Creates a new InputIntegration instance
   * @param scene The Phaser scene this integration belongs to
   */
  constructor(scene: Scene) {
    this.scene = scene;
    this.settings = GameSettings.getInstance();
    
    // Create handover manager first as it's required by other systems
    const handoverManager = new HandoverManager();
    
    // Initialize all systems
    this.inputSystem = new InputSystem(scene, handoverManager);
    this.shotSystem = new ShotSystem(scene, handoverManager);
    this.aimSystem = new AimSystem(scene, handoverManager);
    this.dialogManager = new DialogManager(scene);
    this.settingsMenu = new SettingsMenu(scene);
    
    // Connect systems
    this.connectSystems();
  }
  
  /**
   * Connects all systems together by setting up event listeners
   */
  private connectSystems(): void {
    // Connect input to shot system
    this.scene.events.on('input-charge-start', () => {
      if (!this.dialogManager.isDialogVisible() && 
          !this.settingsMenu.isMenuVisible()) {
        // The ShotSystem will handle this via its own event listener
      }
    });
    
    this.scene.events.on('input-fire', () => {
      if (!this.dialogManager.isDialogVisible() && 
          !this.settingsMenu.isMenuVisible()) {
        // The ShotSystem will handle this via its own event listener
      }
    });
    
    // Connect input to aim system
    this.scene.events.on('input-aim-left', () => {
      if (!this.dialogManager.isDialogVisible() && 
          !this.settingsMenu.isMenuVisible()) {
        // The AimSystem will handle this via its own event listener
      }
    });
    
    this.scene.events.on('input-aim-right', () => {
      if (!this.dialogManager.isDialogVisible() && 
          !this.settingsMenu.isMenuVisible()) {
        // The AimSystem will handle this via its own event listener
      }
    });
    
    // Connect shot system to aim system
    this.scene.events.on('shot-fired', (data: { power: number }) => {
      // The AimSystem will handle this via its own event listener
    });
    
    // Connect input to dialog manager
    this.scene.events.on('input-pause', () => {
      if (!this.settings.isKeyDisabled('pause') && 
          !this.settingsMenu.isMenuVisible()) {
        this.dialogManager.showConfirmationDialog(
          'Pause Game',
          'Are you sure you want to pause the game?',
          () => {
            this.scene.events.emit('pause-confirmed');
          }
        );
      }
    });
    
    this.scene.events.on('input-exit', () => {
      if (!this.settings.isKeyDisabled('confirm') && 
          !this.settingsMenu.isMenuVisible()) {
        this.dialogManager.showConfirmationDialog(
          'Exit Game',
          'Are you sure you want to exit to the main menu?\nYour progress will be lost.',
          () => {
            this.scene.events.emit('exit-confirmed');
          }
        );
      }
    });
    
    this.scene.events.on('input-restart', () => {
      if (!this.settings.isKeyDisabled('confirm') && 
          !this.settingsMenu.isMenuVisible()) {
        this.dialogManager.showConfirmationDialog(
          'Restart Level',
          'Are you sure you want to restart the level?\nYour progress will be lost.',
          () => {
            this.scene.events.emit('restart-confirmed');
          }
        );
      }
    });
    
    // Connect input to settings menu
    this.scene.events.on('input-settings', () => {
      if (!this.dialogManager.isDialogVisible()) {
        this.settingsMenu.toggle();
      }
    });
    
    // Handle game state changes
    this.scene.events.on('pause-game', () => {
      // Game paused - no specific action needed in InputSystem
    });
    
    this.scene.events.on('resume-game', () => {
      // Game resumed - no specific action needed in InputSystem
    });
  }
  
  /**
   * Updates all systems
   * @param time The current time
   * @param delta The time in ms since the last frame
   */
  public update(time: number, delta: number): void {
    this.inputSystem.update(time, delta);
    this.shotSystem.update(time, delta);
    this.aimSystem.update(time, delta);
  }
  
  /**
   * Destroys all systems and cleans up event listeners
   */
  public destroy(): void {
    // Clean up event listeners
    this.scene.events.off('input-charge-start');
    this.scene.events.off('input-fire');
    this.scene.events.off('input-aim-left');
    this.scene.events.off('input-aim-right');
    this.scene.events.off('shot-fired');
    this.scene.events.off('input-pause');
    this.scene.events.off('input-exit');
    this.scene.events.off('input-restart');
    this.scene.events.off('input-settings');
    this.scene.events.off('pause-game');
    this.scene.events.off('resume-game');
    
    // No explicit destroy methods needed
  }
}