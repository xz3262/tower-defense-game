import { TILE_SIZE } from '../config/GameConstants'

/**
 * Renders the level up effect with golden sparkles spiraling upward
 * and a star burst animation.
 * 
 * @param ctx - Canvas 2D rendering context
 * @param x - X position in pixels (center of tower)
 * @param y - Y position in pixels (center of tower)
 * @param progress - Animation progress from 0 to 1
 */
export const renderLevelUpEffect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number
): void => {
  const alpha = 1 - progress
  const centerX = x * TILE_SIZE + TILE_SIZE / 2
  const centerY = y * TILE_SIZE + TILE_SIZE / 2

  // Draw star burst at the center
  drawStarBurst(ctx, centerX, centerY, progress, alpha)

  // Draw spiraling golden sparkles
  drawSpiralSparkles(ctx, centerX, centerY, progress, alpha)

  // Draw rising particles
  drawRisingParticles(ctx, centerX, centerY, progress, alpha)

  // Draw outer ring pulse
  drawOuterRing(ctx, centerX, centerY, progress, alpha)
}

const drawStarBurst = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number,
  alpha: number
): void => {
  const rays = 8
  const maxRadius = 40
  const radius = maxRadius * progress

  for (let i = 0; i < rays; i++) {
    const angle = (i / rays) * Math.PI * 2
    const innerRadius = 5 * (1 - progress * 0.5)
    const outerRadius = radius

    const startX = x + Math.cos(angle) * innerRadius
    const startY = y + Math.sin(angle) * innerRadius
    const endX = x + Math.cos(angle) * outerRadius
    const endY = y + Math.sin(angle) * outerRadius

    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.strokeStyle = `rgba(251, 191, 36, ${alpha})`
    ctx.lineWidth = 3 * (1 - progress)
    ctx.lineCap = 'round'
    ctx.stroke()
  }

  // Center star
  if (progress < 0.5) {
    const starSize = 8 * (1 - progress * 2)
    drawStar(ctx, x, y, starSize, alpha)
  }
}

const drawStar = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  alpha: number
): void => {
  const spikes = 5
  const outerRadius = size
  const innerRadius = size * 0.4

  ctx.beginPath()
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius
    const angle = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2
    const px = cx + Math.cos(angle) * radius
    const py = cy + Math.sin(angle) * radius

    if (i === 0) {
      ctx.moveTo(px, py)
    } else {
      ctx.lineTo(px, py)
    }
  }
  ctx.closePath()
  ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
  ctx.fill()
}

const drawSpiralSparkles = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number,
  alpha: number
): void => {
  const sparkleCount = 12
  const maxRadius = 50
  const spiralTurns = 2

  for (let i = 0; i < sparkleCount; i++) {
    const t = (i / sparkleCount + progress * 0.3) % 1
    const angle = t * Math.PI * 2 * spiralTurns
    const radius = t * maxRadius

    const sparkleX = x + Math.cos(angle) * radius
    const sparkleY = y + Math.sin(angle) * radius - t * 30

    const sparkleSize = 3 * (1 - t)
    const sparkleAlpha = alpha * (1 - t)

    // Golden sparkle
    ctx.beginPath()
    ctx.arc(sparkleX, sparkleY, sparkleSize, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(251, 191, 36, ${sparkleAlpha})`
    ctx.fill()

    // White center
    if (sparkleSize > 1) {
      ctx.beginPath()
      ctx.arc(sparkleX, sparkleY, sparkleSize * 0.4, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 255, ${sparkleAlpha})`
      ctx.fill()
    }
  }
}

const drawRisingParticles = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number,
  alpha: number
): void => {
  const particleCount = 8

  for (let i = 0; i < particleCount; i++) {
    const startX = x + (Math.random() - 0.5) * 20
    const startY = y
    const endY = y - 60 - Math.random() * 20

    const particleY = startY + (endY - startY) * progress
    const particleX = startX + Math.sin(progress * Math.PI * 2 + i) * 10

    const particleSize = 2 + Math.random() * 2
    const particleAlpha = alpha * (0.5 + Math.random() * 0.5)

    ctx.beginPath()
    ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(253, 224, 71, ${particleAlpha})`
    ctx.fill()
  }
}

const drawOuterRing = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number,
  alpha: number
): void => {
  const minRadius = 20
  const maxRadius = 60
  const radius = minRadius + (maxRadius - minRadius) * progress

  // Outer ring
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.strokeStyle = `rgba(251, 191, 36, ${alpha * 0.5 * (1 - progress)})`
  ctx.lineWidth = 2
  ctx.stroke()

  // Dashed effect
  if (progress < 0.7) {
    const dashCount = 12
    const dashAlpha = alpha * (1 - progress / 0.7)

    for (let i = 0; i < dashCount; i++) {
      const angle = (i / dashCount) * Math.PI * 2 + progress * 2
      const dashRadius = radius - 5

      const startX = x + Math.cos(angle) * dashRadius
      const startY = y + Math.sin(angle) * dashRadius
      const endX = x + Math.cos(angle) * (dashRadius + 8)
      const endY = y + Math.sin(angle) * (dashRadius + 8)

      ctx.beginPath()
      ctx.moveTo(startX, startY)
      ctx.lineTo(endX, endY)
      ctx.strokeStyle = `rgba(255, 255, 255, ${dashAlpha})`
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.stroke()
    }
  }
}
