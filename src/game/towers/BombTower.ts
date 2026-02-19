import { TowerStats } from '../../types'
import { TILE_SIZE } from '../config/GameConstants'

export const bombTowerStats: TowerStats = {
  type: 'bomb',
  name: 'Bomb Tower',
  cost: 180,
  damage: 50,
  range: 2,
  fireRate: 0.6,
  projectileSpeed: 4,
  upgradeCosts: [100, 200, 320],
  damagePerLevel: 25,
  rangePerLevel: 0.2,
  special: 'High splash damage, area explosion',
  color: '#1f2937',
  canTargetFlying: false
}

export const renderBombTower = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  level: number
): void => {
  const centerX = x * TILE_SIZE + TILE_SIZE / 2
  const centerY = y * TILE_SIZE + TILE_SIZE / 2
  const baseRadius = 14
  const levelMultiplier = 1 + (level - 1) * 0.15
  const radius = baseRadius * levelMultiplier

  // Red glow for higher levels
  if (level >= 3) {
    const glowGradient = ctx.createRadialGradient(
      centerX, centerY, radius * 0.5,
      centerX, centerY, radius * 1.5
    )
    glowGradient.addColorStop(0, 'rgba(239, 68, 68, 0.4)')
    glowGradient.addColorStop(1, 'rgba(239, 68, 68, 0)')
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 1.5, 0, Math.PI * 2)
    ctx.fillStyle = glowGradient
    ctx.fill()
  }

  // Base circle (dark)
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  ctx.fillStyle = '#1f2937'
  ctx.fill()
  ctx.strokeStyle = '#374151'
  ctx.lineWidth = 2
  ctx.stroke()

  // Inner circle
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius * 0.7, 0, Math.PI * 2)
  ctx.fillStyle = '#111827'
  ctx.fill()

  // Bomb icon - main body
  ctx.beginPath()
  ctx.arc(centerX, centerY + 2, radius * 0.45, 0, Math.PI * 2)
  ctx.fillStyle = '#374151'
  ctx.fill()

  // Fuse
  const fuseStartY = centerY - radius * 0.35
  ctx.beginPath()
  ctx.moveTo(centerX, fuseStartY)
  ctx.quadraticCurveTo(
    centerX + 4,
    fuseStartY - 6,
    centerX + 2,
    fuseStartY - 10
  )
  ctx.strokeStyle = '#9ca3af'
  ctx.lineWidth = 2
  ctx.stroke()

  // Fuse spark
  ctx.beginPath()
  ctx.arc(centerX + 2, fuseStartY - 12, 3, 0, Math.PI * 2)
  ctx.fillStyle = '#fbbf24'
  ctx.fill()

  // Spark glow
  ctx.beginPath()
  ctx.arc(centerX + 2, fuseStartY - 12, 5, 0, Math.PI * 2)
  const sparkGradient = ctx.createRadialGradient(
    centerX + 2, fuseStartY - 12, 0,
    centerX + 2, fuseStartY - 12, 5
  )
  sparkGradient.addColorStop(0, 'rgba(251, 191, 36, 0.8)')
  sparkGradient.addColorStop(1, 'rgba(251, 191, 36, 0)')
  ctx.fillStyle = sparkGradient
  ctx.fill()

  // Level indicator for level 2+
  if (level >= 2) {
    const levelColor = level === 4 ? '#ef4444' : level === 3 ? '#f59e0b' : '#06b6d4'
    ctx.beginPath()
    ctx.arc(centerX + radius * 0.5, centerY - radius * 0.5, 5, 0, Math.PI * 2)
    ctx.fillStyle = levelColor
    ctx.fill()
    ctx.strokeStyle = '#1f2937'
    ctx.lineWidth = 1
    ctx.stroke()
  }

  // Level number for level 3+
  if (level >= 3) {
    ctx.fillStyle = '#f8fafc'
    ctx.font = 'bold 10px system-ui'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(level), centerX, centerY)
  }
}
