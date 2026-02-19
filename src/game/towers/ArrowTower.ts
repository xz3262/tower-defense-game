import { TowerStats } from '../../types'
import { TILE_SIZE } from '../config/GameConstants'
import { drawCircle, drawRing } from '../../utils/canvas'

export const arrowTowerStats: TowerStats = {
  type: 'arrow',
  name: 'Arrow Tower',
  cost: 50,
  damage: 10,
  range: 3,
  fireRate: 2,
  projectileSpeed: 8,
  upgradeCosts: [30, 60, 100],
  damagePerLevel: 5,
  rangePerLevel: 0.5,
  special: 'Fast attack, low damage, cheap',
  color: '#8B4513',
  canTargetFlying: true
}

const BASE_RADIUS = TILE_SIZE * 0.32
const TRIANGLE_SIZE = 8

export const renderArrowTower = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  level: number,
  isHovered: boolean = false
): void => {
  // Calculate radius based on level
  const radiusMultiplier = level >= 2 ? 1.15 : 1
  const radius = BASE_RADIUS * radiusMultiplier

  // Determine base color (level 4 is golden)
  const baseColor = level >= 4 ? '#FFD700' : arrowTowerStats.color
  const strokeColor = level >= 4 ? '#B8860B' : '#5D3A1A'

  // Draw range circle on hover
  if (isHovered) {
    const rangePixels = (arrowTowerStats.range + (level - 1) * arrowTowerStats.rangePerLevel) * TILE_SIZE
    drawRing(ctx, x, y, rangePixels - 2, rangePixels, 'rgba(167, 139, 250, 0.15)')
    ctx.beginPath()
    ctx.arc(x, y, rangePixels, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(167, 139, 250, 0.5)'
    ctx.lineWidth = 1
    ctx.stroke()
  }

  // Draw base circle (tower body)
  drawCircle(ctx, x, y, radius, baseColor, strokeColor, 2)

  // Draw inner circle
  const innerRadius = radius * 0.65
  drawCircle(ctx, x, y, innerRadius, strokeColor)

  // Draw triangle (arrow tip) pointing up
  ctx.beginPath()
  ctx.moveTo(x, y - radius * 0.9)
  ctx.lineTo(x - TRIANGLE_SIZE, y - radius * 0.4)
  ctx.lineTo(x + TRIANGLE_SIZE, y - radius * 0.4)
  ctx.closePath()
  ctx.fillStyle = level >= 4 ? '#FFEC8B' : '#D2691E'
  ctx.fill()
  ctx.strokeStyle = strokeColor
  ctx.lineWidth = 1
  ctx.stroke()

  // Level 3+: add ring
  if (level >= 3) {
    const ringRadius = radius * 1.25
    ctx.beginPath()
    ctx.arc(x, y, ringRadius, 0, Math.PI * 2)
    ctx.strokeStyle = level >= 4 ? '#FFD700' : '#CD853F'
    ctx.lineWidth = 2
    ctx.stroke()
  }

  // Draw level indicator for levels 2-4
  if (level >= 2) {
    const levelDotY = y + radius * 0.5
    const levelDotRadius = 4
    const levelColor = level >= 4 ? '#FFD700' : '#F5DEB3'
    drawCircle(ctx, x, levelDotY, levelDotRadius, levelColor, strokeColor, 1)
  }

  // Additional level dots for levels 3 and 4
  if (level >= 3) {
    const dotSpacing = 10
    drawCircle(ctx, x - dotSpacing, y + radius * 0.5, 3, levelColor, strokeColor, 1)
    drawCircle(ctx, x + dotSpacing, y + radius * 0.5, 3, levelColor, strokeColor, 1)
  }

  if (level >= 4) {
    // Add sparkle effect for golden tower
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 10px system-ui'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('★', x, y)
  }
}

const levelColor = level >= 4 ? '#FFD700' : '#F5DEB3'