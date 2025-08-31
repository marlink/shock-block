import { Scene } from 'phaser';
import { Handover, Roadmap, Stage, Session } from './Handover';
import { HandoverFactory } from './HandoverFactory';
import { HandoverManager } from './HandoverManager';

/**
 * HandoverTest - Utility class for testing the Handover system
 */
export class HandoverTest {
  /**
   * Run a basic test of the Handover system
   */
  public static runBasicTest(): void {
    console.log('=== Running Handover System Test ===');
    
    // Create a mock scene for testing
    const mockScene = {
      events: {
        once: (event: string, callback: Function) => {
          console.log(`Registered event listener for: ${event}`);
        },
        on: (event: string, callback: Function) => {
          console.log(`Registered event listener for: ${event}`);
        },
        emit: (event: string, data: any) => {
          console.log(`Emitted event: ${event}`, data);
        }
      }
    } as unknown as Scene;
    
    // Test the Handover system directly
    console.log('\n1. Testing core Handover system:');
    const handover = Handover.getInstance();
    
    // Create a test roadmap
    const testStages = [
      new Stage('TestStage1', ['action1', 'action2']),
      new Stage('TestStage2', ['action2', 'action3']),
      new Stage('TestStage3', ['action3', 'action4'])
    ];
    const testRoadmap = new Roadmap('TestRoadmap', testStages);
    
    // Initialize and start session
    handover.initialize(testRoadmap);
    const session = handover.startSession('test_session', mockScene);
    console.log('Session started:', session.id);
    
    // Test stage management
    console.log('\nCurrent stage:', handover.getCurrentStage()?.name);
    console.log('Is action1 allowed?', handover.isActionAllowed('action1'));
    console.log('Is action3 allowed?', handover.isActionAllowed('action3'));
    
    // Test stage advancement
    console.log('\nAdvancing to next stage...');
    handover.advanceStage();
    console.log('Current stage:', handover.getCurrentStage()?.name);
    console.log('Is action1 allowed?', handover.isActionAllowed('action1'));
    console.log('Is action3 allowed?', handover.isActionAllowed('action3'));
    
    // Test setting specific stage
    console.log('\nSetting specific stage...');
    handover.setStage('TestStage3');
    console.log('Current stage:', handover.getCurrentStage()?.name);
    console.log('Is action3 allowed?', handover.isActionAllowed('action3'));
    console.log('Is action1 allowed?', handover.isActionAllowed('action1'));
    
    // Test session state
    console.log('\nTesting session state...');
    session.setState('testKey', 'testValue');
    console.log('Session state value:', session.getState('testKey'));
    
    // End session
    console.log('\nEnding session...');
    handover.endSession();
    console.log('Current session:', handover.getCurrentSession());
    
    // Test HandoverManager
    console.log('\n2. Testing HandoverManager:');
    const manager = new HandoverManager(mockScene);
    manager.initialize();
    manager.startSession();
    
    // Test stage management via manager
    console.log('\nSetting stage via manager...');
    manager.setStage('MainMenu');
    console.log('Current stage:', manager.getCurrentStage()?.name);
    
    // Test action performance
    console.log('\nPerforming allowed action...');
    const actionResult = manager.performAction('startGame', () => {
      console.log('Action executed successfully!');
    });
    console.log('Action allowed?', actionResult);
    
    console.log('\nPerforming disallowed action...');
    const disallowedResult = manager.performAction('invalidAction', () => {
      console.log('This should not execute!');
    });
    console.log('Action allowed?', disallowedResult);
    
    // End manager session
    console.log('\nEnding manager session...');
    manager.endSession();
    
    console.log('\n=== Handover System Test Complete ===');
  }
  
  /**
   * Run this test from any scene to verify Handover functionality
   */
  public static runFromScene(scene: Scene): void {
    console.log('Running Handover test from scene:', scene.scene.key);
    
    // Create a manager for this scene
    const manager = new HandoverManager(scene);
    manager.initialize();
    const session = manager.startSession();
    
    // Set stage based on scene type
    let stageName = 'MainMenu';
    if (scene.scene.key === 'Game') {
      stageName = 'GamePreparation';
    } else if (scene.scene.key === 'GameOver') {
      stageName = 'GameOver';
    }
    
    manager.setStage(stageName);
    console.log(`Set stage to ${stageName} for scene ${scene.scene.key}`);
    
    // Store test data in session
    manager.setSessionState('testTimestamp', Date.now());
    console.log('Test data stored in session');
    
    // The session will be automatically ended when the scene shuts down
  }
}