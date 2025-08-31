import StartGame from './game/main';
import { Handover } from './game/systems/Handover';
import { HandoverFactory } from './game/systems/HandoverFactory';
import { HandoverDebug } from './game/utils/HandoverDebug';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the Handover system with the main game roadmap
    const handover = Handover.getInstance();
    const mainRoadmap = HandoverFactory.createGameRoadmap();
    handover.initialize(mainRoadmap);
    console.log('Handover system initialized with main game roadmap');
    
    // Start the game
    const game = StartGame('game-container');
    
    // Add debug button for testing Handover system
    // Only in development mode
    if (process.env.NODE_ENV !== 'production') {
        HandoverDebug.addDebugButton(game);
        console.log('Handover debug button added');
    }
});