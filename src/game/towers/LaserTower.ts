import { TowerStats } from '../../types'
import { TILE_SIZE } from '../config/GameConstants'
import { drawCircle, drawLine } from '../../utils/canvas'

export const laserTowerStats: TowerStats = {
  type: 'laser',
  name: 'Laser Tower',
  cost: 220,
  damage: 20,
  range: 3,
  fireRate: 10,
  projectileSpeed: 0,
  upgradeCosts: [130, 260, 400],
  damagePerLevel: 10,
  rangePerLevel: 0.5,
  special: 'Continuous beam, instant damage',
  color: '#FF0000',
  canTargetFlying: true
}

export const renderLaserTower = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  level: number,
  targetX?: number,
  targetY?: number
): void => {
  const centerX = x * TILE_SIZE + TILE_SIZE / 2
  const centerY = y * TILE_SIZE + TILE_SIZE / 2
  const baseRadius = 14

  // Draw metallic base
  const gradient = ctx.createRadialGradient(
    centerX - 3, centerY - 3, 0,
    centerX, centerY, baseRadius
  )
  gradient.addColorStop(0, '#9ca3af')
  gradient.addColorStop(0.5, '#6b7280')
  gradient.addColorStop(1, '#374151')

  drawCircle(ctx, centerX, centerY, baseRadius, gradient, '#1f2937', 2)

  // Draw metallic ring
  drawCircle(ctx, centerX, centerY, baseRadius - 3, 'transparent', '#9ca3af', 1)

  // Draw glowing orb on top based on level
  const orbRadius = 6 + level
  const orbGlow = ctx.createRadialGradient(
    centerX, centerY - 2, 0,
    centerX, centerY, orbRadius
  )

  // Different colors for different levels
  const orbColors: Record<number, { inner: string; outer: string }> = {
    1: { inner: '#ff6b6b', outer: '#dc2626' },
    2: { inner: '#fde047', outer: '#eab308' },
    3: { inner: '#4ade80', outer: '#22c55e' },
    4: { inner: '#a78bfa', outer: '#8b5cf6' }
  }

  const colors = orbColors[level] || orbColors[1]
  orbGlow.addColorStop(0, colors.inner)
  orbGlow.addColorStop(0.6, colors.outer)
  orbGlow.addColorStop(1, 'rgba(0,0,0,0.3)')

  // Draw orb glow
  ctx.beginPath()
  ctx.arc(centerX, centerY, orbRadius + 4, 0, Math.PI * 2)
  ctx.fillStyle = `rgba(${hexToRgb(colors.outer)}, 0.3)`
  ctx.fill()

  // Draw orb
  drawCircle(ctx, centerX, centerY, orbRadius, orbGlow)

  // Draw center highlight
  drawCircle(ctx, centerX - 2, centerY - 2, 2, '#ffffff')

  // Draw laser beam to target if provided
  if (targetX !== undefined && targetY !== undefined) {
    drawLaserBeam(ctx, centerX, centerY, targetX, targetY, level)
  }
}

const drawLaserBeam = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  level: number
): void => {
  // Calculate beam width and opacity based on level
  const baseWidth = 2 + level * 1.5
  const opacity = 0.6 + level * 0.1

  // Draw outer glow
  ctx.beginPath()
  ctx.moveTo(startX, startY)
  ctx.lineTo(endX, endY)
  ctx.strokeStyle = `rgba(239, 68, 68, ${opacity * 0.3})`
  ctx.lineWidth = baseWidth + 6
  ctx.lineCap = 'round'
  ctx.stroke()

  // Draw middle glow
  ctx.beginPath()
  ctx.moveTo(startX, startY)
  ctx.lineTo(endX, endY)
  ctx.strokeStyle = `rgba(251, 191, 36, ${opacity * 0.5})`
  ctx.lineWidth = baseWidth + 2
  ctx.stroke()

  // Draw core beam
  ctx.beginPath()
  ctx.moveTo(startX, startY)
  ctx.lineTo(endX, endY)
  ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
  ctx.lineWidth = baseWidth
  ctx.stroke()

  // Draw impact point
  const impactGradient = ctx.createRadialGradient(endX, endY, 0, endX, endY, baseWidth * 2)
  impactGradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`)
  impactGradient.addColorStop(0.5, `rgba(251, 191, 36, ${opacity * 0.5})`)
  impactGradient.addColorStop(1, 'rgba(239, 68, 68, 0)')

  ctx.beginPath()
  ctx.arc(endX, endY, baseWidth * 2, 0, Math.PI * 2)
  ctx.fillStyle = impactGradient
  ctx.fill()
}

const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (result) {
    return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
  }
  return '255, 0, 0'
}