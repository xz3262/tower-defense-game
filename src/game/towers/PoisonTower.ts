import { TowerStats } from '../../types'
import { TILE_SIZE } from '../config/GameConstants'
import { drawCircle } from '../../utils/canvas'

export const poisonTowerStats: TowerStats = {
  type: 'poison',
  name: 'Poison Tower',
  cost: 160,
  damage: 5,
  range: 2.5,
  fireRate: 1.5,
  projectileSpeed: 4,
  upgradeCosts: [90, 180, 290],
  damagePerLevel: 3,
  rangePerLevel: 0.3,
  special: 'Creates poison cloud, damages all in area',
  color: '#32CD32',
  canTargetFlying: false
}

export const renderPoisonTower = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  level: number
): void => {
  const centerX = x * TILE_SIZE + TILE_SIZE / 2
  const centerY = y * TILE_SIZE + TILE_SIZE / 2
  const baseRadius = TILE_SIZE * 0.35

  // Draw base shadow
  ctx.beginPath()
  ctx.arc(centerX, centerY + 2, baseRadius, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
  ctx.fill()

  // Draw main tower body - green/purple gradient effect
  const gradient = ctx.createRadialGradient(
    centerX - 3,
    centerY - 3,
    0,
    centerX,
    centerY,
    baseRadius
  )
  gradient.addColorStop(0, '#84cc16')
  gradient.addColorStop(0.5, '#32CD32')
  gradient.addColorStop(1, '#228B22')

  drawCircle(ctx, centerX, centerY, baseRadius, gradient, '#1a1a1a', 2)


  // Draw bubbling top effect
  const bubbleCount = 3 + level
  for (let i = 0; i < bubbleCount; i++) {
    const bubbleAngle = (i / bubbleCount) * Math.PI * 2 + Date.now() / 500
    const bubbleRadius = 3 + Math.sin(Date.now() / 200 + i) * 1.5
    const bubbleDist = baseRadius * 0.4
    const bx = centerX + Math.cos(bubbleAngle) * bubbleDist
    const by = centerY + Math.sin(bubbleAngle) * bubbleDist * 0.5 - baseRadius * 0.2

    ctx.beginPath()
    ctx.arc(bx, by, bubbleRadius, 0, Math.PI * 2)
    ctx.fillStyle = i % 2 === 0 ? '#a855f7' : '#84cc16'
    ctx.fill()
  }

  // Draw center bubble
  ctx.beginPath()
  ctx.arc(centerX, centerY - 2, 4, 0, Math.PI * 2)
  ctx.fillStyle = '#a855f7'
  ctx.fill()

  // Draw level indicator
  if (level > 1) {
    const levelColor = level === 4 ? '#fbbf24' : '#f8fafc'
    ctx.beginPath()
    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2)
    ctx.fillStyle = levelColor
    ctx.fill()
    ctx.fillStyle = '#1f2937'
    ctx.font = 'bold 8px system-ui'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(level), centerX, centerY)
  }

  // Draw poison cloud aura for higher levels
  if (level >= 2) {
    const cloudRadius = baseRadius * (0.8 + level * 0.3)
    const cloudGradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      cloudRadius
    )
    cloudGradient.addColorStop(0, 'rgba(132, 204, 22, 0.3)'
    cloudGradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.2)'
    cloudGradient.addColorStop(1, 'rgba(132, 204, 22, 0)'

    ctx.beginPath()
    ctx.arc(centerX, centerY, cloudRadius, 0, Math.PI * 2)
    ctx.fillStyle = cloudGradient
    ctx.fill()
  }
}

export const renderPoisonCloud = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  level: number,
  alpha: number = 1
): void => {
  const baseRadius = TILE_SIZE * 0.5 * (1 + level * 0.25)

  // Multiple cloud layers for depth
  for (let i = 3; i >= 0; i--) {
    const layerRadius = baseRadius * (0.6 + i * 0.15)
    const layerAlpha = alpha * (0.15 - i * 0.03)

    ctx.beginPath()
    ctx.arc(x, y, layerRadius, 0, Math.PI * 2)

    if (i % 2 === 0) {
      ctx.fillStyle = `rgba(132, 204, 22, ${layerAlpha})`
    } else {
      ctx.fillStyle = `rgba(168, 85, 247, ${layerAlpha})`
    }
    ctx.fill()
  }

  // Animated bubbles within cloud
  const bubbleCount = 4 + level * 2
  for (let i = 0; i < bubbleCount; i++) {
    const angle = (i / bubbleCount) * Math.PI * 2 + Date.now() / 300
    const dist = baseRadius * 0.5 * Math.sin(Date.now() / 400 + i)
    const bx = x + Math.cos(angle) * dist
    const by = y + Math.sin(angle) * dist
    const bubbleSize = 2 + Math.sin(Date.now() / 200 + i * 2) * 1.5

    ctx.beginPath()
    ctx.arc(bx, by, bubbleSize, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(168, 85, 247, ${alpha * 0.6})`
    ctx.fill()
  }
}
