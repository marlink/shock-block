import { Roadmap, Stage } from './Handover';

/**
 * HandoverFactory - Utility class for creating Handover roadmaps and stages
 */
export class HandoverFactory {
  /**
   * Create a game progression roadmap
   */
  public static createGameRoadmap(): Roadmap {
    const stages = [
      // Main Menu Stage
      new Stage('MainMenu', ['startGame', 'openSettings', 'viewHelp'], {
        requiredScenes: ['MainMenu']
      }),
      
      // Game Preparation Stage
      new Stage('GamePreparation', ['aim', 'charge', 'cancelShot'], {
        requiredScenes: ['Game']
      }),
      
      // Active Gameplay Stage
      new Stage('ActiveGameplay', ['aim', 'charge', 'fire', 'pause'], {
        requiredScenes: ['Game']
      }),
      
      // Paused Stage
      new Stage('Paused', ['resume', 'restart', 'quit'], {
        requiredScenes: ['Game']
      }),
      
      // Level Complete Stage
      new Stage('LevelComplete', ['nextLevel', 'retry', 'mainMenu'], {
        requiredScenes: ['Game', 'GameOver']
      }),
      
      // Game Over Stage
      new Stage('GameOver', ['restart', 'mainMenu'], {
        requiredScenes: ['GameOver']
      })
    ];
    
    return new Roadmap('MainGameRoadmap', stages);
  }
  
  /**
   * Create a tutorial roadmap with more granular stages
   */
  public static createTutorialRoadmap(): Roadmap {
    const stages = [
      // Welcome Stage
      new Stage('TutorialWelcome', ['continue'], {
        requiredScenes: ['Game']
      }),
      
      // Aiming Tutorial Stage
      new Stage('TutorialAiming', ['aim', 'continue'], {
        requiredScenes: ['Game'],
        completionRequirement: 'aimingPracticed'
      }),
      
      // Charging Tutorial Stage
      new Stage('TutorialCharging', ['aim', 'charge', 'continue'], {
        requiredScenes: ['Game'],
        completionRequirement: 'chargingPracticed'
      }),
      
      // Firing Tutorial Stage
      new Stage('TutorialFiring', ['aim', 'charge', 'fire', 'continue'], {
        requiredScenes: ['Game'],
        completionRequirement: 'targetHit'
      }),
      
      // Completion Stage
      new Stage('TutorialComplete', ['startGame', 'mainMenu'], {
        requiredScenes: ['Game']
      })
    ];
    
    return new Roadmap('TutorialRoadmap', stages);
  }
  
  /**
   * Create a custom roadmap with specified stages
   */
  public static createCustomRoadmap(name: string, stages: Stage[]): Roadmap {
    if (stages.length === 0) {
      throw new Error('Custom roadmap must contain at least one stage');
    }
    
    return new Roadmap(name, stages);
  }
}