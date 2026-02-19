import { EnemyStats } from '../../types'
import { drawCircle, drawHealthBar, drawRing } from '../../utils/canvas'

const SHIELD_COLOR = '#3b82f6'
const SHIELD_SIZE = 14
const SHIELD_MAX = 100 // Shield absorbs 100 damage before HP takes damage

export const shieldEnemyStats: EnemyStats = {
  type: 'shield',
  name: 'Guardian',
  maxHP: 150,
  speed: 0.6,
  reward: 25,
  armor: 10,
  isFlying: false,
  isBoss: false,
  color: SHIELD_COLOR,
  size: SHIELD_SIZE,
  special: 'Has damage shield that absorbs damage before HP'
}

// Shield state for tracking shield HP
export interface ShieldEnemyState {
  shieldHP: number
  maxShieldHP: number
}

export const createShieldEnemyState = (): ShieldEnemyState => ({
  shieldHP: SHIELD_MAX,
  maxShieldHP: SHIELD_MAX
})

// Calculate shield ratio for rendering (0-1)
export const getShieldRatio = (shieldHP: number, maxShieldHP: number): number => {
  return Math.max(0, shieldHP / maxShieldHP)
}

// Apply damage to shield first, then HP
export const applyShieldDamage = (
  currentShieldHP: number,
  damage: number
): { remainingShield: number; damageToHP: number } => {
  if (currentShieldHP <= 0) {
    return { remainingShield: 0, damageToHP: damage }
  }

  if (damage <= currentShieldHP) {
    return { remainingShield: currentShieldHP - damage, damageToHP: 0 }
  }

  // Shield breaks, remaining damage goes to HP
  const remainingDamage = damage - currentShieldHP
  return { remainingShield: 0, damageToHP: remainingDamage }
}

export const renderShieldEnemy = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  hp: number,
  maxHP: number,
  shieldHP: number = SHIELD_MAX,
  maxShieldHP: number = SHIELD_MAX
): void => {
  const size = shieldEnemyStats.size
  const shieldRatio = getShieldRatio(shieldHP, maxShieldHP)

  // Draw shield ring (outer ring that fades as shield depletes)
  if (shieldRatio > 0) {
    const shieldRadius = size + 6
    const shieldAlpha = 0.3 + shieldRatio * 0.4
    const shieldWidth = 3 + shieldRatio * 2

    // Shield glow effect
    const glowGradient = ctx.createRadialGradient(x, y, size, x, y, shieldRadius + 8)
    glowGradient.addColorStop(0, `rgba(59, 130, 246, ${shieldAlpha * 0.5})`)
    glowGradient.addColorStop(1, 'rgba(59, 130, 246, 0)')
    ctx.beginPath()
    ctx.arc(x, y, shieldRadius + 8, 0, Math.PI * 2)
    ctx.fillStyle = glowGradient
    ctx.fill()

    // Shield ring
    ctx.beginPath()
    ctx.arc(x, y, shieldRadius, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(59, 130, 246, ${shieldAlpha})`
    ctx.lineWidth = shieldWidth
    ctx.stroke()

    // Inner shield ring for higher shield values
    if (shieldRatio > 0.5) {
      ctx.beginPath()
      ctx.arc(x, y, shieldRadius - 4, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(147, 197, 253, ${(shieldRatio - 0.5) * 0.6})`
      ctx.lineWidth = 2
      ctx.stroke()
    }
  }

  // Draw broken shield effect (when shield is depleted)
  if (shieldHP <= 0 && shieldRatio <= 0) {
    // Draw broken shield fragments
    const fragmentCount = 6
    for (let i = 0; i < fragmentCount; i++) {
      const angle = (i / fragmentCount) * Math.PI * 2 + Math.PI / 6
      const fragmentDist = size + 4
      const fx = x + Math.cos(angle) * fragmentDist
      const fy = y + Math.sin(angle) * fragmentDist

      ctx.beginPath()
      ctx.arc(fx, fy, 2, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(59, 130, 246, 0.4)'
      ctx.fill()
    }
  }

  // Draw main body - blue circle
  drawCircle(ctx, x, y, size, SHIELD_COLOR, '#1e3a8a', 2)

  // Draw inner circle (lighter blue)
  drawCircle(ctx, x, y, size * 0.6, '#60a5fa')

  // Draw shield icon in center
  const iconSize = size * 0.35
  ctx.beginPath()
  ctx.arc(x, y, iconSize, 0, Math.PI * 2)
  ctx.fillStyle = '#1e40af'
  ctx.fill()

  // Draw shield symbol (vertical line with horizontal cross)
  ctx.strokeStyle = '#93c5fd'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(x, y - iconSize * 0.7)
  ctx.lineTo(x, y + iconSize * 0.7)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x - iconSize * 0.5, y)
  ctx.lineTo(x + iconSize * 0.5, y)
  ctx.stroke()

  // Draw health bar above enemy
  const healthBarY = y - size - 12
  const healthBarWidth = size * 2.5
  const healthBarHeight = 5

  // Health bar background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
  ctx.fillRect(x - healthBarWidth / 2 - 1, healthBarY - 1, healthBarWidth + 2, healthBarHeight + 2)

  // HP portion
  const hpPercent = hp / maxHP
  const hpColor = hpPercent > 0.5 ? '#22c55e' : hpPercent > 0.25 ? '#eab308' : '#ef4444'
  ctx.fillStyle = hpColor
  ctx.fillRect(x - healthBarWidth / 2, healthBarY, healthBarWidth * hpPercent, healthBarHeight)

  // Health bar border
  ctx.strokeStyle = '#374151'
  ctx.lineWidth = 1
  ctx.strokeRect(x - healthBarWidth / 2, healthBarY, healthBarWidth, healthBarHeight)

  // Draw shield indicator bar (below health bar)
  if (shieldHP > 0) {
    const shieldBarY = healthBarY + healthBarHeight + 3
    const shieldBarWidth = size * 2
    const shieldBarHeight = 3

    // Shield bar background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.fillRect(x - shieldBarWidth / 2 - 1, shieldBarY - 1, shieldBarWidth + 2, shieldBarHeight + 2)

    // Shield bar fill
    ctx.fillStyle = '#3b82f6'
    ctx.fillRect(x - shieldBarWidth / 2, shieldBarY, shieldBarWidth * shieldRatio, shieldBarHeight)

    // Shield bar border
    ctx.strokeStyle = '#1e40af'
    ctx.lineWidth = 1
    ctx.strokeRect(x - shieldBarWidth / 2, shieldBarY, shieldBarWidth, shieldBarHeight)
  }
}
