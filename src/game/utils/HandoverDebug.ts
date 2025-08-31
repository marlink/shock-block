/**
 * Utility functions for debugging and testing the Handover system
 */
export class HandoverDebug {
  /**
   * Start the Handover example scene
   * @param game The Phaser game instance
   */
  public static startExample(game: Phaser.Game): void {
    // Stop any current scene
    const activeScene = game.scene.getScenes(true)[0];
    if (activeScene) {
      activeScene.scene.stop();
    }
    
    // Start the example scene
    game.scene.start('HandoverExample');
    console.log('Started Handover example scene');
  }
  
  /**
   * Add a debug button to the DOM to launch the Handover example
   * @param game The Phaser game instance
   */
  public static addDebugButton(game: Phaser.Game): void {
    // Create button element
    const button = document.createElement('button');
    button.innerText = 'Test Handover System';
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.right = '10px';
    button.style.zIndex = '1000';
    button.style.padding = '8px 16px';
    button.style.backgroundColor = '#4444aa';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    
    // Add hover effect
    button.addEventListener('mouseover', () => {
      button.style.backgroundColor = '#6666cc';
    });
    
    button.addEventListener('mouseout', () => {
      button.style.backgroundColor = '#4444aa';
    });
    
    // Add click handler
    button.addEventListener('click', () => {
      HandoverDebug.startExample(game);
    });
    
    // Add to DOM
    document.body.appendChild(button);
  }
  
  /**
   * Log the current state of the Handover system
   * @param handoverManager The HandoverManager instance
   */
  public static logState(handoverManager: any): void {
    if (!handoverManager) {
      console.error('HandoverManager not provided');
      return;
    }
    
    const session = handoverManager.getCurrentSession();
    const stage = handoverManager.getCurrentStage();
    
    console.group('Handover System State');
    console.log('Session:', session ? session.id : 'None');
    console.log('Current Stage:', stage ? stage.name : 'None');
    console.log('Allowed Actions:', stage ? stage.allowedActions : 'None');
    
    if (session) {
      console.group('Session State');
      const stateKeys = Object.keys(session.state || {});
      if (stateKeys.length > 0) {
        stateKeys.forEach(key => {
          console.log(`${key}:`, session.state[key]);
        });
      } else {
        console.log('No session state data');
      }
      console.groupEnd();
    }
    
    console.groupEnd();
  }
}