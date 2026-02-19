import { Position } from '../../types'

/**
 * Renders an explosion effect at the given position.
 * The explosion consists of an expanding orange/yellow circle that fades out
 * as progress goes from 0 to 1, with particle fragments flying outward.
 * 
 * @param ctx - Canvas 2D rendering context
 * @param x - X position of the explosion center
 * @param y - Y position of the explosion center
 * @param radius - Maximum radius of the explosion at full progress
 * @param progress - Animation progress from 0 (start) to 1 (end)
 */
export const renderExplosion = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  progress: number
): void => {
  // Clamp progress to valid range
  const t = Math.max(0, Math.min(1, progress))
  
  // Calculate current radius based on progress (eases out)
  const easedProgress = 1 - Math.pow(1 - t, 3)
  const currentRadius = radius * easedProgress
  
  // Calculate alpha (fades out as progress increases)
  const alpha = 1 - t
  
  // Draw outer explosion ring (orange)
  ctx.beginPath()
  ctx.arc(x, y, currentRadius, 0, Math.PI * 2)
  ctx.fillStyle = `rgba(249, 115, 22, ${alpha * 0.4})`
  ctx.fill()
  
  // Draw inner explosion (yellow/orange gradient)
  const innerRadius = currentRadius * 0.7
  const gradient = ctx.createRadialGradient(
    x, y, 0,
    x, y, innerRadius
  )
  gradient.addColorStop(0, `rgba(251, 191, 36, ${alpha * 0.9})`)
  gradient.addColorStop(0.5, `rgba(249, 115, 22, ${alpha * 0.7})`)
  gradient.addColorStop(1, `rgba(220, 38, 38, ${alpha * 0.4})`)
  
  ctx.beginPath()
  ctx.arc(x, y, innerRadius, 0, Math.PI * 2)
  ctx.fillStyle = gradient
  ctx.fill()
  
  // Draw bright core
  const coreRadius = innerRadius * 0.3
  ctx.beginPath()
  ctx.arc(x, y, coreRadius, 0, Math.PI * 2)
  ctx.fillStyle = `rgba(254, 243, 199, ${alpha})`
  ctx.fill()
  
  // Draw particle fragments flying outward
  drawExplosionParticles(ctx, x, y, currentRadius, alpha, t)
  
  // Draw flash effect at the start
  if (t < 0.15) {
    const flashAlpha = (0.15 - t) / 0.15
    ctx.beginPath()
    ctx.arc(x, y, radius * 0.5, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha * 0.8})`
    ctx.fill()
  }
}

/**
 * Draws particle fragments that fly outward during the explosion
 */
const drawExplosionParticles = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  alpha: number,
  progress: number
): void => {
  const particleCount = 12
  
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2
    
    // Particles spread out as progress increases
    const particleDistance = radius * 0.8 * (0.3 + progress * 0.7)
    const px = x + Math.cos(angle) * particleDistance
    const py = y + Math.sin(angle) * particleDistance
    
    // Particle size decreases as it travels
    const particleSize = 4 * (1 - progress * 0.7)
    
    // Vary particle colors
    const colors = [
      `rgba(251, 191, 36, ${alpha})`,  // Yellow
      `rgba(249, 115, 22, ${alpha})`,  // Orange
      `rgba(220, 38, 38, ${alpha})`,    // Red
      `rgba(107, 114, 128, ${alpha})`   // Gray (debris)
    ]
    const colorIndex = i % colors.length
    
    ctx.beginPath()
    ctx.arc(px, py, particleSize, 0, Math.PI * 2)
    ctx.fillStyle = colors[colorIndex]
    ctx.fill()
  }
  
  // Add some smaller debris particles
  const debrisCount = 8
  for (let i = 0; i < debrisCount; i++) {
    const angle = (i / debrisCount) * Math.PI * 2 + Math.PI / debrisCount
    const debrisDistance = radius * 0.6 * (0.5 + progress * 0.5)
    const dx = x + Math.cos(angle) * debrisDistance
    const dy = y + Math.sin(angle) * debrisDistance
    const debrisSize = 2 * (1 - progress * 0.8)
    
    ctx.beginPath()
    ctx.arc(dx, dy, debrisSize, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(107, 114, 128, ${alpha * 0.7})`
    ctx.fill()
  }
}

/**
 * Creates explosion effect data for use in the game effect system
 */
export interface ExplosionEffectData {
  x: number
  y: number
  radius: number
  duration: number
  progress: number
}

/**
 * Creates a new explosion effect data object
 */
export const createExplosionEffect = (
  position: Position,
  radius: number = 30,
  duration: number = 0.5
): ExplosionEffectData => ({
  x: position.x,
  y: position.y,
  radius,
  duration,
  progress: 0
})