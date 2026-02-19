import { TowerStats } from '../../types'
import { TILE_SIZE } from '../config/GameConstants'

export const lightningTowerStats: TowerStats = {
  type: 'lightning',
  name: 'Lightning Tower',
  cost: 180,
  damage: 25,
  range: 3,
  fireRate: 1.2,
  projectileSpeed: 15,
  upgradeCosts: [100, 200, 320],
  damagePerLevel: 12,
  rangePerLevel: 0.5,
  special: 'Chains to up to 3 nearby enemies',
  color: '#FFD700',
  canTargetFlying: true
}

export const renderLightningTower = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  level: number
): void => {
  const centerX = x * TILE_SIZE + TILE_SIZE / 2
  const centerY = y * TILE_SIZE + TILE_SIZE / 2
  const radius = TILE_SIZE * 0.35

  // Glow intensity increases with level
  const glowIntensity = 0.3 + level * 0.2
  const glowRadius = radius + 8 + level * 3

  // Outer glow
  const gradient = ctx.createRadialGradient(
    centerX, centerY, radius,
    centerX, centerY, glowRadius
  )
  gradient.addColorStop(0, `rgba(255, 215, 0, ${glowIntensity})`)
  gradient.addColorStop(1, 'rgba(255, 215, 0, 0)')

  ctx.beginPath()
  ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2)
  ctx.fillStyle = gradient
  ctx.fill()

  // Main tower body - yellow circle
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  ctx.fillStyle = lightningTowerStats.color
  ctx.fill()
  ctx.strokeStyle = '#B8860B'
  ctx.lineWidth = 2
  ctx.stroke()

  // Inner circle
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius * 0.6, 0, Math.PI * 2)
  ctx.fillStyle = '#FFEC8B'
  ctx.fill()

  // Lightning bolt symbol
  drawLightningBolt(ctx, centerX, centerY, 10)

  // Level indicator
  if (level > 1) {
    const levelColor = level === 4 ? '#FF6B6B' : level === 3 ? '#FFD700' : '#90EE90'
    ctx.beginPath()
    ctx.arc(centerX + radius * 0.6, centerY - radius * 0.6, 6, 0, Math.PI * 2)
    ctx.fillStyle = levelColor
    ctx.fill()
    ctx.strokeStyle = '#1f2937'
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.fillStyle = '#1f2937'
    ctx.font = 'bold 10px system-ui'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(level), centerX + radius * 0.6, centerY - radius * 0.6)
  }
}

const drawLightningBolt = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
): void => {
  ctx.beginPath()
  ctx.moveTo(x + size * 0.3, y - size)
  ctx.lineTo(x - size * 0.3, y)
  ctx.lineTo(x, y)
  ctx.lineTo(x - size * 0.3, y + size)
  ctx.lineTo(x + size * 0.3, y)
  ctx.lineTo(x, y)
  ctx.closePath()
  ctx.fillStyle = '#1f2937'
  ctx.fill()
}

export const renderChainLightning = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  targets: { x: number; y: number }[],
  level: number
): void => {
  if (targets.length === 0) return

  const colors = ['#FFD700', '#FFEC8B', '#FFFACD']
  const colorIndex = Math.min(level - 1, colors.length - 1)
  const mainColor = colors[colorIndex]

  // Draw lightning from tower to first target
  drawLightningLine(ctx, startX, startY, targets[0].x, targets[0].y, mainColor, level)

  // Draw chain lightning between targets
  for (let i = 0; i < targets.length - 1; i++) {
    drawLightningLine(
      ctx,
      targets[i].x,
      targets[i].y,
      targets[i + 1].x,
      targets[i + 1].y,
      mainColor,
      level
    )
  }
}

const drawLightningLine = (
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  level: number
): void => {
  const segments = 5 + level * 2
  const offsetMagnitude = 8 + level * 2

  ctx.beginPath()
  ctx.moveTo(x1, y1)

  let currentX = x1
  let currentY = y1
  const dx = x2 - x1
  const dy = y2 - y1
  const dist = Math.sqrt(dx * dx + dy * dy)

  for (let i = 1; i < segments; i++) {
    const t = i / segments
    const targetX = x1 + dx * t
    const targetY = y1 + dy * t

    // Add zigzag offset
    const offset = (Math.random() - 0.5) * offsetMagnitude * (1 - Math.abs(t - 0.5) * 2)
    const perpX = -dy / dist * offset
    const perpY = dx / dist * offset

    currentX = targetX + perpX
    currentY = targetY + perpY

    ctx.lineTo(currentX, currentY)
  }

  ctx.lineTo(x2, y2)

  // Glow effect
  ctx.shadowColor = color
  ctx.shadowBlur = 10 + level * 3
  ctx.strokeStyle = color
  ctx.lineWidth = 2 + level * 0.5
  ctx.stroke()

  // Inner bright line
  ctx.shadowBlur = 0
  ctx.strokeStyle = '#FFFFFF'
  ctx.lineWidth = 1
  ctx.stroke()

  // Add impact points
  for (const target of [{ x: x1, y: y1 }, { x: x2, y: y2 }]) {
    ctx.beginPath()
    ctx.arc(target.x, target.y, 4 + level, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()

    ctx.beginPath()
    ctx.arc(target.x, target.y, 2 + level * 0.5, 0, Math.PI * 2)
    ctx.fillStyle = '#FFFFFF'
    ctx.fill()
  }
}