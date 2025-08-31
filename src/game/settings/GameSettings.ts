/**
 * GameSettings manages user preferences and accessibility options
 * including the ability to disable specific keys.
 */
export class GameSettings {
  // Singleton instance
  private static instance: GameSettings;
  
  // Default settings
  private settings: {
    // Input settings
    disabledKeys: Set<string>;
    inputDebounceMs: number;
    nonCriticalKeyDelayMs: number;
    
    // Visual settings
    showTrajectory: boolean;
    showChargeMeter: boolean;
    
    // Audio settings
    sfxVolume: number;
    musicVolume: number;
    
    // Accessibility settings
    useHighContrast: boolean;
    largeText: boolean;
  };
  
  /**
   * Private constructor for singleton pattern
   */
  private constructor() {
    // Initialize with default settings
    this.settings = {
      disabledKeys: new Set<string>(),
      inputDebounceMs: 200,
      nonCriticalKeyDelayMs: 100,
      
      showTrajectory: true,
      showChargeMeter: true,
      
      sfxVolume: 0.7,
      musicVolume: 0.5,
      
      useHighContrast: false,
      largeText: false
    };
    
    // Load settings from local storage if available
    this.loadSettings();
  }
  
  /**
   * Gets the singleton instance
   */
  public static getInstance(): GameSettings {
    if (!GameSettings.instance) {
      GameSettings.instance = new GameSettings();
    }
    
    return GameSettings.instance;
  }
  
  /**
   * Loads settings from local storage
   */
  private loadSettings(): void {
    try {
      const savedSettings = localStorage.getItem('mamba-kick-settings');
      
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        
        // Apply saved settings, keeping defaults for any missing properties
        if (parsedSettings.disabledKeys) {
          this.settings.disabledKeys = new Set(parsedSettings.disabledKeys);
        }
        
        if (parsedSettings.inputDebounceMs !== undefined) {
          this.settings.inputDebounceMs = parsedSettings.inputDebounceMs;
        }
        
        if (parsedSettings.nonCriticalKeyDelayMs !== undefined) {
          this.settings.nonCriticalKeyDelayMs = parsedSettings.nonCriticalKeyDelayMs;
        }
        
        if (parsedSettings.showTrajectory !== undefined) {
          this.settings.showTrajectory = parsedSettings.showTrajectory;
        }
        
        if (parsedSettings.showChargeMeter !== undefined) {
          this.settings.showChargeMeter = parsedSettings.showChargeMeter;
        }
        
        if (parsedSettings.sfxVolume !== undefined) {
          this.settings.sfxVolume = parsedSettings.sfxVolume;
        }
        
        if (parsedSettings.musicVolume !== undefined) {
          this.settings.musicVolume = parsedSettings.musicVolume;
        }
        
        if (parsedSettings.useHighContrast !== undefined) {
          this.settings.useHighContrast = parsedSettings.useHighContrast;
        }
        
        if (parsedSettings.largeText !== undefined) {
          this.settings.largeText = parsedSettings.largeText;
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      // If loading fails, continue with default settings
    }
  }
  
  /**
   * Saves current settings to local storage
   */
  private saveSettings(): void {
    try {
      // Convert Set to Array for JSON serialization
      const settingsToSave = {
        ...this.settings,
        disabledKeys: Array.from(this.settings.disabledKeys)
      };
      
      localStorage.setItem('mamba-kick-settings', JSON.stringify(settingsToSave));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }
  
  /**
   * Checks if a specific key is disabled
   * @param key The key to check
   */
  public isKeyDisabled(key: string): boolean {
    return this.settings.disabledKeys.has(key);
  }
  
  /**
   * Enables or disables a specific key
   * @param key The key to enable/disable
   * @param disabled Whether the key should be disabled
   */
  public setKeyDisabled(key: string, disabled: boolean): void {
    if (disabled) {
      this.settings.disabledKeys.add(key);
    } else {
      this.settings.disabledKeys.delete(key);
    }
    
    this.saveSettings();
  }
  
  /**
   * Gets all currently disabled keys
   */
  public getDisabledKeys(): string[] {
    return Array.from(this.settings.disabledKeys);
  }
  
  /**
   * Gets the input debounce time in milliseconds
   */
  public getInputDebounceMs(): number {
    return this.settings.inputDebounceMs;
  }
  
  /**
   * Sets the input debounce time in milliseconds
   * @param ms The debounce time in milliseconds
   */
  public setInputDebounceMs(ms: number): void {
    this.settings.inputDebounceMs = ms;
    this.saveSettings();
  }
  
  /**
   * Gets the non-critical key delay in milliseconds
   */
  public getNonCriticalKeyDelayMs(): number {
    return this.settings.nonCriticalKeyDelayMs;
  }
  
  /**
   * Sets the non-critical key delay in milliseconds
   * @param ms The delay time in milliseconds
   */
  public setNonCriticalKeyDelayMs(ms: number): void {
    this.settings.nonCriticalKeyDelayMs = ms;
    this.saveSettings();
  }
  
  /**
   * Checks if trajectory preview is enabled
   */
  public isTrajectoryEnabled(): boolean {
    return this.settings.showTrajectory;
  }
  
  /**
   * Enables or disables trajectory preview
   * @param enabled Whether trajectory preview should be enabled
   */
  public setTrajectoryEnabled(enabled: boolean): void {
    this.settings.showTrajectory = enabled;
    this.saveSettings();
  }
  
  /**
   * Checks if charge meter is enabled
   */
  public isChargeMeterEnabled(): boolean {
    return this.settings.showChargeMeter;
  }
  
  /**
   * Enables or disables charge meter
   * @param enabled Whether charge meter should be enabled
   */
  public setChargeMeterEnabled(enabled: boolean): void {
    this.settings.showChargeMeter = enabled;
    this.saveSettings();
  }
  
  /**
   * Gets the SFX volume (0.0 to 1.0)
   */
  public getSfxVolume(): number {
    return this.settings.sfxVolume;
  }
  
  /**
   * Sets the SFX volume
   * @param volume The volume level (0.0 to 1.0)
   */
  public setSfxVolume(volume: number): void {
    this.settings.sfxVolume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }
  
  /**
   * Gets the music volume (0.0 to 1.0)
   */
  public getMusicVolume(): number {
    return this.settings.musicVolume;
  }
  
  /**
   * Sets the music volume
   * @param volume The volume level (0.0 to 1.0)
   */
  public setMusicVolume(volume: number): void {
    this.settings.musicVolume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }
  
  /**
   * Checks if high contrast mode is enabled
   */
  public isHighContrastEnabled(): boolean {
    return this.settings.useHighContrast;
  }
  
  /**
   * Enables or disables high contrast mode
   * @param enabled Whether high contrast mode should be enabled
   */
  public setHighContrastEnabled(enabled: boolean): void {
    this.settings.useHighContrast = enabled;
    this.saveSettings();
  }
  
  /**
   * Checks if large text mode is enabled
   */
  public isLargeTextEnabled(): boolean {
    return this.settings.largeText;
  }
  
  /**
   * Enables or disables large text mode
   * @param enabled Whether large text mode should be enabled
   */
  public setLargeTextEnabled(enabled: boolean): void {
    this.settings.largeText = enabled;
    this.saveSettings();
  }
  
  /**
   * Resets all settings to defaults
   */
  public resetToDefaults(): void {
    this.settings = {
      disabledKeys: new Set<string>(),
      inputDebounceMs: 200,
      nonCriticalKeyDelayMs: 100,
      
      showTrajectory: true,
      showChargeMeter: true,
      
      sfxVolume: 0.7,
      musicVolume: 0.5,
      
      useHighContrast: false,
      largeText: false
    };
    
    this.saveSettings();
  }
}