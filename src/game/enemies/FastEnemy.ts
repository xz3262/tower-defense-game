import { EnemyStats } from '../../types'
import { drawCircle, drawHealthBar } from '../../utils/canvas'

const FAST_COLOR = '#eab308'
const FAST_SIZE = 10
const TRAIL_LENGTH = 4
const TRAIL_ALPHA = 0.3

export const fastEnemyStats: EnemyStats = {
  type: 'fast',
  name: 'Scout',
  maxHP: 60,
  speed: 2.5,
  reward: 15,
  armor: 0,
  isFlying: false,
  isBoss: false,
  color: FAST_COLOR,
  size: FAST_SIZE,
  special: 'Moves quickly'
}

export const renderFastEnemy = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  hp: number,
  maxHP: number
): void => {
  // Draw motion blur trail (trailing behind in direction of movement)
  ctx.globalAlpha = TRAIL_ALPHA
  for (let i = 1; i <= TRAIL_LENGTH; i++) {
    const trailX = x - i * 8
    const trailSize = FAST_SIZE * (1 - i / (TRAIL_LENGTH + 1))
    ctx.beginPath()
    ctx.moveTo(trailX + trailSize, y)
    ctx.lineTo(trailX - trailSize * 0.6, y - trailSize)
    ctx.lineTo(trailX - trailSize * 0.6, y + trailSize)
    ctx.closePath()
    ctx.fillStyle = FAST_COLOR
    ctx.fill()
  }
  ctx.globalAlpha = 1

  // Draw main triangle body (pointing right = fast)
  ctx.beginPath()
  ctx.moveTo(x + FAST_SIZE, y)
  ctx.lineTo(x - FAST_SIZE * 0.7, y - FAST_SIZE)
  ctx.lineTo(x - FAST_SIZE * 0.7, y + FAST_SIZE)
  ctx.closePath()
  ctx.fillStyle = FAST_COLOR
  ctx.fill()
  ctx.strokeStyle = '#1f2937'
  ctx.lineWidth = 2
  ctx.stroke()

  // Draw health bar above
  const healthBarY = y - FAST_SIZE - 8
  drawHealthBar(ctx, x, healthBarY, 24, 4, hp, maxHP)
}
