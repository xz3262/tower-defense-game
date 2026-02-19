import { Position } from '../../types'

const POISON_COLOR = '#84cc16'
const POISON_DARK = '#65a30d'
const POISON_LIGHT = '#a3e635'
const PURPLE_COLOR = '#a855f7'
const BUBBLE_COUNT = 6
const BUBBLE_RADIUS = 4

/**
 * Renders a poison effect with green bubbles rising from the entity.
 * This visual indicates a poison DoT (damage over time) is active on the target.
 * 
 * @param ctx - Canvas 2D rendering context
 * @param x - X position of the entity center
 * @param y - Y position of the entity center
 * @param progress - Animation progress from 0 to 1
 */
export const renderPoisonEffect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number
): void => {
  const alpha = 1 - progress * 0.5
  const bubbleRise = progress * 30

  // Draw outer poison cloud glow
  const cloudRadius = 20 + progress * 10
  const cloudGradient = ctx.createRadialGradient(x, y, 0, x, y, cloudRadius)
  cloudGradient.addColorStop(0, `rgba(132, 204, 22, ${alpha * 0.4})`)
  cloudGradient.addColorStop(0.5, `rgba(168, 85, 247, ${alpha * 0.2})`)
  cloudGradient.addColorStop(1, 'rgba(132, 204, 22, 0)')

  ctx.beginPath()
  ctx.arc(x, y, cloudRadius, 0, Math.PI * 2)
  ctx.fillStyle = cloudGradient
  ctx.fill()

  // Draw rising bubbles
  for (let i = 0; i < BUBBLE_COUNT; i++) {
    const angle = (i / BUBBLE_COUNT) * Math.PI * 2 + progress * 2
    const dist = 8 + Math.sin(progress * Math.PI + i) * 5
    const riseOffset = bubbleRise * (0.5 + (i % 3) * 0.3)
    
    const bx = x + Math.cos(angle) * dist
    const by = y + Math.sin(angle) * dist - riseOffset
    const size = BUBBLE_RADIUS * (0.5 + Math.sin(progress * 5 + i) * 0.3)

    // Bubble glow
    ctx.beginPath()
    ctx.arc(bx, by, size + 2, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(132, 204, 22, ${alpha * 0.3})`
    ctx.fill()

    // Main bubble
    ctx.beginPath()
    ctx.arc(bx, by, size, 0, Math.PI * 2)
    ctx.fillStyle = i % 2 === 0 ? `rgba(132, 204, 22, ${alpha})` : `rgba(168, 85, 247, ${alpha})`
    ctx.fill()

    // Bubble highlight
    ctx.beginPath()
    ctx.arc(bx - size * 0.3, by - size * 0.3, size * 0.3, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.4})`
    ctx.fill()
  }

  // Draw center poison core
  const coreRadius = 6 + Math.sin(progress * Math.PI * 2) * 2
  ctx.beginPath()
  ctx.arc(x, y - bubbleRise * 0.3, coreRadius, 0, Math.PI * 2)
  ctx.fillStyle = `rgba(132, 204, 22, ${alpha})`
  ctx.fill()

  // Inner core highlight
  ctx.beginPath()
  ctx.arc(x - 2, y - bubbleRise * 0.3 - 2, 2, 0, Math.PI * 2)
  ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.5})`
  ctx.fill()
}

/**
 * Renders a poison cloud at a specific position (for poison tower area effect)
 * 
 * @param ctx - Canvas 2D rendering context
 * @param x - X position of cloud center
 * @param y - Y position of cloud center
 * @param radius - Cloud radius in pixels
 * @param progress - Animation progress from 0 to 1
 */
export const renderPoisonCloud = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  progress: number
): void => {
  const alpha = 1 - progress
  const expansionFactor = 0.5 + progress * 0.5
  const currentRadius = radius * expansionFactor

  // Multiple layered circles for depth
  for (let i = 3; i >= 0; i--) {
    const layerRadius = currentRadius * (0.6 + i * 0.15)
    const layerAlpha = alpha * (0.15 - i * 0.03)

    ctx.beginPath()
    ctx.arc(x, y, layerRadius, 0, Math.PI * 2)
    ctx.fillStyle = i % 2 === 0 
      ? `rgba(132, 204, 22, ${layerAlpha})` 
      : `rgba(168, 85, 247, ${layerAlpha})`
    ctx.fill()
  }

  // Animated bubbles within cloud
  const bubbleCount = 5
  for (let i = 0; i < bubbleCount; i++) {
    const angle = (i / bubbleCount) * Math.PI * 2 + progress * 3
    const dist = currentRadius * 0.4 * Math.sin(progress * Math.PI + i)
    const bx = x + Math.cos(angle) * dist
    const by = y + Math.sin(angle) * dist
    const bubbleSize = 2 + Math.sin(progress * 5 + i * 2) * 1.5

    ctx.beginPath()
    ctx.arc(bx, by, bubbleSize, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(168, 85, 247, ${alpha * 0.6})`
    ctx.fill()
  }

  // Pulsing center
  const pulseSize = currentRadius * 0.15 * (1 + Math.sin(progress * 10) * 0.2)
  ctx.beginPath()
  ctx.arc(x, y, pulseSize, 0, Math.PI * 2)
  ctx.fillStyle = `rgba(132, 204, 22, ${alpha * 0.7})`
  ctx.fill()
}

/**
 * Renders the initial impact effect when poison hits an enemy
 * 
 * @param ctx - Canvas 2D rendering context
 * @param x - Impact X position
 * @param y - Impact Y position
 * @param progress - Animation progress from 0 to 1
 */
export const renderPoisonImpact = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number
): void => {
  const alpha = 1 - progress
  const impactRadius = 25 * (0.5 + progress * 1.5)


  // Impact ring
  ctx.beginPath()
  ctx.arc(x, y, impactRadius, 0, Math.PI * 2)
  ctx.strokeStyle = `rgba(168, 85, 247, ${alpha * 0.8})`
  ctx.lineWidth = 3 * (1 - progress)
  ctx.stroke()

  // Inner fill
  ctx.beginPath()
  ctx.arc(x, y, impactRadius * 0.8, 0, Math.PI * 2)
  ctx.fillStyle = `rgba(132, 204, 22, ${alpha * 0.4})`
  ctx.fill()

  // Burst particles
  const particleCount = 8
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2
    const dist = impactRadius * 0.6 * progress
    const px = x + Math.cos(angle) * dist
    const py = y + Math.sin(angle) * dist
    const size = 3 * (1 - progress)


    ctx.beginPath()
    ctx.arc(px, py, size, 0, Math.PI * 2)
    ctx.fillStyle = i % 2 === 0 
      ? `rgba(132, 204, 22, ${alpha})` 
      : `rgba(168, 85, 247, ${alpha})`
    ctx.fill()
  }

  // Center impact
  ctx.beginPath()
  ctx.arc(x, y, 5 * (1 - progress), 0, Math.PI * 2)
  ctx.fillStyle = `rgba(132, 204, 22, ${alpha})`
  ctx.fill()
}

/**
 * Creates position data for bubbles in a poison effect
 * 
 * @param x - Center X position
 * @param y - Center Y position
 * @param progress - Animation progress
 * @returns Array of bubble positions
 */
export const getPoisonBubblePositions = (
  x: number,
  y: number,
  progress: number
): Position[] => {
  const positions: Position[] = []
  const bubbleRise = progress * 30

  for (let i = 0; i < BUBBLE_COUNT; i++) {
    const angle = (i / BUBBLE_COUNT) * Math.PI * 2 + progress * 2
    const dist = 8 + Math.sin(progress * Math.PI + i) * 5
    const riseOffset = bubbleRise * (0.5 + (i % 3) * 0.3)

    positions.push({
      x: x + Math.cos(angle) * dist,
      y: y + Math.sin(angle) * dist - riseOffset
    })
  }

  return positions
}
