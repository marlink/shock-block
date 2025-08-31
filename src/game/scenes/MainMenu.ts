import { Scene, GameObjects } from 'phaser';
import { HandoverManager } from '../systems/HandoverManager';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    handoverManager: HandoverManager;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        // Initialize Handover system
        this.handoverManager = new HandoverManager(this);
        this.handoverManager.initialize();
        this.handoverManager.startSession();
        
        // Set initial stage for main menu
        this.handoverManager.setStage('MainMenu');
        
        this.background = this.add.image(512, 384, 'background');

        this.logo = this.add.image(512, 300, 'logo');

        this.title = this.add.text(512, 460, 'Main Menu - Handover Active', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        // Add stage info text
        const stageText = this.add.text(512, 520, 'Current Stage: ' + this.handoverManager.getCurrentStage()?.name, {
            fontFamily: 'Arial', fontSize: 24, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);

        // Use Handover to manage allowed actions
        this.input.once('pointerdown', () => {
            // Check if action is allowed in current stage
            this.handoverManager.performAction('startGame', () => {
                this.scene.start('Game');
            });
        });
    }
}
