import { Position } from '../../types'

/**
 * Renders a laser beam projectile as a continuous red/orange line
 * from the tower to the target with pulsing width effect.
 * 
 * @param ctx - Canvas 2D rendering context
 * @param fromX - Starting x position (tower center)
 * @param fromY - Starting y position (tower center)
 * @param toX - Target x position
 * @param toY - Target y position
 * @param width - Base width of the laser beam
 */
export const renderLaserBeam = (
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  width: number
): void => {
  // Calculate pulsing effect using time
  const pulsePhase = (Date.now() / 100) % (Math.PI * 2)
  const pulseFactor = 1 + Math.sin(pulsePhase) * 0.3 // Pulse between 0.7x and 1.3x
  const currentWidth = width * pulseFactor

  // Calculate direction for perpendicular offset
  const dx = toX - fromX
  const dy = toY - fromY
  const dist = Math.sqrt(dx * dx + dy * dy)
  
  if (dist === 0) return

  // Normalize direction
  const dirX = dx / dist
  const dirY = dy / dist

  // Perpendicular vector for glow effect
  const perpX = -dirY
  const perpY = dirX

  // Draw outer glow (red/orange gradient)
  const glowWidth = currentWidth * 4
  const glowGradient = ctx.createLinearGradient(
    fromX - perpX * glowWidth,
    fromY - perpY * glowWidth,
    fromX + perpX * glowWidth,
    fromY + perpY * glowWidth
  )
  glowGradient.addColorStop(0, 'rgba(239, 68, 68, 0)')
  glowGradient.addColorStop(0.3, 'rgba(239, 68, 68, 0.15)')
  glowGradient.addColorStop(0.5, 'rgba(251, 146, 60, 0.25)')
  glowGradient.addColorStop(0.7, 'rgba(239, 68, 68, 0.15)')
  glowGradient.addColorStop(1, 'rgba(239, 68, 68, 0)')

  ctx.beginPath()
  ctx.moveTo(fromX - perpX * glowWidth, fromY - perpY * glowWidth)
  ctx.lineTo(toX - perpX * glowWidth, toY - perpY * glowWidth)
  ctx.lineTo(toX + perpX * glowWidth, toY + perpY * glowWidth)
  ctx.lineTo(fromX + perpX * glowWidth, fromY + perpY * glowWidth)
  ctx.closePath()
  ctx.fillStyle = glowGradient
  ctx.fill()

  // Draw middle glow (orange)
  const midWidth = currentWidth * 2
  const midGradient = ctx.createLinearGradient(
    fromX - perpX * midWidth,
    fromY - perpY * midWidth,
    fromX + perpX * midWidth,
    fromY + perpY * midWidth
  )
  midGradient.addColorStop(0, 'rgba(251, 146, 60, 0)')
  midGradient.addColorStop(0.4, 'rgba(251, 146, 60, 0.4)')
  midGradient.addColorStop(0.6, 'rgba(251, 146, 60, 0.4)')
  midGradient.addColorStop(1, 'rgba(251, 146, 60, 0)')

  ctx.beginPath()
  ctx.moveTo(fromX - perpX * midWidth, fromY - perpY * midWidth)
  ctx.lineTo(toX - perpX * midWidth, toY - perpY * midWidth)
  ctx.lineTo(toX + perpX * midWidth, toY + perpY * midWidth)
  ctx.lineTo(fromX + perpX * midWidth, fromY + perpY * midWidth)
  ctx.closePath()
  ctx.fillStyle = midGradient
  ctx.fill()

  // Draw core beam (bright red/orange)
  ctx.beginPath()
  ctx.moveTo(fromX, fromY)
  ctx.lineTo(toX, toY)
  ctx.strokeStyle = '#fb923c'
  ctx.lineWidth = currentWidth
  ctx.lineCap = 'round'
  ctx.stroke()

  // Draw inner bright core (white/yellow)
  ctx.beginPath()
  ctx.moveTo(fromX, fromY)
  ctx.lineTo(toX, toY)
  ctx.strokeStyle = '#fef3c7'
  ctx.lineWidth = currentWidth * 0.4
  ctx.lineCap = 'round'
  ctx.stroke()

  // Draw impact point at target
  renderLaserImpact(ctx, toX, toY, currentWidth)
}

/**
 * Renders the impact effect at the end of the laser beam
 */
const renderLaserImpact = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number
): void => {
  const impactSize = width * 3

  // Outer impact glow
  const outerGlow = ctx.createRadialGradient(x, y, 0, x, y, impactSize)
  outerGlow.addColorStop(0, 'rgba(254, 243, 199, 0.8)')
  outerGlow.addColorStop(0.3, 'rgba(251, 146, 60, 0.5)')
  outerGlow.addColorStop(0.6, 'rgba(239, 68, 68, 0.2)')
  outerGlow.addColorStop(1, 'rgba(239, 68, 68, 0)')

  ctx.beginPath()
  ctx.arc(x, y, impactSize, 0, Math.PI * 2)
  ctx.fillStyle = outerGlow
  ctx.fill()

  // Inner bright core
  ctx.beginPath()
  ctx.arc(x, y, width * 0.8, 0, Math.PI * 2)
  ctx.fillStyle = '#ffffff'
  ctx.fill()

  // Middle ring
  ctx.beginPath()
  ctx.arc(x, y, width * 1.5, 0, Math.PI * 2)
  ctx.fillStyle = '#fef3c7'
  ctx.fill()
}

/**
 * Renders a laser beam targeting a specific enemy position
 * 
 * @param ctx - Canvas 2D rendering context
 * @param fromX - Starting x position (tower center)
 * @param fromY - Starting y position (tower center)
 * @param targetPos - Position of the target enemy
 * @param width - Base width of the laser beam
 */
export const renderLaserBeamToTarget = (
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  targetPos: Position,
  width: number
): void => {
  renderLaserBeam(ctx, fromX, fromY, targetPos.x, targetPos.y, width)
}
