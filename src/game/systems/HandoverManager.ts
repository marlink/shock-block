import { Scene } from 'phaser';
import { Handover, Session, Stage } from './Handover';
import { HandoverFactory } from './HandoverFactory';

/**
 * HandoverManager - Integrates the Handover system with Phaser scenes
 */
export class HandoverManager {
  private scene: Scene;
  private handover: Handover;
  private sessionId: string;
  private currentSession: Session | null;
  
  constructor(scene: Scene) {
    this.scene = scene;
    this.handover = Handover.getInstance();
    this.sessionId = `session_${Date.now()}`;
    this.currentSession = null;
    
    // Listen for scene events
    this.setupEventListeners();
  }
  
  /**
   * Initialize the Handover system with the main game roadmap
   */
  public initialize(): void {
    // Initialize with the main game roadmap if not already initialized
    if (!this.handover.getCurrentSession()) {
      const roadmap = HandoverFactory.createGameRoadmap();
      this.handover.initialize(roadmap);
    }
  }
  
  /**
   * Start a new session
   */
  public startSession(): Session | null {
    this.currentSession = this.handover.startSession(this.sessionId);
    return this.currentSession;
  }
  
  /**
   * End the current session
   */
  public endSession(): void {
    this.handover.endSession();
  }
  
  /**
   * Set the current stage by name
   */
  public setStage(stageName: string): boolean {
    return this.handover.setStage(stageName);
  }
  
  /**
   * Advance to the next stage in the roadmap
   */
  public advanceStage(): boolean {
    return this.handover.advanceStage();
  }
  
  /**
   * Get the current stage
   */
  public getCurrentStage(): Stage | null {
    return this.handover.getCurrentStage();
  }
  
  /**
   * Get the current session
   */
  public getCurrentSession(): Session | null {
    return this.handover.getCurrentSession();
  }
  
  /**
   * Check if an action is allowed in the current stage
   */
  public isActionAllowed(action: string): boolean {
    return this.handover.isActionAllowed(action);
  }
  
  /**
   * Perform an action if it's allowed in the current stage
   */
  public performAction(action: string, callback: Function): boolean {
    if (this.isActionAllowed(action)) {
      callback();
      return true;
    } else {
      console.warn(`Action '${action}' is not allowed in the current stage`);
      return false;
    }
  }
  
  /**
   * Setup event listeners for scene events
   */
  private setupEventListeners(): void {
    // Listen for scene shutdown to end session if needed
    this.scene.events.once('shutdown', () => {
      // End the session when the scene shuts down
      if (this.handover.getCurrentSession()) {
        this.endSession();
      }
    });
    
    // Listen for stage changes
    this.scene.events.on('handover-stage-changed', (data: { previous: Stage | null, current: Stage }) => {
      console.log(`Stage changed: ${data.previous?.name || 'none'} -> ${data.current.name}`);
      
      // Emit a scene-specific event for the new stage
      this.scene.events.emit(`stage-${data.current.name}`, data.current);
    });
  }
  
  /**
   * Get the current session state
   */
  public getSessionState(key: string): any {
    const session = this.handover.getCurrentSession();
    return session ? session.getState(key) : null;
  }
  
  /**
   * Set the current session state
   */
  public setSessionState(key: string, value: any): void {
    const session = this.handover.getCurrentSession();
    if (session) {
      session.setState(key, value);
    }
  }
}