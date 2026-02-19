import { TowerStats } from '../../types'
import { TILE_SIZE } from '../config/GameConstants'
import { drawCircle, drawRing } from '../../utils/canvas'

export const cannonTowerStats: TowerStats = {
  type: 'cannon',
  name: 'Cannon Tower',
  cost: 100,
  damage: 30,
  range: 2.5,
  fireRate: 0.8,
  projectileSpeed: 5,
  upgradeCosts: [60, 120, 200],
  damagePerLevel: 15,
  rangePerLevel: 0.3,
  special: 'Splash damage to enemies in radius',
  color: '#2F4F4F',
  canTargetFlying: false
}

const BASE_RADIUS = 14
const BARREL_LENGTH = 12
const BARREL_WIDTH = 6

export const renderCannonTower = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  level: number,
  targetAngle: number = 0,
  showRange: boolean = false
): void => {
  // Calculate level-based adjustments
  const levelScale = 1 + (level - 1) * 0.15
  const radius = BASE_RADIUS * levelScale
  
  // Darker color for higher levels
  const baseColor = '#2F4F4F' // Dark slate gray
  const levelDarken = Math.min(level - 1, 3) * 20
  const towerColor = darkenColor(baseColor, levelDarken)
  
  // Draw range indicator on hover
  if (showRange) {
    const rangePixels = cannonTowerStats.range * TILE_SIZE + (level - 1) * cannonTowerStats.rangePerLevel * TILE_SIZE
    const splashRadius = 50 * levelScale // Visual splash radius indicator
    
    // Outer range ring
    drawRing(ctx, x, y, rangePixels - 2, rangePixels, 'rgba(167, 139, 250, 0.15)')
    ctx.beginPath()
    ctx.arc(x, y, rangePixels, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(167, 139, 250, 0.5)'
    ctx.lineWidth = 1
    ctx.stroke()
    
    // Splash radius indicator (semi-transparent)
    ctx.beginPath()
    ctx.arc(x, y, splashRadius, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(251, 146, 60, 0.15)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(251, 146, 60, 0.4)'
    ctx.setLineDash([4, 4])
    ctx.stroke()
    ctx.setLineDash([])
  }
  
  // Draw base platform
  drawCircle(ctx, x, y, radius + 4, '#1f2937', '#374151', 2)
  
  // Draw tower body
  drawCircle(ctx, x, y, radius, towerColor, '#1f2937', 2)
  
  // Draw cannon barrel
  const barrelEndX = x + Math.cos(targetAngle) * BARREL_LENGTH * levelScale
  const barrelEndY = y + Math.sin(targetAngle) * BARREL_LENGTH * levelScale
  
  // Barrel base (circle at connection point)
  drawCircle(ctx, x, y, BARREL_WIDTH * 0.8 * levelScale, '#4b5563', '#1f2937', 1)
  
  // Barrel body
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(barrelEndX, barrelEndY)
  ctx.strokeStyle = '#4b5563'
  ctx.lineWidth = BARREL_WIDTH * levelScale
  ctx.lineCap = 'round'
  ctx.stroke()
  
  // Barrel tip
  const tipRadius = BARREL_WIDTH * 0.6 * levelScale
  drawCircle(ctx, barrelEndX, barrelEndY, tipRadius, '#374151', '#1f2937', 1)
  
  // Level indicator
  if (level > 1) {
    const indicatorY = y - radius - 8
    ctx.fillStyle = '#f8fafc'
    ctx.font = 'bold 10px system-ui'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(level), x, indicatorY)
    
    // Draw level dots
    for (let i = 0; i < level; i++) {
      const dotX = x - (level - 1) * 4 + i * 8
      const dotY = indicatorY + 10
      drawCircle(ctx, dotX, dotY, 2, '#fbbf24')
    }
  }
}

function darkenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  let r = (num >> 16) - amount
  let g = ((num >> 8) & 0x00ff) - amount
  let b = (num & 0x0000ff) - amount
  
  r = Math.max(0, r)
  g = Math.max(0, g)
  b = Math.max(0, b)
  
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}
