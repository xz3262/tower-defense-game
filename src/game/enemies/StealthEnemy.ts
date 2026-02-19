import { EnemyStats } from '../../types'
import { drawCircle, drawHealthBar } from '../../utils/canvas'

const STEALTH_COLOR = '#64748b'
const STEALTH_SIZE = 10
const STEALTH_ALPHA = 0.35
const SHIMMER_SPEED = 0.008
const SHIMMER_AMPLITUDE = 0.15

export const stealthEnemyStats: EnemyStats = {
  type: 'stealth',
  name: 'Shadow',
  maxHP: 70,
  speed: 1,
  reward: 25,
  armor: 0,
  isFlying: false,
  isBoss: false,
  color: STEALTH_COLOR,
  size: STEALTH_SIZE,
  special: 'Invisible until close to a tower'
}

export const renderStealthEnemy = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  hp: number,
  maxHP: number,
  isVisible: boolean = false
): void => {
  const size = stealthEnemyStats.size
  
  // Walking animation - slight bobbing
  const bobOffset = Math.sin(Date.now() / 150) * 2
  const renderY = y + bobOffset
  
  // Calculate shimmer effect
  const shimmerPhase = Date.now() * SHIMMER_SPEED
  const shimmerAlpha = isVisible 
    ? 1 
    : Math.max(STEALTH_ALPHA, Math.min(1, STEALTH_ALPHA + Math.sin(shimmerPhase) * SHIMMER_AMPLITUDE + 0.1))
  
  // Draw stealth aura/glow when hidden
  if (!isVisible) {
    const auraGradient = ctx.createRadialGradient(x, renderY, 0, x, renderY, size * 2)
    auraGradient.addColorStop(0, `rgba(167, 139, 250, ${shimmerAlpha * 0.3})`)
    auraGradient.addColorStop(0.5, `rgba(139, 92, 246, ${shimmerAlpha * 0.15})`)
    auraGradient.addColorStop(1, 'rgba(139, 92, 246, 0)')
    
    ctx.beginPath()
    ctx.arc(x, renderY, size * 2, 0, Math.PI * 2)
    ctx.fillStyle = auraGradient
    ctx.fill()
  }
  
  // Draw main body with alpha
  ctx.globalAlpha = shimmerAlpha
  
  // Main body - purple circle
  ctx.beginPath()
  ctx.arc(x, renderY, size, 0, Math.PI * 2)
  ctx.fillStyle = isVisible ? '#8b5cf6' : STEALTH_COLOR
  ctx.fill()
  
  // Inner circle - lighter purple
  ctx.beginPath()
  ctx.arc(x, renderY, size * 0.6, 0, Math.PI * 2)
  ctx.fillStyle = isVisible ? '#a78bfa' : '#94a3b8'
  ctx.fill()
  
  ctx.globalAlpha = 1
  
  // Shimmer effect - only visible when stealthed
  if (!isVisible) {
    const shimmerX = x + Math.sin(shimmerPhase * 2) * size * 0.5
    const shimmerY = renderY + Math.cos(shimmerPhase * 1.5) * size * 0.5
    
    ctx.beginPath()
    ctx.arc(shimmerX, shimmerY, 2, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(shimmerPhase * 3) * 0.2})`
    ctx.fill()
    
    // Additional sparkle
    const sparkleX = x + Math.cos(shimmerPhase * 1.8) * size * 0.7
    const sparkleY = renderY + Math.sin(shimmerPhase * 2.2) * size * 0.7
    
    ctx.beginPath()
    ctx.arc(sparkleX, sparkleY, 1.5, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(196, 181, 253, ${0.4 + Math.sin(shimmerPhase * 2.5) * 0.3})`
    ctx.fill()
  }
  
  // Draw outline (only when visible)
  if (isVisible) {
    ctx.beginPath()
    ctx.arc(x, renderY, size, 0, Math.PI * 2)
    ctx.strokeStyle = '#6d28d9'
    ctx.lineWidth = 2
    ctx.stroke()
  }
  
  // Draw health bar above
  const healthBarY = renderY - size - 10
  drawHealthBar(ctx, x, healthBarY, 24, 4, hp, maxHP)
}