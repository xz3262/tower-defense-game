import { TowerStats } from '../../types'
import { TILE_SIZE } from '../config/GameConstants'
import { drawCircle } from '../../utils/canvas'

export const teslaTowerStats: TowerStats = {
  type: 'tesla',
  name: 'Tesla Tower',
  cost: 300,
  damage: 35,
  range: 2.5,
  fireRate: 2,
  projectileSpeed: 0,
  upgradeCosts: [180, 360, 540],
  damagePerLevel: 20,
  rangePerLevel: 0.3,
  special: 'Area shock, damages all in range',
  color: '#00FFFF',
  canTargetFlying: true
}

export const renderTeslaTower = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  level: number
): void => {
  const centerX = x * TILE_SIZE + TILE_SIZE / 2
  const centerY = y * TILE_SIZE + TILE_SIZE / 2
  const radius = TILE_SIZE * 0.35

  // Base circle - dark purple
  drawCircle(ctx, centerX, centerY, radius, '#4c1d95', '#1f2937', 2)

  // Inner circle - electric blue
  drawCircle(ctx, centerX, centerY, radius * 0.7, '#06b6d4')

  // Core - bright cyan
  drawCircle(ctx, centerX, centerY, radius * 0.35, '#67e8f9')

  // Render electricity arcs based on level
  if (level >= 2) {
    renderElectricArcs(ctx, centerX, centerY, radius, level)
  }

  // Render spark effects
  renderSparks(ctx, centerX, centerY, radius, level)

  // Level indicator
  if (level > 1) {
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 12px system-ui'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(level), centerX, centerY)
  }
}

const renderElectricArcs = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  level: number
): void => {
  const arcCount = Math.min(level - 1, 3)
  const arcRadius = radius * 1.3

  for (let i = 0; i < arcCount; i++) {
    const startAngle = (Math.PI * 2 / arcCount) * i + performance.now() / 500
    const endAngle = startAngle + Math.PI * 0.4

    ctx.beginPath()
    ctx.arc(centerX, centerY, arcRadius, startAngle, endAngle)
    ctx.strokeStyle = i === 0 ? '#a855f7' : i === 1 ? '#06b6d4' : '#67e8f9'
    ctx.lineWidth = 2
    ctx.stroke()

    // Add jagged lightning effect
    renderLightningBolt(ctx, centerX, centerY, arcRadius, startAngle, endAngle)
  }
}

const renderLightningBolt = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number
): void => {
  const midAngle = (startAngle + endAngle) / 2
  const segments = 5

  ctx.beginPath()
  ctx.moveTo(
    centerX + Math.cos(startAngle) * radius,
    centerY + Math.sin(startAngle) * radius
  )

  for (let i = 1; i <= segments; i++) {
    const angle = startAngle + (endAngle - startAngle) * (i / segments)
    const r = radius + (Math.random() - 0.5) * 10
    ctx.lineTo(
      centerX + Math.cos(angle) * r,
      centerY + Math.sin(angle) * r
    )
  }

  ctx.strokeStyle = '#a78bfa'
  ctx.lineWidth = 1.5
  ctx.stroke()
}

const renderSparks = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  level: number
): void => {
  const sparkCount = 6 + level * 2
  const time = performance.now() / 200

  for (let i = 0; i < sparkCount; i++) {
    const angle = (Math.PI * 2 / sparkCount) * i + time
    const distance = radius * 0.8 + Math.sin(time + i) * 5
    const sparkX = centerX + Math.cos(angle) * distance
    const sparkY = centerY + Math.sin(angle) * distance
    const sparkSize = 2 + Math.sin(time * 2 + i) * 1

    ctx.beginPath()
    ctx.arc(sparkX, sparkY, sparkSize, 0, Math.PI * 2)
    ctx.fillStyle = i % 2 === 0 ? '#a855f7' : '#22d3ee'
    ctx.fill()
  }

  // Random lightning sparks
  for (let i = 0; i < 3; i++) {
    const sparkAngle = Math.random() * Math.PI * 2
    const sparkDist = radius * (0.5 + Math.random() * 0.5)
    const sx = centerX + Math.cos(sparkAngle) * sparkDist
    const sy = centerY + Math.sin(sparkAngle) * sparkDist

    ctx.beginPath()
    ctx.moveTo(sx, sy)
    ctx.lineTo(
      sx + (Math.random() - 0.5) * 20,
      sy + (Math.random() - 0.5) * 20
    )
    ctx.strokeStyle = '#c084fc'
    ctx.lineWidth = 1
    ctx.stroke()
  }
}
