import { TowerStats } from '../../types'
import { TILE_SIZE } from '../config/GameConstants'

export const fireTowerStats: TowerStats = {
  type: 'fire',
  name: 'Fire Tower',
  cost: 150,
  damage: 15,
  range: 2.5,
  fireRate: 1,
  projectileSpeed: 5,
  upgradeCosts: [90, 180, 280],
  damagePerLevel: 8,
  rangePerLevel: 0.3,
  special: 'Applies burn DoT (5 damage/sec for 3s)',
  color: '#FF4500',
  canTargetFlying: true
}

export const renderFireTower = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  level: number
): void => {
  const centerX = x
  const centerY = y
  const radius = TILE_SIZE * 0.38

  // Warm glow effect behind the tower
  const gradient = ctx.createRadialGradient(
    centerX, centerY, 0,
    centerX, centerY, radius * 1.8
  )
  gradient.addColorStop(0, 'rgba(255, 100, 0, 0.4)')
  gradient.addColorStop(0.5, 'rgba(255, 69, 0, 0.2)')
  gradient.addColorStop(1, 'rgba(255, 69, 0, 0)')
  
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius * 1.8, 0, Math.PI * 2)
  ctx.fillStyle = gradient
  ctx.fill()

  // Main tower body - red/orange circle
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  ctx.fillStyle = '#DC2626'
  ctx.fill()
  ctx.strokeStyle = '#991B1B'
  ctx.lineWidth = 2
  ctx.stroke()

  // Inner circle
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius * 0.65, 0, Math.PI * 2)
  ctx.fillStyle = '#F97316'
  ctx.fill()

  // Draw flame triangles on top - more flames for higher levels
  const numFlames = Math.min(3 + Math.floor((level - 1) / 1), 6)
  const flameHeight = 8 + level * 2
  const flameWidth = 6 + level
  const startX = centerX - ((numFlames - 1) * (flameWidth + 2)) / 2

  for (let i = 0; i < numFlames; i++) {
    const flameX = startX + i * (flameWidth + 2)
    const flameY = centerY - radius * 0.6
    
    // Vary flame height slightly for natural look
    const heightVariation = Math.sin(i * 1.5 + performance.now() / 100) * 2
    const currentHeight = flameHeight + heightVariation

    // Outer flame (orange)
    ctx.beginPath()
    ctx.moveTo(flameX, flameY - currentHeight)
    ctx.lineTo(flameX - flameWidth / 2, flameY)
    ctx.lineTo(flameX + flameWidth / 2, flameY)
    ctx.closePath()
    ctx.fillStyle = '#F97316'
    ctx.fill()

    // Inner flame (yellow)
    ctx.beginPath()
    ctx.moveTo(flameX, flameY - currentHeight * 0.6)
    ctx.lineTo(flameX - flameWidth / 3, flameY - currentHeight * 0.15)
    ctx.lineTo(flameX + flameWidth / 3, flameY - currentHeight * 0.15)
    ctx.closePath()
    ctx.fillStyle = '#FBBF24'
    ctx.fill()
  }

  // Level indicator for level 2+
  if (level >= 2) {
    const levelColor = level === 4 ? '#FBBF24' : '#F8FAFC'
    ctx.beginPath()
    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2)
    ctx.fillStyle = levelColor
    ctx.fill()
    ctx.strokeStyle = '#1F2937'
    ctx.lineWidth = 1
    ctx.stroke()
  }
}
