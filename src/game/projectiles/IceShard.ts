import { StatusEffect } from '../../types'

// Ice shard projectile stats
const ICE_SHARD_COLOR = '#67e8f9'
const ICE_SHARD_DARK = '#0891b2'
const ICE_SHARD_GLOW = 'rgba(103, 232, 249, 0.4)'
const SPARKLE_COLOR = '#ffffff'
const SHARD_SIZE = 8

/**
 * Creates a slow status effect for ice shard hits
 */
export const createIceShardEffect = (sourceId: string): StatusEffect => ({
  type: 'slow',
  duration: 2,
  magnitude: 0.4, // 40% slow
  sourceId
})

/**
 * Renders an ice shard projectile
 * @param ctx - Canvas rendering context
 * @param x - X position in pixels
 * @param y - Y position in pixels
 * @param angle - Movement angle in radians
 */
export const renderIceShard = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number
): void => {
  // Draw glow effect behind the shard
  const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, SHARD_SIZE * 2)
  glowGradient.addColorStop(0, ICE_SHARD_GLOW)
  glowGradient.addColorStop(1, 'rgba(103, 232, 249, 0)')
  
  ctx.beginPath()
  ctx.arc(x, y, SHARD_SIZE * 2, 0, Math.PI * 2)
  ctx.fillStyle = glowGradient
  ctx.fill()

  // Draw sparkle trail (behind the shard)
  drawSparkleTrail(ctx, x, y, angle)

  // Draw the crystal shard body
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle)

  // Main crystal shape (faceted diamond)
  ctx.beginPath()
  ctx.moveTo(SHARD_SIZE, 0)           // Tip
  ctx.lineTo(SHARD_SIZE * 0.3, -SHARD_SIZE * 0.6)  // Top left
  ctx.lineTo(-SHARD_SIZE * 0.5, 0)    // Back
  ctx.lineTo(SHARD_SIZE * 0.3, SHARD_SIZE * 0.6)   // Bottom left
  ctx.closePath()
  
  // Fill with gradient
  const crystalGradient = ctx.createLinearGradient(-SHARD_SIZE, 0, SHARD_SIZE, 0)
  crystalGradient.addColorStop(0, ICE_SHARD_DARK)
  crystalGradient.addColor = ctx1)
  ctx.fillStyle = crystalGradient
  ctx.fill()
  
  // Crystal outline
  ctx.strokeStyle = ICE_SHARD_COLOR
  ctx.lineWidth = 1.5
  ctx.stroke()
  
  // Inner facet (highlight)
  ctx.beginPath()
  ctx.moveTo(SHARD_SIZE * 0.5, 0)
  ctx.lineTo(SHARD_SIZE * 0.1, -SHARD_SIZE * 0.3)
  ctx.lineTo(-SHARD_SIZE * 0.2, 0)
  ctx.lineTo(SHARD_SIZE * 0.1, SHARD_SIZE * 0.3)
  ctx.closePath()
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
  ctx.fill()
  
  // Center highlight
  ctx.beginPath()
  ctx.arc(SHARD_SIZE * 0.2, 0, 2, 0, Math.PI * 2)
  ctx.fillStyle = SPARKLE_COLOR
  ctx.fill()
  
  ctx.restore()
  
  // Draw front sparkles
  drawSparkles(ctx, x, y)
}

/**
 * Draws sparkle trail behind the ice shard
 */
const drawSparkleTrail = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number
): void => {
  const trailLength = 20
  const trailCount = 4
  
  for (let i = 0; i < trailCount; i++) {
    const t = (i + 1) / trailCount
    const distance = trailLength * t
    const sparkleX = x - Math.cos(angle) * distance
    const sparkleY = y - Math.sin(angle) * distance
    const size = 2 * (1 - t)
    const alpha = 0.6 * (1 - t)
    
    ctx.beginPath()
    ctx.arc(sparkleX, sparkleY, size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
    ctx.fill()
  }
}

/**
 * Draws sparkle effects around the shard
 */
const drawSparkles = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
): void => {
  const time = Date.now() / 100
  const sparklePositions = [
    { offsetX: 4, offsetY: -3 },
    { offsetX: -2, offsetY: 4 },
    { offsetX: -4, offsetY: -2 }
  ]
  
  for (let i = 0; i < sparklePositions.length; i++) {
    const pos = sparklePositions[i]
    const twinkle = Math.sin(time + i * 2) * 0.5 + 0.5
    const size = 1 + twinkle * 1.5
    
    ctx.beginPath()
    ctx.arc(x + pos.offsetX, y + pos.offsetY, size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + twinkle * 0.4})`
    ctx.fill()
  }
}

/**
 * Renders the impact effect when ice shard hits an enemy
 */
export const renderIceShardImpact = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number // 0-1, where 1 is fully faded
): void => {
  const alpha = 1 - progress
  const radius = 15 + progress * 20
  
  // Outer ring
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.strokeStyle = `rgba(103, 232, 249, ${alpha * 0.5})`
  ctx.lineWidth = 2
  ctx.stroke()
  
  // Inner burst
  const burstCount = 6
  for (let i = 0; i < burstCount; i++) {
    const angle = (i / burstCount) * Math.PI * 2
    const burstLength = 10 + progress * 15
    const startX = x + Math.cos(angle) * 5
    const startY = y + Math.sin(angle) * 5
    const endX = x + Math.cos(angle) * burstLength
    const endY = y + Math.sin(angle) * burstLength
    
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`
    ctx.lineWidth = 2
    ctx.stroke()
  }
  
  // Center impact
  ctx.beginPath()
  ctx.arc(x, y, 5 * (1 - progress), 0, Math.PI * 2)
  ctx.fillStyle = `rgba(103, 232, 249, ${alpha})`
  ctx.fill()
}
