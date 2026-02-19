import { EnemyStats } from '../../types'
import { enemyConfig } from '../config/EnemyConfig'

export const bossNecromancerStats: EnemyStats = enemyConfig.boss_necromancer

export const renderBossNecromancer = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  hp: number,
  maxHP: number
): void => {
  const size = bossNecromancerStats.size
  
  // Dark aura effect - pulsing glow
  const pulsePhase = (Date.now() / 500) % (Math.PI * 2)
  const auraRadius = size + 10 + Math.sin(pulsePhase) * 4
  const auraGradient = ctx.createRadialGradient(x, y, size, x, y, auraRadius)
  auraGradient.addColorStop(0, 'rgba(124, 58, 237, 0.4)')
  auraGradient.addColorStop(0.5, 'rgba(88, 28, 135, 0.2)')
  auraGradient.addColorStop(1, 'rgba(88, 28, 135, 0)')
  
  ctx.beginPath()
  ctx.arc(x, y, auraRadius, 0, Math.PI * 2)
  ctx.fillStyle = auraGradient
  ctx.fill()
  
  // Second outer aura ring
  const outerAuraRadius = size + 20 + Math.sin(pulsePhase * 0.7) * 6
  ctx.beginPath()
  ctx.arc(x, y, outerAuraRadius, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(124, 58, 237, 0.15)'
  ctx.lineWidth = 3
  ctx.stroke()
  
  // Main body - large purple circle
  ctx.beginPath()
  ctx.arc(x, y, size, 0, Math.PI * 2)
  ctx.fillStyle = '#7c3aed'
  ctx.fill()
  ctx.strokeStyle = '#4c1d95'
  ctx.lineWidth = 3
  ctx.stroke()
  
  // Inner darker ring
  ctx.beginPath()
  ctx.arc(x, y, size * 0.75, 0, Math.PI * 2)
  ctx.fillStyle = '#5b21b6'
  ctx.fill()
  
  // Robe/cloak effect at bottom
  ctx.beginPath()
  ctx.arc(x, y + size * 0.2, size * 0.85, Math.PI * 0.2, Math.PI * 0.8)
  ctx.fillStyle = '#4c1d95'
  ctx.fill()
  
  // Draw skull icon
  drawSkull(ctx, x, y, size * 0.5)
  
  // Skull eye sockets - glowing effect
  const eyeGlow = ctx.createRadialGradient(x - size * 0.15, y - size * 0.1, 0, x - size * 0.15, y - size * 0.1, size * 0.12)
  eyeGlow.addColorStop(0, '#ef4444')
  eyeGlow.addColorStop(0.5, '#dc2626')
  eyeGlow.addColorStop(1, 'rgba(220, 38, 38, 0)')
  ctx.beginPath()
  ctx.arc(x - size * 0.15, y - size * 0.1, size * 0.12, 0, Math.PI * 2)
  ctx.fillStyle = eyeGlow
  ctx.fill()
  
  const eyeGlow2 = ctx.createRadialGradient(x + size * 0.15, y - size * 0.1, 0, x + size * 0.15, y - size * 0.1, size * 0.12)
  eyeGlow2.addColorStop(0, '#ef4444')
  eyeGlow2.addColorStop(0.5, '#dc2626')
  eyeGlow2.addColorStop(1, 'rgba(220, 38, 38, 0)')
  ctx.beginPath()
  ctx.arc(x + size * 0.15, y - size * 0.1, size * 0.12, 0, Math.PI * 2)
  ctx.fillStyle = eyeGlow2
  ctx.fill()
  
  // Health bar above boss
  const barWidth = size * 2.5
  const barHeight = 6
  const barX = x - barWidth / 2
  const barY = y - size - 15
  
  // Health bar background
  ctx.fillStyle = '#1f2937'
  ctx.fillRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2)
  
  // Health bar fill
  const hpPercent = hp / maxHP
  const hpColor = hpPercent > 0.5 ? '#22c55e' : hpPercent > 0.25 ? '#eab308' : '#ef4444'
  ctx.fillStyle = hpColor
  ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight)
  
  // Health bar border
  ctx.strokeStyle = '#374151'
  ctx.lineWidth = 1
  ctx.strokeRect(barX, barY, barWidth, barHeight)
  
  // Boss crown/hood detail
  drawCrown(ctx, x, y - size * 0.7, size * 0.6)
}

const drawSkull = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number
): void => {
  // Skull shape - rounded top
  ctx.beginPath()
  ctx.arc(cx, cy - size * 0.1, size * 0.6, Math.PI, 0)
  ctx.lineTo(cx + size * 0.5, cy + size * 0.3)
  ctx.lineTo(cx + size * 0.3, cy + size * 0.5)
  ctx.lineTo(cx - size * 0.3, cy + size * 0.5)
  ctx.lineTo(cx - size * 0.5, cy + size * 0.3)
  ctx.closePath()
  ctx.fillStyle = '#e5e7eb'
  ctx.fill()
  ctx.strokeStyle = '#9ca3af'
  ctx.lineWidth = 1
  ctx.stroke()
  
  // Nose hole
  ctx.beginPath()
  ctx.moveTo(cx, cy + size * 0.15)
  ctx.lineTo(cx - size * 0.08, cy + size * 0.3)
  ctx.lineTo(cx + size * 0.08, cy + size * 0.3)
  ctx.closePath()
  ctx.fillStyle = '#4b5563'
  ctx.fill()
  
  // Teeth
  const teethWidth = size * 0.12
  const teethStartX = cx - size * 0.35
  const teethY = cy + size * 0.35
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = '#e5e7eb'
    ctx.fillRect(teethStartX + i * teethWidth * 1.1, teethY, teethWidth, size * 0.15)
    ctx.strokeStyle = '#9ca3af'
    ctx.strokeRect(teethStartX + i * teethWidth * 1.1, teethY, teethWidth, size * 0.15)
  }
}

const drawCrown = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number
): void => {
  // Necromancer hood/crown
  ctx.beginPath()
  ctx.moveTo(cx - size * 0.5, cy + size * 0.2)
  ctx.lineTo(cx - size * 0.4, cy - size * 0.3)
  ctx.lineTo(cx - size * 0.2, cy)
  ctx.lineTo(cx, cy - size * 0.4)
  ctx.lineTo(cx + size * 0.2, cy)
  ctx.lineTo(cx + size * 0.4, cy - size * 0.3)
  ctx.lineTo(cx + size * 0.5, cy + size * 0.2)
  ctx.closePath()
  ctx.fillStyle = '#4c1d95'
  ctx.fill()
  
  // Crown jewels
  const jewelSize = size * 0.15
  ctx.beginPath()
  ctx.arc(cx, cy - size * 0.2, jewelSize, 0, Math.PI * 2)
  ctx.fillStyle = '#a855f7'
  ctx.fill()
  ctx.strokeStyle = '#7c3aed'
  ctx.lineWidth = 1
  ctx.stroke()
  
  // Jewel glow
  const jewelGlow = ctx.createRadialGradient(cx, cy - size * 0.2, 0, cx, cy - size * 0.2, jewelSize * 2)
  jewelGlow.addColorStop(0, 'rgba(168, 85, 247, 0.4)')
  jewelGlow.addColorStop(1, 'rgba(168, 85, 247, 0)')
  ctx.beginPath()
  ctx.arc(cx, cy - size * 0.2, jewelSize * 2, 0, Math.PI * 2)
  ctx.fillStyle = jewelGlow
  ctx.fill()
}