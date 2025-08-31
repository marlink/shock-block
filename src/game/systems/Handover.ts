/**
 * Handover System - Core implementation
 * 
 * A singleton system for managing game sessions, roadmap progression, and stage transitions.
 */

/**
 * Session - Represents a game session with a roadmap and current stage
 */
export class Session {
  private id: string;
  private roadmap: Roadmap;
  private currentStageIndex: number;
  private state: Record<string, any>;
  
  constructor(id: string, roadmap: Roadmap) {
    this.id = id;
    this.roadmap = roadmap;
    this.currentStageIndex = 0;
    this.state = {};
  }
  
  /**
   * Get the session ID
   */
  public getId(): string {
    return this.id;
  }
  
  /**
   * Get the current stage
   */
  public getCurrentStage(): Stage | null {
    if (this.roadmap.stages.length === 0) {
      return null;
    }
    
    return this.roadmap.stages[this.currentStageIndex];
  }
  
  /**
   * Advance to the next stage
   */
  public advanceStage(): boolean {
    if (this.currentStageIndex < this.roadmap.stages.length - 1) {
      this.currentStageIndex++;
      return true;
    }
    return false;
  }
  
  /**
   * Set the current stage by index
   */
  public setStage(index: number): boolean {
    if (index >= 0 && index < this.roadmap.stages.length) {
      this.currentStageIndex = index;
      return true;
    }
    return false;
  }
  
  /**
   * Set the current stage by name
   */
  public setStageByName(name: string): boolean {
    const index = this.roadmap.stages.findIndex(stage => stage.name === name);
    if (index !== -1) {
      this.currentStageIndex = index;
      return true;
    }
    return false;
  }
  
  /**
   * Get the session state
   */
  public getState(key: string): any {
    return this.state[key];
  }
  
  /**
   * Set the session state
   */
  public setState(key: string, value: any): void {
    this.state[key] = value;
  }
}

/**
 * Stage - Represents a stage in the roadmap with allowed actions
 */
export class Stage {
  public name: string;
  public allowedActions: string[];
  public metadata: Record<string, any>;
  
  constructor(name: string, allowedActions: string[] = [], metadata: Record<string, any> = {}) {
    this.name = name;
    this.allowedActions = allowedActions;
    this.metadata = metadata;
  }
  
  /**
   * Check if an action is allowed in this stage
   */
  public isActionAllowed(action: string): boolean {
    return this.allowedActions.includes(action);
  }
  
  /**
   * Get metadata value
   */
  public getMetadata(key: string): any {
    return this.metadata[key];
  }
}

/**
 * Roadmap - Represents a sequence of stages
 */
export class Roadmap {
  public name: string;
  public stages: Stage[];
  public metadata: Record<string, any>;
  
  constructor(name: string, stages: Stage[] = [], metadata: Record<string, any> = {}) {
    this.name = name;
    this.stages = stages;
    this.metadata = metadata;
  }
  
  /**
   * Add a stage to the roadmap
   */
  public addStage(stage: Stage): void {
    this.stages.push(stage);
  }
  
  /**
   * Get metadata value
   */
  public getMetadata(key: string): any {
    return this.metadata[key];
  }
}

/**
 * Handover - Singleton class for managing game sessions and roadmaps
 */
export class Handover {
  private static instance: Handover;
  private initialized: boolean;
  private defaultRoadmap: Roadmap | null;
  private sessions: Map<string, Session>;
  private currentSessionId: string | null;
  
  private constructor() {
    this.initialized = false;
    this.defaultRoadmap = null;
    this.sessions = new Map<string, Session>();
    this.currentSessionId = null;
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): Handover {
    if (!Handover.instance) {
      Handover.instance = new Handover();
    }
    return Handover.instance;
  }
  
  /**
   * Initialize the Handover system with a default roadmap
   */
  public initialize(roadmap: Roadmap): void {
    this.defaultRoadmap = roadmap;
    this.initialized = true;
  }
  
  /**
   * Check if the system is initialized
   */
  public isInitialized(): boolean {
    return this.initialized;
  }
  
  /**
   * Start a new session
   */
  public startSession(sessionId: string, roadmap?: Roadmap): Session | null {
    if (!this.initialized) {
      console.error('Handover system not initialized');
      return null;
    }
    
    const sessionRoadmap = roadmap || this.defaultRoadmap;
    if (!sessionRoadmap) {
      console.error('No roadmap provided for session');
      return null;
    }
    
    const session = new Session(sessionId, sessionRoadmap);
    this.sessions.set(sessionId, session);
    this.currentSessionId = sessionId;
    
    return session;
  }
  
  /**
   * End a session
   * @param sessionId Optional session ID. If not provided, ends the current session.
   */
  public endSession(sessionId?: string): boolean {
    const idToEnd = sessionId || this.currentSessionId;
    
    if (idToEnd && this.sessions.has(idToEnd)) {
      this.sessions.delete(idToEnd);
      
      if (this.currentSessionId === idToEnd) {
        this.currentSessionId = null;
      }
      
      return true;
    }
    return false;
  }
  
  /**
   * Get the current session
   */
  public getCurrentSession(): Session | null {
    if (!this.currentSessionId) {
      return null;
    }
    
    return this.sessions.get(this.currentSessionId) || null;
  }
  
  /**
   * Set the current session
   */
  public setCurrentSession(sessionId: string): boolean {
    if (this.sessions.has(sessionId)) {
      this.currentSessionId = sessionId;
      return true;
    }
    return false;
  }
  
  /**
   * Get a session by ID
   */
  public getSession(sessionId: string): Session | null {
    return this.sessions.get(sessionId) || null;
  }
  
  /**
   * Get the current stage
   */
  public getCurrentStage(): Stage | null {
    const session = this.getCurrentSession();
    if (!session) {
      return null;
    }
    
    return session.getCurrentStage();
  }
  
  /**
   * Check if an action is allowed in the current stage
   */
  public isActionAllowed(action: string): boolean {
    const stage = this.getCurrentStage();
    if (!stage) {
      return false;
    }
    
    return stage.isActionAllowed(action);
  }
  
  /**
   * Advance to the next stage
   */
  public advanceStage(): boolean {
    const session = this.getCurrentSession();
    if (!session) {
      return false;
    }
    
    return session.advanceStage();
  }
  
  /**
   * Set the current stage by index
   */
  public setStage(index: number): boolean {
    const session = this.getCurrentSession();
    if (!session) {
      return false;
    }
    
    return session.setStage(index);
  }
  
  /**
   * Set the current stage by name
   */
  public setStageByName(name: string): boolean {
    const session = this.getCurrentSession();
    if (!session) {
      return false;
    }
    
    return session.setStageByName(name);
  }
  
  /**
   * Set the current stage by name or index
   */
  public setStage(nameOrIndex: string | number): boolean {
    if (typeof nameOrIndex === 'string') {
      return this.setStageByName(nameOrIndex);
    } else {
      const session = this.getCurrentSession();
      if (!session) {
        return false;
      }
      return session.setStage(nameOrIndex);
    }
  }
}