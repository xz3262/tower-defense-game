import { Position } from '../../types'

const POISON_DURATION = 3 // seconds
const BASE_RADIUS = 30
const GREEN_COLOR = 'rgba(132, 204, 22, '
const PURPLE_COLOR = 'rgba(168, 85, 247, '

export interface PoisonCloudOptions {
  x: number
  y: number
  radius: number
  progress: number // 0 to 1
  damagePerSecond: number
}

export const renderPoisonCloud = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  progress: number
): void => {
  // Calculate fade based on progress (1 = fully faded)
  const alpha = 1 - progress
  
  // Calculate expansion based on progress
  // Cloud expands from 0.5x to 1.5x of base radius over lifetime
  const expansionFactor = 0.5 + progress
  const currentRadius = radius * expansionFactor
  
  // Draw multiple layered circles for depth effect
  // Outer green layer
  ctx.beginPath()
  ctx.arc(x, y, currentRadius, 0, Math.PI * 2)
  ctx.fillStyle = `${GREEN_COLOR}${alpha * 0.3})`
  ctx.fill()
  
  // Middle purple layer
  ctx.beginPath()
  ctx.arc(x, y, currentRadius * 0.7, 0, Math.PI * 2)
  ctx.fillStyle = `${PURPLE_COLOR}${alpha * 0.4})`
  ctx.fill()
  
  // Inner green core
  ctx.beginPath()
  ctx.arc(x, y, currentRadius * 0.4, 0, Math.PI * 2)
  ctx.fillStyle = `${GREEN_COLOR}${alpha * 0.5})`
  ctx.fill()
  
  // Animated bubbles within cloud
  const bubbleCount = 5
  for (let i = 0; i < bubbleCount; i++) {
    const angle = (i / bubbleCount) * Math.PI * 2 + progress * 3
    const dist = currentRadius * 0.3 * Math.sin(progress * Math.PI + i)
    const bx = x + Math.cos(angle) * dist
    const by = y + Math.sin(angle) * dist
    const bubbleSize = 3 + Math.sin(progress * 5 + i * 2) * 1.5
    
    ctx.beginPath()
    ctx.arc(bx, by, bubbleSize, 0, Math.PI * 2)
    ctx.fillStyle = `${PURPLE_COLOR}${alpha * 0.6})`
    ctx.fill()
  }
  
  // Draw subtle pulsing effect at center
  const pulseSize = currentRadius * 0.2 * (1 + Math.sin(progress * 10) * 0.2)
  ctx.beginPath()
  ctx.arc(x, y, pulseSize, 0, Math.PI * 2)
  ctx.fillStyle = `${GREEN_COLOR}${alpha * 0.7})`
  ctx.fill()
}

export const renderPoisonCloudImpact = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number
): void => {
  // Initial impact animation - rapid expansion
  const impactRadius = BASE_RADIUS * (0.5 + progress * 1.5)
  const alpha = 1 - progress
  
  // Impact ring
  ctx.beginPath()
  ctx.arc(x, y, impactRadius, 0, Math.PI * 2)
  ctx.strokeStyle = `${PURPLE_COLOR}${alpha * 0.8})`
  ctx.lineWidth = 3 * (1 - progress)
  ctx.stroke()
  
  // Inner fill
  ctx.beginPath()
  ctx.arc(x, y, impactRadius * 0.8, 0, Math.PI * 2)
  ctx.fillStyle = `${GREEN_COLOR}${alpha * 0.4})`
  ctx.fill()
}

export const getPoisonCloudDuration = (): number => POISON_DURATION

export const createPoisonCloudEffect = (
  sourceId: string,
  damagePerSecond: number = 5
) => {
  return {
    type: 'poison' as const,
    duration: POISON_DURATION,
    magnitude: damagePerSecond,
    sourceId
  }
}

export const calculatePoisonCloudDamage = (
  dt: number,
  damagePerSecond: number
): number => {
  return damagePerSecond * dt
}
