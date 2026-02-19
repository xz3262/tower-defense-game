import { EnemyStats } from '../../types'
import { enemyConfig } from '../config/EnemyConfig'

export const basicEnemyStats: EnemyStats = enemyConfig.basic

export const renderBasicEnemy = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  hp: number,
  maxHP: number,
  size: number
): void => {
  // Walking animation - slight bobbing
  const bobOffset = Math.sin(Date.now() / 150) * 2
  const renderY = y + bobOffset

  // Draw red circle body
  ctx.beginPath()
  ctx.arc(x, renderY, size, 0, Math.PI * 2)
  ctx.fillStyle = '#ef4444'
  ctx.fill()
  ctx.strokeStyle = '#991b1b'
  ctx.lineWidth = 2
  ctx.stroke()

  // Draw health bar above
  const barWidth = size * 2
  const barHeight = 4
  const barX = x - barWidth / 2
  const barY = renderY - size - 10

  // Health bar background
  ctx.fillStyle = '#1f2937'
  ctx.fillRect(barX, barY, barWidth, barHeight)

  // Health bar fill
  const hpPercent = hp / maxHP
  const hpColor = hpPercent > 0.5 ? '#22c55e' : hpPercent > 0.25 ? '#eab308' : '#ef4444'
  ctx.fillStyle = hpColor
  ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight)

  // Health bar border
  ctx.strokeStyle = '#374151'
  ctx.lineWidth = 1
  ctx.strokeRect(barX, barY, barWidth, barHeight)
}
