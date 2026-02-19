import { EnemyStats } from '../../types'
import { enemyConfig } from '../config/EnemyConfig'
import { drawCircle, drawHealthBar } from '../../utils/canvas'

// Healer enemy stats from config
export const healerEnemyStats: EnemyStats = enemyConfig.healer

// Animation state for heal particles
const healParticles: { x: number; y: number; targetX: number; targetY: number; progress: number }[] = []
const MAX_HEAL_PARTICLES = 8

/**
 * Renders the healer enemy - a green/white circle with a cross symbol
 * and green heal particles flowing to nearby allies
 */
export const renderHealerEnemy = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  hp: number,
  maxHP: number,
  _size?: number
): void => {
  const size = healerEnemyStats.size // 12

  // Draw heal particles (animated)
  renderHealParticles(ctx, x, y)

  // Draw main body - green circle
  drawCircle(ctx, x, y, size, '#10b981', '#065f46', 2)

  // Draw inner lighter circle
  drawCircle(ctx, x, y, size * 0.65, '#34d399')

  // Draw white cross symbol in center
  const crossSize = size * 0.5
  const crossThickness = 3

  // Vertical line of cross
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(x - crossThickness / 2, y - crossSize, crossThickness, crossSize * 2)

  // Horizontal line of cross
  ctx.fillRect(x - crossSize, y - crossThickness / 2, crossSize * 2, crossThickness)

  // Draw health bar above enemy
  const healthBarY = y - size - 10
  const healthBarWidth = size * 2.5
  const healthBarHeight = 4

  drawHealthBar(ctx, x, healthBarY, healthBarWidth, healthBarHeight, hp, maxHP)
}

/**
 * Renders animated heal particles flowing from healer to nearby allies
 */
const renderHealParticles = (
  ctx: CanvasRenderingContext2D,
  healerX: number,
  healerY: number
): void => {
  const time = Date.now() / 1000

  // Spawn new heal particles periodically
  if (healParticles.length < MAX_HEAL_PARTICLES && Math.random() < 0.1) {
    // Random target position (simulating nearby allies)
    const angle = Math.random() * Math.PI * 2
    const dist = 30 + Math.random() * 50
    const targetX = healerX + Math.cos(angle) * dist
    const targetY = healerY + Math.sin(angle) * dist

    healParticles.push({
      x: healerX,
      y: healerY,
      targetX,
      targetY,
      progress: 0
    })
  }

  // Update and render particles
  for (let i = healParticles.length - 1; i >= 0; i--) {
    const particle = healParticles[i]
    particle.progress += 0.02

    if (particle.progress >= 1) {
      healParticles.splice(i, 1)
      continue
    }

    // Interpolate position from healer to target
    const currentX = particle.x + (particle.targetX - particle.x) * particle.progress
    const currentY = particle.y + (particle.targetY - particle.y) * particle.progress

    // Add some wobble
    const wobble = Math.sin(time * 10 + i) * 3
    const finalX = currentX + wobble
    const finalY = currentY

    // Draw particle glow
    const glowGradient = ctx.createRadialGradient(finalX, finalY, 0, finalX, finalY, 8)
    glowGradient.addColorStop(0, 'rgba(52, 211, 153, 0.8)')
    glowGradient.addColorStop(0.5, 'rgba(52, 211, 153, 0.3)')
    glowGradient.addColorStop(1, 'rgba(52, 211, 153, 0)')

    ctx.beginPath()
    ctx.arc(finalX, finalY, 8, 0, Math.PI * 2)
    ctx.fillStyle = glowGradient
    ctx.fill()

    // Draw particle core
    ctx.beginPath()
    ctx.arc(finalX, finalY, 3, 0, Math.PI * 2)
    ctx.fillStyle = '#6ee7b7'
    ctx.fill()

    // Draw bright center
    ctx.beginPath()
    ctx.arc(finalX, finalY, 1.5, 0, Math.PI * 2)
    ctx.fillStyle = '#ffffff'
    ctx.fill()
  }
}

/**
 * Clears heal particles (useful when enemy dies)
 */
export const clearHealParticles = (): void => {
  healParticles.length = 0
}
