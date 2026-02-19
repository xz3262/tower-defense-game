import { TowerStats } from '../../types'
import { TILE_SIZE } from '../config/GameConstants'
import { drawCircle, drawRect, drawLine } from '../../utils/canvas'

export const sniperTowerStats: TowerStats = {
  type: 'sniper',
  name: 'Sniper Tower',
  cost: 200,
  damage: 80,
  range: 5,
  fireRate: 0.4,
  projectileSpeed: 20,
  upgradeCosts: [120, 240, 380],
  damagePerLevel: 40,
  rangePerLevel: 0.5,
  special: 'Long range, high damage, slow fire rate',
  color: '#4B0082',
  canTargetFlying: true
}

export const renderSniperTower = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  level: number
): void => {
  const centerX = x * TILE_SIZE + TILE_SIZE / 2
  const centerY = y * TILE_SIZE + TILE_SIZE / 2
  
  // Tower base - dark purple
  drawRect(ctx, centerX - 8, centerY - 14, 16, 28, '#2d1a4a', '#1a0f2e', 2)
  
  // Tower body - tall thin rectangle
  const bodyColor = level === 4 ? '#7c3aed' : level === 3 ? '#6366f1' : level === 2 ? '#818cf8' : '#4B0082'
  drawRect(ctx, centerX - 5, centerY - 12, 10, 24, bodyColor, '#1a0f2e', 1)
  
  // Scope mount - horizontal bar at top
  drawRect(ctx, centerX - 10, centerY - 16, 20, 4, '#374151', '#1f2937', 1)
  
  // Scope - vertical tube
  drawRect(ctx, centerX - 2, centerY - 22, 4, 12, '#1f2937', '#111827', 1)
  
  // Scope lens - circle at top
  drawCircle(ctx, centerX, centerY - 24, 5, '#0ea5e9', '#0284c7', 1)
  
  // Inner lens reflection
  drawCircle(ctx, centerX - 1, centerY - 25, 2, '#e0f2fe')
  
  // Crosshair detail for level 2+
  if (level >= 2) {
    // Horizontal crosshair line
    drawLine(ctx, centerX - 6, centerY - 24, centerX + 6, centerY - 24, '#94a3b8', 1)
    // Vertical crosshair line  
    drawLine(ctx, centerX, centerY - 28, centerX, centerY - 20, '#94a3b8', 1)
  }
  
  // Additional crosshair circles for level 3+
  if (level >= 3) {
    drawCircle(ctx, centerX, centerY - 24, 3, 'transparent', '#94a3b8', 1)
  }
  
  // Full scope reticle for level 4
  if (level >= 4) {
    drawCircle(ctx, centerX, centerY - 24, 6, 'transparent', '#fbbf24', 1)
    // Extra detail lines
    drawLine(ctx, centerX - 3, centerY - 27, centerX - 3, centerY - 21, '#fbbf24', 1)
    drawLine(ctx, centerX + 3, centerY - 27, centerX + 3, centerY - 21, '#fbbf24', 1)
  }
  
  // Level indicator
  if (level > 1) {
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 10px system-ui'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(level), centerX, centerY + 4)
  }
}

export const renderSniperTowerRange = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  range: number,
  level: number
): void => {
  const centerX = x * TILE_SIZE + TILE_SIZE / 2
  const centerY = y * TILE_SIZE + TILE_SIZE / 2
  const rangePixels = range * TILE_SIZE
  
  // Fill range area
  ctx.fillStyle = 'rgba(167, 139, 250, 0.1)'
  ctx.beginPath()
  ctx.arc(centerX, centerY, rangePixels, 0, Math.PI * 2)
  ctx.fill()
  
  // Range ring
  ctx.strokeStyle = 'rgba(167, 139, 250, 0.5)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(centerX, centerY, rangePixels, 0, Math.PI * 2)
  ctx.stroke()
  
  // Additional range indicators for higher levels
  if (level >= 2) {
    ctx.strokeStyle = 'rgba(167, 139, 250, 0.2)'
    ctx.beginPath()
    ctx.arc(centerX, centerY, rangePixels * 0.66, 0, Math.PI * 2)
    ctx.stroke()
  }
  
  if (level >= 3) {
    ctx.strokeStyle = 'rgba(167, 139, 250, 0.15)'
    ctx.beginPath()
    ctx.arc(centerX, centerY, rangePixels * 0.33, 0, Math.PI * 2)
    ctx.stroke()
  }
  
  // Cross pattern on range (sniper aesthetic)
  ctx.strokeStyle = 'rgba(167, 139, 250, 0.15)'
  ctx.setLineDash([5, 5])
  ctx.beginPath()
  ctx.moveTo(centerX - rangePixels, centerY)
  ctx.lineTo(centerX + rangePixels, centerY)
  ctx.moveTo(centerX, centerY - rangePixels)
  ctx.lineTo(centerX, centerY + rangePixels)
  ctx.stroke()
  ctx.setLineDash([])
}
