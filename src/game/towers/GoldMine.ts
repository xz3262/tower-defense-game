import { TowerStats } from '../../types'
import { TILE_SIZE } from '../config/GameConstants'
import { drawCircle } from '../../utils/canvas'

const GOLD_MINE_RADIUS = 14
const COIN_SIZE = 6

export const goldMineStats: TowerStats = {
  type: 'goldmine',
  name: 'Gold Mine',
  cost: 250,
  damage: 0,
  range: 0,
  fireRate: 0,
  projectileSpeed: 0,
  upgradeCosts: [150, 300, 450],
  damagePerLevel: 0,
  rangePerLevel: 0,
  special: 'Generates 10 gold every 5 seconds per level',
  color: '#DAA520',
  canTargetFlying: false
}

const BASE_GOLD_PER_TICK = 10
const GOLD_TICK_INTERVAL = 5 // seconds

export const getGoldMineIncome = (level: number): number => {
  return BASE_GOLD_PER_TICK * level
}

export const getGoldMineTickInterval = (): number => {
  return GOLD_TICK_INTERVAL
}

export const renderGoldMine = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  level: number
): void => {
  const centerX = x * TILE_SIZE + TILE_SIZE / 2
  const centerY = y * TILE_SIZE + TILE_SIZE / 2

  // Base circle (golden)
  drawCircle(ctx, centerX, centerY, GOLD_MINE_RADIUS, '#DAA520', '#1f2937', 2)


  // Inner circle
  drawCircle(ctx, centerX, centerY, GOLD_MINE_RADIUS * 0.75, '#FFD700')

  // Coin symbol (dollar sign or circle with inner dot)
  drawCoinSymbol(ctx, centerX, centerY, level)

  // Level indicator
  if (level > 1) {
    const levelColor = level === 4 ? '#fbbf24' : '#f8fafc'
    drawCircle(ctx, centerX, centerY - 8, 4, levelColor)
  }
}

const drawCoinSymbol = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  level: number
): void => {
  // Draw coin circle
  ctx.beginPath()
  ctx.arc(centerX, centerY, COIN_SIZE, 0, Math.PI * 2)
  ctx.fillStyle = '#FFD700'
  ctx.fill()
  ctx.strokeStyle = '#B8860B'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Inner dollar sign or circle
  ctx.fillStyle = '#B8860B'
  ctx.font = 'bold 8px system-ui'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('$', centerX, centerY)

  // Level-based glow effect for higher levels
  if (level >= 3) {
    ctx.beginPath()
    ctx.arc(centerX, centerY, GOLD_MINE_RADIUS + 4, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)'
    ctx.lineWidth = 2
    ctx.stroke()
  }

  if (level >= 4) {
    ctx.beginPath()
    ctx.arc(centerX, centerY, GOLD_MINE_RADIUS + 8, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.2)'
    ctx.lineWidth = 3
    ctx.stroke()
  }
}

export const renderGoldMineFloatingText = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  amount: number,
  progress: number
): void => {
  const centerX = x * TILE_SIZE + TILE_SIZE / 2
  const centerY = y * TILE_SIZE + TILE_SIZE / 2

  // Float upward animation
  const offsetY = -20 * progress
  const alpha = 1 - progress

  ctx.font = 'bold 14px system-ui'
  ctx.fillStyle = `rgba(251, 191, 36, ${alpha})` // Gold color with fading
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(`+${amount}`, centerX, centerY + offsetY)
}
