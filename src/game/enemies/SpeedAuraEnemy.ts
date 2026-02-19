import { EnemyStats } from '../../types'
import { enemyConfig } from '../config/EnemyConfig'
import { drawCircle, drawHealthBar } from '../../utils/canvas'

const SPEED_AURA_COLOR = '#f97316'
const SPEED_AURA_SIZE = 12
const AURA_RADIUS = 80 // Pixels - range of speed buff
const SPEED_BOOST = 1.5 // 50% speed boost to nearby enemies

export const speedAuraEnemyStats: EnemyStats = enemyConfig.speedaura

export const renderSpeedAuraEnemy = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  hp: number,
  maxHP: number
): void => {
  // Draw aura ring (visible buff area)
  drawAuraRing(ctx, x, y)

  // Draw speed lines behind the enemy (motion effect)
  drawSpeedLines(ctx, x, y)

  // Draw main body - orange circle
  drawCircle(
    ctx,
    x,
    y,
    SPEED_AURA_SIZE,
    SPEED_AURA_COLOR,
    '#9a3412',
    2
  )

  // Draw inner circle (lighter orange)
  drawCircle(
    ctx,
    x,
    y,
    SPEED_AURA_SIZE * 0.6,
    '#fdba74'
  )

  // Draw center dot
  drawCircle(
    ctx,
    x,
    y,
    3,
    '#fff7ed'
  )

  // Draw health bar above enemy
  const healthBarY = y - SPEED_AURA_SIZE - 10
  drawHealthBar(ctx, x, healthBarY, 28, 4, hp, maxHP)

  // Draw buff indicator (small arrows around the aura)
  drawBuffIndicators(ctx, x, y)
}

const drawAuraRing = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
): void => {
  // Semi-transparent aura
  ctx.beginPath()
  ctx.arc(x, y, AURA_RADIUS, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(249, 115, 22, 0.1)'
  ctx.fill()

  // Dashed ring
  ctx.beginPath()
  ctx.arc(x, y, AURA_RADIUS, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgbaNumId
 
  ctx.lineWidth = 1
  ctx.setLineDash([4, 4])
  ctx.strokeStyle = 'rgba(249, 115, 22, 0.4)'
  ctx.stroke()
  ctx.setLineDash([])
}

const drawSpeedLines = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
): void => {
  const time = Date.now() / 100
  const lineCount = 5
  const lineLength = 15
  const lineSpacing = 6

  // Draw speed lines trailing behind (assuming movement to the right)
  for (let i = 0; i < lineCount; i++) {
    const offsetY = (i - (lineCount - 1) / 2) * lineSpacing
    const offsetX = -SPEED_AURA_SIZE - 5 - Math.sin(time + i) * 3
    const startX = x + offsetX
    const startY = y + offsetY
    const endX = startX - lineLength
    const endY = startY

    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.strokeStyle = 'rgba(253, 186, 116, 0.6)'
    ctx.lineWidth = 2
    ctx.stroke()
  }
}

const drawBuffIndicators = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
): void => {
  const indicatorCount = 6
  const indicatorRadius = AURA_RADIUS - 10

  for (let i = 0; i < indicatorCount; i++) {
    const angle = (i / indicatorCount) * Math.PI * 2
    const ix = x + Math.cos(angle) * indicatorRadius
    const iy = y + Math.sin(angle) * indicatorRadius

    // Draw small arrow pointing outward
    const arrowSize = 4
    const arrowAngle = angle

    ctx.beginPath()
    ctx.moveTo(
      ix + Math.cos(arrowAngle) * arrowSize,
      iy + Math.sin(arrowAngle) * arrowSize
    )
    ctx.lineTo(
      ix + Math.cos(arrowAngle + 2.5) * arrowSize,
      iy + Math.sin(arrowAngle + 2.5) * arrowSize
    )
    ctx.lineTo(
      ix + Math.cos(arrowAngle - 2.5) * arrowSize,
      iy + Math.sin(arrowAngle - 2.5) * arrowSize
    )
    ctx.closePath()
    ctx.fillStyle = 'rgba(251, 191, 36, 0.7)'
    ctx.fill()
  }
}

export const getSpeedAuraRadius = (): number => AURA_RADIUS
export const getSpeedAuraBoost = (): number => SPEED_BOOST
