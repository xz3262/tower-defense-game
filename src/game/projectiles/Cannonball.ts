import { Position } from '../../types'
import { drawCircle } from '../../utils/canvas'
import { angleBetween } from '../../utils/math'

const CANNONBALL_COLOR = '#1f2937'
const CANNONBALL_SIZE = 5
const CANNONBALL_GLOW = '#374151'

export interface CannonballData {
  x: number
  y: number
  targetX: number
  targetY: number
  damage: number
  speed: number
  aoeRadius: number
}

export const renderCannonball = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number
): void => {
  const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, CANNONBALL_SIZE * 1.5)
  glowGradient.addColorStop(0, 'rgba(55, 65, 81, 0.4)')
  glowGradient.addColorStop(1, 'rgba(55, 65, 81, 0)')

  ctx.beginPath()
  ctx.arc(x, y, CANNONBALL_SIZE * 1.5, 0, Math.PI * 2)
  ctx.fillStyle = glowGradient
  ctx.fill()

  drawCircle(ctx, x, y, CANNONBALL_SIZE, CANNONBALL_COLOR, CANNONBALL_GLOW, 1)

  const highlightOffsetX = -CANNONBALL_SIZE * 0.3
  const highlightOffsetY = -CANNONBALL_SIZE * 0.3
  ctx.beginPath()
  ctx.arc(x + highlightOffsetX, y + highlightOffsetY, CANNONBALL_SIZE * 0.3, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
  ctx.fill()

  const trailLength = 12
  const trailStartX = x - Math.cos(angle) * CANNONBALL_SIZE
  const trailStartY = y - Math.sin(angle) * CANNONBALL_SIZE
  const trailEndX = x - Math.cos(angle) * trailLength
  const trailEndY = y - Math.sin(angle) * trailLength

  const trailGradient = ctx.createLinearGradient(trailStartX, trailStartY, trailEndX, trailEndY)
  trailGradient.addColorStop(0, 'rgba(55, 65, 81, 0.6)')
  trailGradient.addColorStop(1, 'rgba(55, 65, 81, 0)')

  ctx.beginPath()
  ctx.moveTo(trailStartX, trailStartY)
  ctx.lineTo(trailEndX, trailEndY)
  ctx.strokeStyle = trailGradient
  ctx.lineWidth = CANNONBALL_SIZE * 0.8
  ctx.lineCap = 'round'
  ctx.stroke()
}

export const renderCannonballExplosion = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  progress: number
): void => {
  const easedProgress = 1 - Math.pow(1 - progress, 3)
  const currentRadius = radius * easedProgress
  const alpha = 1 - progress

  ctx.beginPath()
  ctx.arc(x, y, currentRadius, 0, Math.PI * 2)
  ctx.fillStyle = `rgba(251, 146, 60, ${alpha * 0.4})`
  ctx.fill()

  const innerRadius = currentRadius * 0.7
  const innerGradient = ctx.createRadialGradient(x, y, 0, x, y, innerRadius)
  innerGradient.addColorStop(0, `rgba(251, 191, 36, ${alpha * 0.8})`)
  innerGradient.addColorStop(0.5, `rgba(249, 115, 22, ${alpha * 0.6})`)
  innerGradient.addColorStop(1, `rgba(220, 38, 38, ${alpha * 0.3})`)

  ctx.beginPath()
  ctx.arc(x, y, innerRadius, 0, Math.PI * 2)
  ctx.fillStyle = innerGradient
  ctx.fill()

  const particleCount = 8
  for (let i = 0; i < particleCount; i++) {
    const particleAngle = (i / particleCount) * Math.PI * 2
    const particleDist = currentRadius * 0.8 * (0.5 + progress * 0.5)
    const particleX = x + Math.cos(particleAngle) * particleDist
    const particleY = y + Math.sin(particleAngle) * particleDist
    const particleSize = 3 * (1 - progress)

    ctx.beginPath()
    ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(107, 114, 128, ${alpha})`
    ctx.fill()
  }

  if (progress < 0.2) {
    const flashAlpha = (0.2 - progress) * 5
    ctx.beginPath()
    ctx.arc(x, y, radius * 0.5, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`
    ctx.fill()
  }
}

export const createCannonball = (
  startX: number,
  startY: number,
  targetX: number,
  targetY: number,
  damage: number,
  speed: number,
  aoeRadius: number = 50
): CannonballData => ({
  x: startX,
  y: startY,
  targetX,
  targetY,
  damage,
  speed,
  aoeRadius
})

export const updateCannonball = (
  cannonball: CannonballData,
  dt: number
): CannonballData => {
  const angle = angleBetween({ x: cannonball.x, y: cannonball.y }, { x: cannonball.targetX, y: cannonball.targetY })

  const dx = cannonball.targetX - cannonball.x
  const dy = cannonball.targetY - cannonball.y
  const dist = Math.sqrt(dx * dx + dy * dy)

  if (dist < 10) {
    return cannonball
  }

  const moveSpeed = cannonball.speed * dt * 60
  const newX = cannonball.x + Math.cos(angle) * moveSpeed
  const newY = cannonball.y + Math.sin(angle) * moveSpeed

  return { ...cannonball, x: newX, y: newY }
}
