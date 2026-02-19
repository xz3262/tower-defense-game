import { EnemyStats } from '../../types'
import { drawRect, drawHealthBar } from '../../utils/canvas'

export const tankEnemyStats: EnemyStats = {
  type: 'tank',
  name: 'Golem',
  maxHP: 500,
  speed: 0.5,
  reward: 30,
  armor: 5,
  isFlying: false,
  isBoss: false,
  color: '#14532d',
  size: 18,
  special: 'High HP, slow, armored'
}

export const renderTankEnemy = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  hp: number,
  maxHP: number
): void => {
  const size = tankEnemyStats.size
  const halfSize = size
  
  // Draw dark green square (heavy = square)
  const squareSize = halfSize * 2
  drawRect(
    ctx,
    x - halfSize,
    y - halfSize,
    squareSize,
    squareSize,
    tankEnemyStats.color,
    '#0f2917',
    4 // Thick border showing armor
  )
  
  // Draw armor indicator - inner lighter square
  const innerPadding = 6
  drawRect(
    ctx,
    x - halfSize + innerPadding,
    y - halfSize + innerPadding,
    squareSize - innerPadding * 2,
    squareSize - innerPadding * 2,
    '#166534'
  )
  
  // Draw health bar above enemy
  const healthBarWidth = size * 2.5
  const healthBarHeight = 5
  const healthBarY = y - halfSize - 10
  
  drawHealthBar(
    ctx,
    x,
    healthBarY,
    healthBarWidth,
    healthBarHeight,
    hp,
    maxHP
  )
}
