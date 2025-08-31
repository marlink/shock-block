import { Scene } from 'phaser';
import { HandoverManager } from '../systems/HandoverManager';

export class GameOver extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameover_text : Phaser.GameObjects.Text;
    handoverManager: HandoverManager;

    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        // Initialize Handover system
        this.handoverManager = new HandoverManager(this);
        this.handoverManager.initialize();
        this.handoverManager.startSession();
        
        // Set initial stage for game over
        this.handoverManager.setStage('GameOver');
        
        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0xff0000);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        this.gameover_text = this.add.text(512, 384, 'Game Over', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        });
        this.gameover_text.setOrigin(0.5);
        
        // Add stage info text
        const stageText = this.add.text(512, 450, 'Current Stage: ' + this.handoverManager.getCurrentStage()?.name, {
            fontFamily: 'Arial', fontSize: 24, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);

        // Use Handover to manage allowed actions
        this.input.once('pointerdown', () => {
            // Check if action is allowed in current stage
            this.handoverManager.performAction('mainMenu', () => {
                this.scene.start('MainMenu');
            });
        });
    }
}
