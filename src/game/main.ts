import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';
import { HandoverExample } from './examples/HandoverExample';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        GameOver,
        HandoverExample
    ]
};

/**
 * Starts the game with the specified parent container
 * @param parent The ID of the parent container element
 * @returns The Phaser Game instance
 */
const StartGame = (parent: string): Game => {
    // Create and return the game instance
    const game = new Game({ ...config, parent });
    
    return game;
}

export default StartGame;
