import { Position } from '../../types'

const FIREBALL_COLOR = '#fb923c'
const FIREBALL_CORE_COLOR = '#fef3c7'
const FIREBALL_GLOW_COLOR = 'rgba(251, 146, 60, 0.4)'
const TRAIL_COLOR = '#f97316'
const TRAIL_ALPHA = 0.6

export const renderFireball = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number
): void => {
  const size = 8
  const glowSize = size + 4
  const trailLength = 5
  const trailSpacing = 6

  // Draw fire trail (behind the fireball)
  for (let i = 1; i <= trailLength; i++) {
    const trailX = x - Math.cos(angle) * i * trailSpacing
    const trailY = y - Math.sin(angle) * i * trailSpacing
    const trailSize = size * (1 - i / (trailLength + 1.5))
    const alpha = TRAIL_ALPHA * (1 - i / (trailLength + 1))

    ctx.globalAlpha = alpha

    // Trail glow
    ctx.beginPath()
    ctx.arc(trailX, trailY, trailSize + 2, 0, Math.PI * 2)
    ctx.fillStyle = TRAIL_COLOR
    ctx.fill()

    // Trail core
    ctx.beginPath()
    ctx.arc(trailX, trailY, trailSize * 0.6, 0, Math.PI * 2)
    ctx.fillStyle = FIREBALL_COLOR
    ctx.fill()
  }

  ctx.globalAlpha = 1

  // Draw outer glow
  const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize)
  glowGradient.addColorStop(0, FIREBALL_GLOW_COLOR)
  glowGradient.addColorStop(1, 'rgba(251, 146, 60, 0)')

  ctx.beginPath()
  ctx.arc(x, y, glowSize, 0, Math.PI * 2)
  ctx.fillStyle = glowGradient
  ctx.fill()

  // Draw outer fire ring
  ctx.beginPath()
  ctx.arc(x, y, size, 0, Math.PI * 2)
  ctx.fillStyle = FIREBALL_COLOR
  ctx.fill()

  // Draw inner core (bright yellow-white)
  ctx.beginPath()
  ctx.arc(x, y, size * 0.5, 0, Math.PI * 2)
  ctx.fillStyle = FIREBALL_CORE_COLOR
  ctx.fill()

  // Draw center bright spot
  ctx.beginPath()
  ctx.arc(x, y, size * 0.2, 0, Math.PI * 2)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
}

export const createFireballEffect = (): { color: string; duration: number } => {
  return {
    color: FIREBALL_COLOR,
    duration: 0.5
  }
}
