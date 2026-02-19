import { EnemyStats } from '../../types'
import { drawCircle, drawHealthBar } from '../../utils/canvas'

const FLYING_COLOR = '#67e8f9' // Light blue
const FLYING_SIZE = 10
const SHADOW_COLOR = 'rgba(0, 0, 0, 0.25)'
const HOVER_AMPLITUDE = 4
const HOVER_SPEED = 0.004

export const flyingEnemyStats: EnemyStats = {
  type: 'flying',
  name: 'Bat',
  maxHP: 80,
  speed: 1.5,
  reward: 20,
  armor: 0,
  isFlying: true,
  isBoss: false,
  color: FLYING_COLOR,
  size: FLYING_SIZE,
  special: 'Flies over obstacles'
}

export const renderFlyingEnemy = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  hp: number,
  maxHP: number
): void => {
  // Calculate hover offset using sine wave
  const hoverOffset = Math.sin(Date.now() * HOVER_SPEED) * HOVER_AMPLITUDE
  const renderY = y + hoverOffset

  // Draw shadow below the enemy (on the ground plane)
  const shadowScale = 1 - Math.abs(hoverOffset) / (HOVER_AMPLITUDE * 2)
  const shadowWidth = FLYING_SIZE * 1.5 * shadowScale
  const shadowHeight = FLYING_SIZE * 0.4 * shadowScale
  
  ctx.beginPath()
  ctx.ellipse(x, y + FLYING_SIZE + 4, shadowWidth, shadowHeight, 0, 0, Math.PI * 2)
  ctx.fillStyle = SHADOW_COLOR
  ctx.fill()

  // Draw diamond shape (flying enemy representation)
  const diamondSize = FLYING_SIZE
  
  ctx.beginPath()
  ctx.moveTo(x, renderY - diamondSize)      // Top
  ctx.lineTo(x + diamondSize, renderY)       // Right
  ctx.lineTo(x, renderY + diamondSize)       // Bottom
  ctx.lineTo(x - diamondSize, renderY)       // Left
  ctx.closePath()
  
  // Fill with light blue
  ctx.fillStyle = FLYING_COLOR
  ctx.fill()
  
  // Stroke with darker blue
  ctx.strokeStyle = '#0891b2'
  ctx.lineWidth = 2
  ctx.stroke()

  // Inner highlight for 3D effect
  const innerDiamondSize = diamondSize * 0.5
  ctx.beginPath()
  ctx.moveTo(x, renderY - innerDiamondSize)
  ctx.lineTo(x + innerDiamondSize, renderY)
  ctx.lineTo(x, renderY + innerDiamondSize)
  ctx.lineTo(x - innerDiamondSize, renderY)
  ctx.closePath()
  ctx.fillStyle = '#a5f3fc'
  ctx.fill()

  // Small center detail
  ctx.beginPath()
  ctx.arc(x, renderY, 2, 0, Math.PI * 2)
  ctx.fillStyle = '#164e63'
  ctx.fill()

  // Draw health bar above enemy
  const healthBarWidth = FLYING_SIZE * 2.5
  const healthBarHeight = 4
  const healthBarY = renderY - FLYING_SIZE - 12

  drawHealthBar(
    ctx,
    x,
    healthBarY,
    healthBarWidth,
    healthBarHeight,
    hp,
    maxHP
  )
}
