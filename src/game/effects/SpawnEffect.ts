import { Position } from '../../types'

/**
 * Renders a spawn effect - dark portal/glow that appears when enemy spawns.
 * Features swirling particles converging to center.
 * 
 * @param ctx - Canvas 2D rendering context
 * @param x - Center x position in pixels
 * @param y - Center y position in pixels
 * @param progress - Animation progress from 0 to 1
 */
export const renderSpawnEffect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number
): void => {
  // Clamp progress to valid range
  const t = Math.max(0, Math.min(1, progress))
  
  
  // Radius shrinks as effect progresses (portal closing)
  const maxRadius = 30
  const minRadius = 8
  const currentRadius = maxRadius - (maxRadius - minRadius) * t
  
  // Alpha fades as effect completes
  const alpha = 1 - t * 0.6
  
  // Draw outer glow (purple aura)
  const outerGradient = ctx.createRadialGradient(x, y, 0, x, y, currentRadius * 1.8)
  outerGradient.addColorStop(0, `rgba(139, 92, 246, ${alpha * 0.4})`)
  outerGradient.addColorStop(0.6, `rgba(88, 28, 135, ${alpha * 0.2})`)
  outerGradient.addColorStop(1, 'rgba(88, 28, 135, 0)')
  
  ctx.beginPath()
  ctx.arc(x, y, currentRadius * 1.8, 0, Math.PI * 2)
  ctx.fillStyle = outerGradient
  ctx.fill()
  
  // Draw inner portal (dark purple/black center)
  const innerGradient = ctx.createRadialGradient(x, y, 0, x, y, currentRadius)
  innerGradient.addColorStop(0, `rgba(15, 10, 35, ${alpha})`)
  innerGradient.addColorStop(0.5, `rgba(55, 20, 100, ${alpha * 0.8})`)
  innerGradient.addColorStop(1, `rgba(139, 92, 246, ${alpha * 0.3})`)
  
  ctx.beginPath()
  ctx.arc(x, y, currentRadius, 0, Math.PI * 2)
  ctx.fillStyle = innerGradient
  ctx.fill()
  
  // Draw portal ring
  ctx.beginPath()
  ctx.arc(x, y, currentRadius, 0, Math.PI * 2)
  ctx.strokeStyle = `rgba(167, 139, 250, ${alpha * 0.6})`
  ctx.lineWidth = 2 + (1 - t) * 2
  ctx.stroke()
  
  // Draw swirling particles converging to center
  const particleCount = 12
  for (let i = 0; i < particleCount; i++) {
    const baseAngle = (i / particleCount) * Math.PI * 2
    // Swirl effect: particles spiral inward
    const swirlAngle = baseAngle + t * Math.PI * 2
    // Particles start at edge and converge to center
    const particleDist = currentRadius * (0.3 + (1 - t) * 0.7)
    const px = x + Math.cos(swirlAngle) * particleDist
    const py = y + Math.sin(swirlAngle) * particleDist
    
    // Particle size shrinks as they converge
    const particleSize = 3 * (0.3 + (1 - t) * 0.7)
    
    ctx.beginPath()
    ctx.arc(px, py, particleSize, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(196, 181, 253, ${alpha * 0.8})`
    ctx.fill()
  }
  
  // Draw center glow (bright spot where enemy appears)
  if (t < 0.5) {
    const centerGlowRadius = 8 * (1 - t * 2)
    const centerGradient = ctx.createRadialGradient(x, y, 0, x, y, centerGlowRadius)
    centerGradient.addColorStop(0, `rgba(255, 255, 255, ${(0.5 - t) * 2})`)
    centerGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    
    ctx.beginPath()
    ctx.arc(x, y, centerGlowRadius, 0, Math.PI * 2)
    ctx.fillStyle = centerGradient
    ctx.fill()
  }
  
  // Draw energy crackling effect
  if (t < 0.7) {
    const crackCount = 4
    for (let i = 0; i < crackCount; i++) {
      const angle = (i / crackCount) * Math.PI * 2 + t * 3
      const startDist = currentRadius * 0.2
      const endDist = currentRadius * (0.8 + Math.random() * 0.2)
      
      ctx.beginPath()
      ctx.moveTo(
        x + Math.cos(angle) * startDist,
        y + Math.sin(angle) * startDist
      )
      // Jagged line for electricity effect
      const segments = 3
      for (let j = 1; j <= segments; j++) {
        const segT = j / segments
        const segDist = startDist + (endDist - startDist) * segT
        const jitter = (Math.random() - 0.5) * 6 * (1 - t)
        ctx.lineTo(
          x + Math.cos(angle) * segDist + Math.sin(angle) * jitter,
          y + Math.sin(angle) * segDist - Math.cos(angle) * jitter
        )
      }
      ctx.strokeStyle = `rgba(196, 181, 253, ${alpha * 0.5 * (1 - t)})`
      ctx.lineWidth = 1.5
      ctx.stroke()
    }
  }
}

/**
 * Creates spawn effect data for tracking in game state
 */
export interface SpawnEffectData {
  x: number
  y: number
  progress: number
  duration: number
}

/**
 * Default duration for spawn effect in seconds
 */
export const SPAWN_EFFECT_DURATION = 0.8
