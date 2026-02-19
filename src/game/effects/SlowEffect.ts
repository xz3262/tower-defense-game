import { Position } from '../../types'

/**
 * Renders a slow effect with blue/white snowflake particles swirling around the position.
 * Used to indicate an enemy is slowed.
 * 
 * @param ctx - Canvas 2D rendering context
 * @param x - X position in pixels
 * @param y - Y position in pixels
 * @param progress - Animation progress from 0 to 1
 */
export const renderSlowEffect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number
): void => {
  const particleCount = 8
  const baseRadius = 15
  const alpha = 1 - progress
  
  // Draw swirling snowflake particles
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2 + progress * Math.PI * 2
    const radius = baseRadius * (0.5 + progress * 0.5)
    const px = x + Math.cos(angle) * radius
    const py = y + Math.sin(angle) * radius
    
    // Alternate between blue and white colors
    const isWhite = i % 2 === 0
    const color = isWhite 
      ? `rgba(255, 255, 255, ${alpha * 0.8})` 
      : `rgba(103, 232, 249, ${alpha * 0.7})`
    
    // Draw snowflake particle
    drawSnowflakeParticle(ctx, px, py, 3, color, alpha)
  }
  
  // Draw inner glow effect
  const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, baseRadius * 1.5)
  glowGradient.addColorStop(0, `rgba(103, 232, 249, ${alpha * 0.3})`)
  glowGradient.addColorStop(0.5, `rgba(103, 232, 249, ${alpha * 0.15})`)
  glowGradient.addColorStop(1, 'rgba(103, 232, 249, 0)')
  
  ctx.beginPath()
  ctx.arc(x, y, baseRadius * 1.5, 0, Math.PI * 2)
  ctx.fillStyle = glowGradient
  ctx.fill()
}

/**
 * Draws a single snowflake particle with 6 arms
 */
const drawSnowflakeParticle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  alpha: number
): void => {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(Date.now() / 500) // Slow rotation
  
  ctx.strokeStyle = color
  ctx.lineWidth = 1.5
  ctx.globalAlpha = alpha
  
  // Draw 6 arms of the snowflake
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2
    const endX = Math.cos(angle) * size
    const endY = Math.sin(angle) * size
    
    // Main arm
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(endX, endY)
    ctx.stroke()
    
    // Small branches on each arm
    const branchLength = size * 0.4
    const branchStart = size * 0.3
    const branchAngle = Math.PI / 4
    
    const bx = Math.cos(angle) * branchStart
    const by = Math.sin(angle) * branchStart
    
    ctx.beginPath()
    ctx.moveTo(bx, by)
    ctx.lineTo(
      bx + Math.cos(angle + branchAngle) * branchLength,
      by + Math.sin(angle + branchAngle) * branchLength
    )
    ctx.moveTo(bx, by)
    ctx.lineTo(
      bx + Math.cos(angle - branchAngle) * branchLength,
      by + Math.sin(angle - branchAngle) * branchLength
    )
    ctx.stroke()
  }
  
  // Center dot
  ctx.beginPath()
  ctx.arc(0, 0, 1, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()
  
  ctx.restore()
}

/**
 * Renders a slow effect at a position with custom radius
 */
export const renderSlowEffectWithRadius = (
  ctx: CanvasRenderingContext2D,
  position: Position,
  progress: number,
  radius: number = 20
): void => {
  const particleCount = Math.floor(6 + radius / 5)
  const alpha = 1 - progress
  
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2 + progress * Math.PI * 3
    const dist = radius * (0.3 + progress * 0.7)
    const px = position.x + Math.cos(angle) * dist
    const py = position.y + Math.sin(angle) * dist
    
    const isWhite = i % 3 === 0
    const color = isWhite 
      ? `rgba(255, 255, 255, ${alpha * 0.9})` 
      : isWhite === false
        ? `rgba(103, 232, 249, ${alpha * 0.8})`
        : `rgba(245, 249, 252, ${alpha * 0.7})`
    
    const size = 2 + Math.random() * 2
    drawSnowflakeParticle(ctx, px, py, size, color, alpha)
  }
}
