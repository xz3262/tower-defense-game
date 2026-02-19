import { Position } from '../../types'
import { angleBetween } from '../../utils/math'

const BULLET_COLOR = '#fbbf24'
const BULLET_SIZE = 3
const TRAIL_LENGTH = 4

/**
 * Renders a bullet projectile - tiny fast white/yellow dot
 * Used by SniperTower for high damage, fast attacks
 * 
 * @param ctx - Canvas 2D rendering context
 * @param x - Current x position of the projectile
 * @param y - Current y position of the projectile
 * @param angle - Direction the bullet is traveling (radians)
 */
export const renderBullet = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number
): void => {
  // Draw motion trail behind the bullet
  for (let i = 1; i <= TRAIL_LENGTH; i++) {
    const trailX = x - Math.cos(angle) * i * (BULLET_SIZE + 1)
    const trailY = y - Math.sin(angle) * i * (BULLET_SIZE + 1)
    const trailAlpha = 0.4 * (1 - i / (TRAIL_LENGTH + 1))
    const trailSize = BULLET_SIZE * (1 - i / (TRAIL_LENGTH + 1.5))

    ctx.beginPath()
    ctx.arc(trailX, trailY, trailSize, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${trailAlpha})`
    ctx.fill()
  }

  // Draw glow effect around the bullet
  const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, BULLET_SIZE * 2)
  glowGradient.addColorStop(0, 'rgba(251, 191, 36, 0.6)')
  glowGradient.addColorStop(0.5, 'rgba(251, 191, 36, 0.2)')
  glowGradient.addColorStop(1, 'rgba(251, 191, 36, 0)')

  ctx.beginPath()
  ctx.arc(x, y, BULLET_SIZE * 2, 0, Math.PI * 2)
  ctx.fillStyle = glowGradient
  ctx.fill()

  // Draw main bullet (white/yellow center)
  ctx.beginPath()
  ctx.arc(x, y, BULLET_SIZE, 0, Math.PI * 2)
  ctx.fillStyle = '#ffffff'
  ctx.fill()

  // Draw inner yellow core
  ctx.beginPath()
  ctx.arc(x, y, BULLET_SIZE * 0.5, 0, Math.PI * 2)
  ctx.fillStyle = BULLET_COLOR
  ctx.fill()

  // Draw bright center highlight
  ctx.beginPath()
  ctx.arc(x - 0.5, y - 0.5, 1, 0, Math.PI * 2)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
}

/**
 * Renders a bullet projectile targeting a specific position
 * 
 * @param ctx - Canvas 2D rendering context
 * @param x - Current x position of the projectile
 * @param y - Current y position of the projectile
 * @param targetPos - Position the bullet is flying toward
 */
export const renderBulletToTarget = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  targetPos: Position
): void => {
  const angle = angleBetween({ x, y }, targetPos)
  renderBullet(ctx, x, y, angle)
}
