import { Scene } from 'phaser';
import { HandoverManager } from '../systems/HandoverManager';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text : Phaser.GameObjects.Text;
    handoverManager: HandoverManager;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        // Initialize Handover system
        this.handoverManager = new HandoverManager(this);
        this.handoverManager.initialize();
        this.handoverManager.startSession();
        
        // Set initial stage
        this.handoverManager.setStage('GamePreparation');
        
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        this.msg_text = this.add.text(512, 384, 'Handover System Active\nCurrent Stage: ' + this.handoverManager.getCurrentStage()?.name, {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        });
        this.msg_text.setOrigin(0.5);

        // Use Handover to manage allowed actions
        this.input.once('pointerdown', () => {
            // Check if action is allowed in current stage
            this.handoverManager.performAction('fire', () => {
                // Advance to next stage before transitioning
                this.handoverManager.setStage('LevelComplete');
                this.scene.start('GameOver');
            });
        });
    }
    
    update() {
        // Update stage display if needed
        if (this.handoverManager && this.msg_text) {
            const currentStage = this.handoverManager.getCurrentStage();
            if (currentStage) {
                this.msg_text.setText('Handover System Active\nCurrent Stage: ' + currentStage.name);
            }
        }
    }
}
