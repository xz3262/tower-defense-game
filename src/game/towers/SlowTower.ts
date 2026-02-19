import { TowerStats } from '../../types'
import { TILE_SIZE } from '../config/GameConstants'
import { drawCircle, drawRing } from '../../utils/canvas'

export const slowTowerStats: TowerStats = {
  type: 'slow',
  name: 'Slow Tower',
  cost: 140,
  damage: 2,
  range: 3,
  fireRate: 0,
  projectileSpeed: 0,
  upgradeCosts: [80, 160, 260],
  damagePerLevel: 1,
  rangePerLevel: 0.5,
  special: 'Aura slows all enemies in range by 30%',
  color: '#87CEEB',
  canTargetFlying: true
}

export const renderSlowTower = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  level: number
): void => {
  const centerX = x * TILE_SIZE + TILE_SIZE / 2
  const centerY = y * TILE_SIZE + TILE_SIZE / 2
  const baseRadius = TILE_SIZE * 0.35

  // Draw base circle (blue/white)
  drawCircle(ctx, centerX, centerY, baseRadius, '#374151', '#1f2937', 2)

  // Draw inner circle (ice blue)
  drawCircle(ctx, centerX, centerY, baseRadius * 0.7, '#87CEEB', '#67E8F9', 1)

  // Draw snowflake pattern
  drawSnowflake(ctx, centerX, centerY, baseRadius * 0.4)

  // Draw level indicator
  if (level > 1) {
    const levelColor = level === 4 ? '#fbbf24' : '#f8fafc'
    ctx.fillStyle = levelColor
    ctx.font = 'bold 12px system-ui'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(level), centerX, centerY)
  }

  // Draw aura ring (always visible for slow tower)
  const auraRadius = (slowTowerStats.range + (level - 1) * slowTowerStats.rangePerLevel) * TILE_SIZE
  drawRing(ctx, centerX, centerY, auraRadius - 2, auraRadius, 'rgba(103, 232, 249, 0.15)')
  ctx.beginPath()
  ctx.arc(centerX, centerY, auraRadius, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(103, 232, 259, 0.4)'
  ctx.lineWidth = 1
  ctx.setLineDash([5, 5])
  ctx.stroke()
  ctx.setLineDash([])
}

const drawSnowflake = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number
): void => {
  ctx.strokeStyle = '#f8fafc'
  ctx.lineWidth = 2

  // Draw 6 lines radiating from center (snowflake arms)
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2
    const endX = cx + Math.cos(angle) * size
    const endY = cy + Math.sin(angle) * size

    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(endX, endY)
    ctx.stroke()

    // Draw branches on each arm
    const branchLength = size * 0.4
    const branchAngle = Math.PI / 4

    const branch1X = cx + Math.cos(angle + branchAngle) * branchLength
    const branch1Y = cy + Math.sin(angle + branchAngle) * branchLength
    const branch1StartX = cx + Math.cos(angle) * size * 0.5
    const branch1StartY = cy + Math.sin(angle) * size * 0.5

    ctx.beginPath()
    ctx.moveTo(branch1StartX, branch1StartY)
    ctx.lineTo(branch1X, branch1Y)
    ctx.stroke()

    const branch2X = cx + Math.cos(angle - branchAngle) * branchLength
    const branch2Y = cy + Math.sin(angle - branchAngle) * branchLength

    ctx.beginPath()
    ctx.moveTo(branch1StartX, branch1StartY)
    ctx.lineTo(branch2X, branch2Y)
    ctx.stroke()
  }

  // Draw center dot
  ctx.beginPath()
  ctx.arc(cx, cy, 2, 0, Math.PI * 2)
  ctx.fillStyle = '#f8fafc'
  ctx.fill()
}

export const renderSlowTowerRange = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  range: number,
  level: number
): void => {
  const centerX = x * TILE_SIZE + TILE_SIZE / 2
  const centerY = y * TILE_SIZE + TILE_SIZE / 2
  const rangePixels = (range + (level - 1) * slowTowerStats.rangePerLevel) * TILE_SIZE

  // Draw range aura
  drawRing(ctx, centerX, centerY, rangePixels - 2, rangePixels, 'rgba(103, 232, 249, 0.2)')
  ctx.beginPath()
  ctx.arc(centerX, centerY, rangePixels, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(103, 232, 249, 0.6)'
  ctx.lineWidth = 2
  ctx.stroke()
}
