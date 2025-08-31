# Troubleshooting Guide

## Quick Reference

### Emergency Contacts
- **Lead Developer**: [Contact Info]
- **QA Lead**: [Contact Info]
- **DevOps**: [Contact Info]

### Common Quick Fixes
| Issue | Quick Fix | Time Estimate |
|-------|-----------|---------------|
| Game won't start | Check `GameConfig` parameters | 2 minutes |
| Physics not working | Verify Matter.js initialization | 5 minutes |
| Blocks not spawning | Check level configuration | 3 minutes |
| Input not responding | Validate HandoverManager setup | 5 minutes |
| Performance drops | Check particle system settings | 10 minutes |

## System-Specific Troubleshooting

### Input System Issues

#### Problem: Input events not firing
**Symptoms:**
- No response to keyboard/mouse input
- Debug logs show no input events
- Systems appear to ignore user actions

**Diagnostic Steps:**
```typescript
// Check input system initialization
console.log('InputSystem initialized:', inputSystem instanceof InputSystem);
console.log('HandoverManager available:', handoverManager !== null);

// Verify event listeners
console.log('Active listeners:', scene.input.events.eventNames());

// Test direct input
scene.input.keyboard.on('keydown-SPACE', () => {
  console.log('Space key detected');
});
```

**Solutions:**
1. **Verify HandoverManager injection**
   ```typescript
   // Ensure HandoverManager is passed to all systems
   const inputSystem = new InputSystem(scene, handoverManager, settings);
   const shotSystem = new ShotSystem(scene, handoverManager);
   const aimSystem = new AimSystem(scene, handoverManager);
   ```

2. **Check event name consistency**
   ```typescript
   // Ensure consistent event naming across systems
   const INPUT_EVENTS = {
     CHARGE_START: 'input-charge-start',
     FIRE: 'input-fire',
     AIM_LEFT: 'input-aim-left',
     AIM_RIGHT: 'input-aim-right'
   };
   ```

3. **Validate settings configuration**
   ```typescript
   // Check if input is disabled in settings
   if (settings.input.enabled === false) {
     console.warn('Input disabled in settings');
   }
   ```

#### Problem: Input debouncing not working
**Symptoms:**
- Multiple rapid inputs processed
- Cooldown system appears ineffective
- Unexpected behavior with fast clicking

**Diagnostic Steps:**
```typescript
// Check cooldown state
console.log('Cooldown state:', inputSystem.getInputState().cooldowns);

// Test cooldown timing
const start = Date.now();
inputSystem.handleInput('fire');
console.log('Cooldown set at:', Date.now() - start);
```

**Solutions:**
1. **Adjust cooldown timing**
   ```typescript
   const COOLDOWN_TIMES = {
     fire: 500,      // 500ms between shots
     aim: 100,       // 100ms between aim changes
     pause: 1000     // 1s between pause toggles
   };
   ```

2. **Verify system clock**
   ```typescript
   // Ensure consistent timing across systems
   const now = Date.now();
   if (Math.abs(now - performance.now()) > 1000) {
     console.warn('Clock drift detected');
   }
   ```

### Physics System Issues

#### Problem: Collision detection failing
**Symptoms:**
- Objects pass through each other
- No collision events fired
- Blocks not being destroyed

**Diagnostic Steps:**
```typescript
// Check physics world initialization
console.log('Physics world:', scene.matter.world);
console.log('Bodies in world:', scene.matter.world.bodies.length);

// Test collision callback
scene.matter.world.on('collisionstart', (event) => {
  console.log('Collision detected:', event.pairs.length);
});
```

**Solutions:**
1. **Verify Matter.js setup**
   ```typescript
   // Ensure physics config is correct
   const config = {
     type: Phaser.AUTO,
     physics: {
       default: 'matter',
       matter: {
         gravity: { y: 0 },
         debug: true // Enable for debugging
       }
     }
   };
   ```

2. **Check collision categories**
   ```typescript
   // Ensure collision masks are set
   const blockBody = this.matter.add.rectangle(x, y, width, height, {
     collisionFilter: {
       category: 0x0001,
       mask: 0x0002
     }
   });
   ```

3. **Verify body creation**
   ```typescript
   // Check if bodies are actually created
   const bodies = this.matter.world.bodies;
   if (bodies.length === 0) {
     console.error('No physics bodies created');
   }
   ```

#### Problem: Force calculation incorrect
**Symptoms:**
- Blocks require too much/little force to destroy
- Inconsistent destruction behavior
- Physics feels unrealistic

**Diagnostic Steps:**
```typescript
// Log force calculations
console.log('Mass:', body.mass);
console.log('Velocity:', body.velocity.length());
console.log('Calculated force:', 0.5 * body.mass * Math.pow(body.velocity.length(), 2));
```

**Solutions:**
1. **Adjust force thresholds**
   ```typescript
   const FORCE_THRESHOLDS = {
     [BlockType.NORMAL]: 50,
     [BlockType.MULTIPLIER]: 100,
     [BlockType.EXPLOSIVE]: 200,
     [BlockType.INDESTRUCTIBLE]: Infinity
   };
   ```

2. **Validate velocity calculations**
   ```typescript
   // Ensure velocity is in correct units
   const pixelsPerSecond = body.velocity.length() * 60; // Convert from per-frame
   console.log('Velocity (px/s):', pixelsPerSecond);
   ```

### Block System Issues

#### Problem: Blocks not appearing
**Symptoms:**
- No visual blocks on screen
- Blocks created but invisible
- Console shows blocks created but not rendered

**Diagnostic Steps:**
```typescript
// Check block creation
console.log('Blocks created:', blockSystem.getAllBlocks().length);

// Verify sprite creation
const blocks = blockSystem.getAllBlocks();
blocks.forEach(block => {
  console.log('Block visible:', block.sprite.visible);
  console.log('Block position:', block.sprite.x, block.sprite.y);
  console.log('Block texture:', block.sprite.texture.key);
});
```

**Solutions:**
1. **Check texture loading**
   ```typescript
   // Ensure textures are loaded
   scene.load.image('block-red', 'assets/blocks/red.png');
   scene.load.on('complete', () => {
     console.log('Textures loaded');
   });
   ```

2. **Verify sprite positioning**
   ```typescript
   // Check if blocks are off-screen
   const camera = scene.cameras.main;
   blocks.forEach(block => {
     const bounds = camera.getBounds();
     if (!Phaser.Geom.Rectangle.Contains(bounds, block.sprite.x, block.sprite.y)) {
       console.warn('Block off-screen:', block.sprite.x, block.sprite.y);
     }
   });
   ```

#### Problem: Block destruction not working
**Symptoms:**
- Blocks don't disappear when hit
- No destruction effects
- Score not updated

**Diagnostic Steps:**
```typescript
// Check destruction logic
console.log('Block health:', block.health);
console.log('Force applied:', force);
console.log('Destruction threshold:', block.maxHealth);

// Test manual destruction
blockSystem.destroyBlock('test-block', 1000);
console.log('Block exists after destruction:', blockSystem.getBlock('test-block'));
```

**Solutions:**
1. **Verify destruction sequence**
   ```typescript
   // Ensure proper destruction flow
   if (force >= block.health) {
     // Remove physics body
     scene.matter.world.remove(block.body);
     
     // Destroy sprite
     block.sprite.destroy();
     
     // Remove from system
     blockSystem.removeBlock(block.id);
   }
   ```

2. **Check event propagation**
   ```typescript
   // Ensure events are being emitted
   blockSystem.on('block-destroyed', (data) => {
     console.log('Block destroyed event:', data);
   });
   ```

### Performance Issues

#### Problem: FPS drops below 60
**Symptoms:**
- Choppy gameplay
- Input lag
- Browser warnings about performance

**Diagnostic Steps:**
```typescript
// Monitor FPS
let lastTime = 0;
let frameCount = 0;
scene.game.loop.events.on('poststep', () => {
  const now = performance.now();
  const fps = 1000 / (now - lastTime);
  console.log('FPS:', Math.round(fps));
  lastTime = now;
});

// Check active objects
console.log('Active sprites:', scene.children.list.length);
console.log('Physics bodies:', scene.matter.world.bodies.length);
console.log('Active particles:', particleSystem.getActiveParticles());
```

**Solutions:**
1. **Optimize particle systems**
   ```typescript
   // Limit particle count
   const MAX_PARTICLES = 100;
   if (particleSystem.getActiveParticles() > MAX_PARTICLES) {
     particleSystem.clearOldParticles();
   }
   ```

2. **Implement object pooling**
   ```typescript
   // Reuse objects instead of creating new ones
   class BlockPool {
     private pool: Block[] = [];
     
     getBlock(): Block {
       return this.pool.pop() || this.createNewBlock();
     }
     
     returnBlock(block: Block): void {
       this.pool.push(block);
     }
   }
   ```

3. **Reduce physics complexity**
   ```typescript
   // Disable physics for off-screen objects
   blocks.forEach(block => {
     if (!camera.worldView.contains(block.sprite.x, block.sprite.y)) {
       block.body.isStatic = true;
     }
   });
   ```

#### Problem: Memory leaks
**Symptoms:**
- Increasing memory usage over time
- Browser crashes after extended play
- Performance degradation

**Diagnostic Steps:**
```typescript
// Monitor memory usage
setInterval(() => {
  if (performance.memory) {
    console.log('Memory usage:', 
      (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2), 'MB');
  }
}, 5000);

// Check for unreleased objects
console.log('Active game objects:', scene.sys.updateList.length);
console.log('Active display objects:', scene.sys.displayList.length);
```

**Solutions:**
1. **Proper cleanup on scene shutdown**
   ```typescript
   scene.events.on('shutdown', () => {
     // Clean up all systems
     inputSystem.destroy();
     shotSystem.destroy();
     aimSystem.destroy();
     blockSystem.destroy();
     particleSystem.destroy();
     
     // Clear references
     this.children.removeAll();
     this.matter.world.removeAllBodies();
   });
   ```

2. **Event listener cleanup**
   ```typescript
   // Remove all event listeners
   scene.events.removeAllListeners();
   scene.input.keyboard.removeAllKeys();
   ```

### Save System Issues

#### Problem: Save data corrupted
**Symptoms:**
- Game won't load
- Progress lost
- Console shows JSON parse errors

**Diagnostic Steps:**
```typescript
// Check save data
const saveData = localStorage.getItem('mamba_kick_save');
console.log('Save data:', saveData);

// Validate JSON
try {
  const parsed = JSON.parse(saveData || '{}');
  console.log('Valid JSON:', parsed);
} catch (e) {
  console.error('Invalid JSON:', e);
}
```

**Solutions:**
1. **Implement data validation**
   ```typescript
   function validateSaveData(data: any): boolean {
     if (!data.version || !data.playerProgress) {
       return false;
     }
     
     // Check data integrity
     const expectedKeys = ['currentLevel', 'totalScore', 'highScores'];
     return expectedKeys.every(key => key in data.playerProgress);
   }
   ```

2. **Add backup system**
   ```typescript
   // Create automatic backups
   function createBackup(saveData: SaveData): void {
     const backup = {
       ...saveData,
       timestamp: new Date().toISOString(),
       checksum: calculateChecksum(saveData)
     };
     
     localStorage.setItem('mamba_kick_backup', JSON.stringify(backup));
   }
   ```

## Environment-Specific Issues

### Development Environment

#### Problem: Hot reload breaking game state
**Symptoms:**
- Game state inconsistent after reload
- Objects duplicated
- Memory accumulation

**Solutions:**
```typescript
// Add development cleanup
if (process.env.NODE_ENV === 'development') {
  window.addEventListener('beforeunload', () => {
    game.destroy(true);
  });
}
```

### Browser-Specific Issues

#### Chrome
- **Issue**: Performance profiler not showing data
- **Solution**: Enable "Preserve log" in DevTools

#### Firefox
- **Issue**: Memory usage appears higher
- **Solution**: Use about:memory for accurate measurement

#### Safari
- **Issue**: Audio not playing
- **Solution**: Check autoplay policy restrictions

### Mobile-Specific Issues

#### Problem: Touch input not working
**Symptoms:**
- No response to touch events
- Buttons not clickable
- Swipe gestures ignored

**Solutions:**
```typescript
// Enable touch input
scene.input.addPointer(2); // Support 2 touch points
scene.input.on('pointerdown', (pointer) => {
  console.log('Touch detected:', pointer.x, pointer.y);
});
```

#### Problem: Performance issues on mobile
**Symptoms:**
- Low FPS on mobile devices
- Input lag
- Battery drain

**Solutions:**
```typescript
// Optimize for mobile
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if (isMobile) {
  // Reduce particle count
  particleSystem.setMaxParticles(50);
  
  // Lower physics precision
  scene.matter.world.setBounds(0, 0, 800, 600, 1, true, true, true, true);
}
```

## Debugging Tools

### Browser DevTools

#### Performance Profiler
1. Open Chrome DevTools (F12)
2. Go to Performance tab
3. Record gameplay for 10 seconds
4. Analyze frame drops and memory usage

#### Memory Profiler
1. Open Memory tab
2. Take heap snapshot
3. Look for retained objects
4. Check for detached DOM nodes

### Game-Specific Debugging

#### Debug Overlay
```typescript
// Add debug overlay
class DebugOverlay extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    
    this.add(new Phaser.GameObjects.Text(scene, 10, 10, '', {
      fontSize: '12px',
      backgroundColor: '#000000',
      padding: { x: 5, y: 5 }
    }));
    
    scene.add.existing(this);
  }
  
  update() {
    const text = [
      `FPS: ${Math.round(this.scene.game.loop.actualFps)}`,
      `Objects: ${this.scene.children.list.length}`,
      `Bodies: ${this.scene.matter.world.bodies.length}`,
      `Memory: ${(performance.memory?.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`
    ].join('\n');
    
    (this.list[0] as Phaser.GameObjects.Text).setText(text);
  }
}
```

#### Debug Commands
```typescript
// Add console commands
(window as any).debug = {
  showPhysics: () => scene.matter.world.createDebugGraphic(),
  hidePhysics: () => scene.matter.world.debugGraphic.clear(),
  listBlocks: () => console.table(blockSystem.getAllBlocks()),
  clearSave: () => localStorage.removeItem('mamba_kick_save'),
  resetLevel: () => levelService.restartLevel()
};
```

## Common Error Messages

### "Cannot read property 'x' of undefined"
**Cause**: Trying to access properties of destroyed objects
**Solution**: Add null checks
```typescript
if (block && block.sprite && block.sprite.active) {
  // Safe to access properties
}
```

### "Maximum call stack size exceeded"
**Cause**: Infinite recursion in event handling
**Solution**: Check event listener loops
```typescript
// Avoid circular event dependencies
emitter.off('event-name', callback);
emitter.on('event-name', callback);
```

### "WebGL context lost"
**Cause**: GPU memory exhausted
**Solution**: Reduce texture memory usage
```typescript
// Use compressed textures
scene.load.image('texture', 'assets/texture.pvr');

// Implement texture cleanup
scene.textures.remove('unused-texture');
```

## Recovery Procedures

### Game State Recovery

#### Automatic Recovery
```typescript
class GameRecovery {
  static attemptRecovery(error: Error): boolean {
    try {
      // Save current state
      const emergencySave = saveService.createEmergencySave();
      
      // Reload core systems
      scene.scene.restart();
      
      // Restore state
      saveService.loadEmergencySave(emergencySave);
      
      return true;
    } catch (recoveryError) {
      console.error('Recovery failed:', recoveryError);
      return false;
    }
  }
}
```

#### Manual Recovery Steps
1. **Check browser console for errors**
2. **Verify save data integrity**
3. **Clear browser cache if necessary**
4. **Restart browser if persistent**
5. **Report bug with reproduction steps**

## Testing Checklist

### Before Each Release
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile devices
- [ ] Verify save/load functionality
- [ ] Check performance with 100+ blocks
- [ ] Test all input combinations
- [ ] Verify error handling
- [ ] Check memory usage over 30 minutes

### Daily Development Checks
- [ ] No console errors
- [ ] 60 FPS maintained
- [ ] Memory usage stable
- [ ] All systems responsive
- [ ] Save data valid
- [ ] No memory leaks

## Support Resources

### Documentation Links
- [Phaser 3 Debugging Guide](https://phaser.io/tutorials/debugging)
- [Matter.js Debugging](https://brm.io/matter-js/docs/classes/World.html)
- [Chrome DevTools Performance](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance)

### Community Support
- [Phaser Discord](https://discord.gg/phaser)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/phaser-framework)
- [Game Development Stack Exchange](https://gamedev.stackexchange.com/)

---

**Last Updated**: [Current Date]  
**Next Review**: [Weekly Review Date]  
**Version**: 1.0.0