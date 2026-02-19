import { TowerStats } from '../../types'
import { TILE_SIZE } from '../config/GameConstants'
import { drawCircle, drawRing } from '../../utils/canvas'

export const iceTowerStats: TowerStats = {
  type: 'ice',
  name: 'Ice Tower',
  cost: 120,
  damage: 8,
  range: 2.5,
  fireRate: 1.5,
  projectileSpeed: 6,
  upgradeCosts: [70, 140, 220],
  damagePerLevel: 4,
  rangePerLevel: 0.3,
  special: 'Slows enemies by 40%',
  color: '#ADD8E6',
  canTargetFlying: true
}

const BASE_RADIUS = TILE_SIZE * 0.35
const HEX_SIZE = 10

export const renderIceTower = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  level: number,
  showRange: boolean = false
): void => {
  const centerX = x * TILE_SIZE + TILE_SIZE / 2
  const centerY = y * TILE_SIZE + TILE_SIZE / 2
  const radius = BASE_RADIUS * (1 + (level - 1) * 0.15)

  const auraRadius = (iceTowerStats.range + (level - 1) * iceTowerStats.rangePerLevel) * TILE_SIZE
  drawRing(ctx, centerX, centerY, auraRadius - 2, auraRadius, 'rgba(103, 232, 249, 0.15)')
  ctx.beginPath()
  ctx.arc(centerX, centerY, auraRadius, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(103, 232, 249, 0.4)'
  ctx.lineWidth = 1
  ctx.setLineDash([5, 5])
  ctx.stroke()
  ctx.setLineDash([])

  if (showRange) {
    drawRing(ctx, centerX, centerY, auraRadius - 2, auraRadius, 'rgba(167, 139, 250, 0.15)')
    ctx.beginPath()
    ctx.arc(centerX, centerY, auraRadius, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(167, 139, 250, 0.5)'
    ctx.lineWidth = 1
    ctx.stroke()
  }

  if (level >= 2) {
    const glowGradient = ctx.createRadialGradient(centerX, centerY, radius * 0.5, centerX, centerY, radius * 1.8)
    glowGradient.addColorStop(0, 'rgba(103, 232, 249, 0.4)')
    glowGradient.addColorStop(0.5, 'rgba(103, 232, 249, 0.2)')
    glowGradient.addColorStop(1, 'rgba(103, 232, 249, 0)')
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 1.8, 0, Math.PI * 2)
    ctx.fillStyle = glowGradient
    ctx.fill()
  }

  drawCircle(ctx, centerX, centerY, radius, '#1e3a8a', '#1e3a8a', 2)
  drawCircle(ctx, centerX, centerY, radius * 0.7, '#ADD8E6', '#67E8F9', 1)
  drawHexagon(ctx, centerX, centerY, HEX_SIZE + level * 2, '#E0F2FE')

  if (level >= 2) {
    const crystalCount = Math.min(level - 1, 3)
    for (let i = 0; i < crystalCount; i++) {
      const angle = (i / crystalCount) * Math.PI * 2 - Math.PI / 2
      const dist = radius * 0.5
      const cx = centerX + Math.cos(angle) * dist
      const cy = centerY + Math.sin(angle) * dist
      drawHexagon(ctx, cx, cy, 5, '#BAE6FD')
    }
  }

  drawSparkles(ctx, centerX, centerY, level)

  if (level > 1) {
    const levelColor = level === 4 ? '#fbbf24' : '#f8fafc'
    ctx.fillStyle = levelColor
    ctx.font = 'bold 10px system-ui'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(level), centerX, centerY)
  }
}

const drawHexagon = (ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string): void => {
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 - Math.PI / 2
    const px = cx + Math.cos(angle) * size
    const py = cy + Math.sin(angle) * size
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
  ctx.strokeStyle = '#0EA5E9'
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 - Math.PI / 2
    const px = cx + Math.cos(angle) * size * 0.5
    const py = cy + Math.sin(angle) * size * 0.5
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
  ctx.fillStyle = '#F0F9FF'
  ctx.fill()
}

const drawSparkles = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, level: number): void => {
  const sparkleCount = 4 + level * 2
  const time = Date.now() / 200

  for (let i = 0; i < sparkleCount; i++) {
    const angle = (i / sparkleCount) * Math.PI * 2 + time
    const dist = 8 + Math.sin(time + i) * 3
    const sx = centerX + Math.cos(angle) * dist
    const sy = centerY + Math.sin(angle) * dist
    const sparkleSize = 1.5 + Math.sin(time * 2 + i) * 1

    ctx.beginPath()
    ctx.arc(sx, sy, sparkleSize, 0, Math.PI * 2)
    ctx.fillStyle = i % 2 === 0 ? '#FFFFFF' : '#BAE6FD'
    ctx.fill()
  }
}

export const renderIceShard = (ctx: CanvasRenderingContext2D, x: number, y: number, angle: number): void => {
  const size = 6

  const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2)
  glowGradient.addColorStop(0, 'rgba(103, 232, 249, 0.5)')
  glowGradient.addColorStop(1, 'rgba(103, 232, 249, 0)')
  ctx.beginPath()
  ctx.arc(x, y, size * 2, 0, Math.PI * 2)
  ctx.fillStyle = glowGradient
  ctx.fill()

  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle)

  ctx.beginPath()
  ctx.moveTo(size, 0)
  ctx.lineTo(size * 0.3, -size * 0.6)
  ctx.lineTo(-size * 0.5, 0)
  ctx.lineTo(size * 0.3, size * 0.6)
  ctx.closePath()
  ctx.fillStyle = '#67E8F9'
  ctx.fill()
  ctx.strokeStyle = '#0EA5E9'
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(size * 0.3, 0)
  ctx.lineTo(0, -size * 0.2)
  ctx.lineTo(-size * 0.2, 0)
  ctx.lineTo(0, size * 0.2)
  ctx.closePath()
  ctx.fillStyle = '#F0F9FF'
  ctx.fill()

  ctx.restore()
}
