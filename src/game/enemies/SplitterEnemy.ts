import { EnemyStats } from '../../types'
import { drawCircle, drawHealthBar } from '../../utils/canvas'

export const splitterEnemyStats: EnemyStats = {
  type: 'splitter',
  name: 'Slime',
  maxHP: 120,
  speed: 0.7,
  reward: 40,
  armor: 0,
  isFlying: false,
  isBoss: false,
  color: '#eab308',
  size: 14,
  special: 'Splits into 2 on death'
}

export const renderSplitterEnemy = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  hp: number,
  maxHP: number
): void => {
  const size = splitterEnemyStats.size

  // Draw yellow circle body
  drawCircle(ctx, x, y, size, '#eab308', '#a16207', 2)

  // Draw inner highlight for 3D effect
  drawCircle(ctx, x - 2, y - 2, size * 0.5, '#fde047')

  // Draw split line down the middle
  ctx.beginPath()
  ctx.moveTo(x, y - size + 2)
  ctx.lineTo(x, y + size - 2)
  ctx.strokeStyle = '#a16207'
  ctx.lineWidth = 2
  ctx.stroke()

  // Draw horizontal split line (creates the X or + pattern for splitting)
  ctx.beginPath()
  ctx.moveTo(x - size + 2, y)
  ctx.lineTo(x + size - 2, y)
  ctx.strokeStyle = '#a16207'
  ctx.lineWidth = 2
  ctx.stroke()

  // Draw health bar above enemy
  const healthBarY = y - size - 8
  drawHealthBar(ctx, x, healthBarY, size * 2, 4, hp, maxHP)
}
