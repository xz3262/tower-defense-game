import { Position } from '../../types'

const LIGHTNING_COLOR = '#FFD700'
const LIGHTNING_INNER_COLOR = '#FFEC8B'
const LIGHTNING_GLOW_COLOR = 'rgba(255, 215, 0, 0.3)'
const LIGHTNING_SEGMENTS = 8
const LIGHTNING_OFFSET_MAGNITUDE = 12

export const renderLightningBolt = (
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  chainTargets: Position[] = []
): void => {
  // Draw main lightning bolt from tower to primary target
  drawLightningLine(ctx, fromX, fromY, toX, toY, LIGHTNING_COLOR)
  
  // Draw chain lightning to secondary targets
  let prevX = toX
  let prevY = toY
  
  for (let i = 0; i < chainTargets.length; i++) {
    const target = chainTargets[i]
    drawLightningLine(ctx, prevX, prevY, target.x, target.y, LIGHTNING_COLOR)
    prevX = target.x
    prevY = target.y
  }
  
  // Draw impact effects at each hit point
  drawImpactPoint(ctx, fromX, fromY)
  drawImpactPoint(ctx, toX, toY)
  
  for (const target of chainTargets) {
    drawImpactPoint(ctx, target.x, target.y)
  }
}

const drawLightningLine = (
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string
): void => {
  const segments = LIGHTNING_SEGMENTS
  const offsetMag = LIGHTNING_OFFSET_MAGNITUDE
  
  // Calculate direction and perpendicular vectors
  const dx = x2 - x1
  const dy = y2 - y1
  const dist = Math.sqrt(dx * dx + dy * dy)
  
  if (dist === 0) return
  
  const perpX = -dy / dist
  const perpY = dx / dist
  
  // Generate zigzag points
  const points: { x: number; y: number }[] = []
  points.push({ x: x1, y: y1 })
  
  for (let i = 1; i < segments; i++) {
    const t = i / segments
    const baseX = x1 + dx * t
    const baseY = y1 + dy * t
    
    // Random offset perpendicular to direction
    const offset = (Math.random() - 0.5) * offsetMag * 2 * (1 - Math.abs(t - 0.5) * 1.5)
    const px = baseX + perpX * offset
    const py = baseY + perpY * offset
    
    points.push({ x: px, y: py })
  }
  
  points.push({ x: x2, y: y2 })
  
  // Draw outer glow
  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y)
  }
  ctx.strokeStyle = LIGHTNING_GLOW_COLOR
  ctx.lineWidth = 8
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.stroke()
  
  // Draw main lightning
  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y)
  }
  ctx.strokeStyle = color
  ctx.lineWidth = 3
  ctx.stroke()
  
  // Draw inner bright core
  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y)
  }
  ctx.strokeStyle = LIGHTNING_INNER_COLOR
  ctx.lineWidth = 1
  ctx.stroke()
}

const drawImpactPoint = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
): void => {
  const radius = 6
  
  // Outer glow
  const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 2)
  glowGradient.addColorStop(0, 'rgba(255, 215, 0, 0.6)')
  glowGradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.2)')
  glowGradient.addColorStop(1, 'rgba(255, 215, 0, 0)')
  
  ctx.beginPath()
  ctx.arc(x, y, radius * 2, 0, Math.PI * 2)
  ctx.fillStyle = glowGradient
  ctx.fill()
  
  // Core
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fillStyle = LIGHTNING_COLOR
  ctx.fill()
  
  // Inner bright spot
  ctx.beginPath()
  ctx.arc(x, y, radius * 0.5, 0, Math.PI * 2)
  ctx.fillStyle = LIGHTNING_INNER_COLOR
  ctx.fill()
  
  // Center white flash
  ctx.beginPath()
  ctx.arc(x, y, radius * 0.2, 0, Math.PI * 2)
  ctx.fillStyle = '#FFFFFF'
  ctx.fill()
}
