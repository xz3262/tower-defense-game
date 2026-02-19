import { EnemyStats } from '../../types'
import { enemyConfig } from '../config/EnemyConfig'
import { drawCircle, drawHealthBar } from '../../utils/canvas'

// Boss Dragon stats from config
export const bossDragonStats: EnemyStats = enemyConfig.boss_dragon

// Animation state for wing flapping
let wingPhase = 0

// Fire trail particles
interface FireParticle {
  x: number
  y: number
  alpha: number
  size: number
}

const fireTrail: FireParticle[] = []
const MAX_FIRE_PARTICLES = 8

export const renderBossDragon = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  hp: number,
  maxHP: number
): void => {
  const size = bossDragonStats.size // 28
  
  // Update wing animation
  wingPhase += 0.15
  const wingAngle = Math.sin(wingPhase) * 0.4
  
  // Update fire trail
  updateFireTrail(x, y)
  
  // Render fire trail first (behind dragon)
  renderFireTrail(ctx)
  
  // Draw shadow beneath dragon
  ctx.beginPath()
  ctx.ellipse(x, y + size + 5, size * 0.8, size * 0.3, 0, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
  ctx.fill()
  
  // Draw wings (behind body)
  drawWings(ctx, x, y, size, wingAngle)
  
  // Draw diamond body (large red diamond for flying boss)
  drawDiamondBody(ctx, x, y, size)
  
  // Draw dragon head
  drawDragonHead(ctx, x, y, size)
  
  // Draw eyes
  drawEyes(ctx, x, y, size)
  
  // Draw horns
  drawHorns(ctx, x, y, size)
  
  // Draw health bar above
  const healthBarWidth = size * 2.5
  const healthBarHeight = 6
  const healthBarY = y - size - 15
  drawHealthBar(ctx, x, healthBarY, healthBarWidth, healthBarHeight, hp, maxHP)
  
  // Draw boss indicator
  ctx.fillStyle = '#fbbf24'
  ctx.font = 'bold 10px system-ui'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('★ BOSS ★', x, y - size - 25)
}

const drawDiamondBody = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
): void => {
  // Main diamond shape
  ctx.beginPath()
  ctx.moveTo(x, y - size)        // Top
  ctx.lineTo(x + size, y)        // Right
  ctx.lineTo(x, y + size)         // Bottom
  ctx.lineTo(x - size, y)         // Left
  ctx.closePath()
  
  // Gradient fill for depth
  const gradient = ctx.createLinearGradient(x - size, y - size, x + size, y + size)
  gradient.addColorStop(0, '#ef4444')
  gradient.addColorStop(0.5, '#dc2626')
  gradient.addColorStop(1, '#991b1b')
  
  ctx.fillStyle = gradient
  ctx.fill()
  
  // Darker border
  ctx.strokeStyle = '#7f1d1d'
  ctx.lineWidth = 3
  ctx.stroke()
  
  // Inner highlight
  ctx.beginPath()
  ctx.moveTo(x, y - size * 0.6)
  ctx.lineTo(x + size * 0.6, y)
  ctx.lineTo(x, y + size * 0.6)
  ctx.lineTo(x - size * 0.6, y)
  ctx.closePath()
  ctx.fillStyle = '#fca5a5'
  ctx.fill()
}

const drawWings = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  wingAngle: number
): void => {
  const wingLength = size * 1.8
  const wingWidth = size * 0.8
  
  // Left wing
  ctx.save()
  ctx.translate(x - size * 0.5, y)
  ctx.rotate(-wingAngle - 0.3)
  drawWingShape(ctx, -wingLength, 0, wingLength, wingWidth)
  ctx.restore()
  
  // Right wing
  ctx.save()
  ctx.translate(x + size * 0.5, y)
  ctx.rotate(wingAngle + 0.3)
  drawWingShape(ctx, -wingLength, 0, wingLength, wingWidth)
  ctx.restore()
}

const drawWingShape = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  length: number,
  width: number
): void => {
  // Wing membrane
  ctx.beginPath()
  ctx.moveTo(startX, startY)
  ctx.quadraticCurveTo(startX + length * 0.3, startY - width, startX + length, startY)
  ctx.quadraticCurveTo(startX + length * 0.3, startY + width * 0.5, startX, startY)
  
  const wingGradient = ctx.createLinearGradient(startX, startY - width, startX, startY + width)
  wingGradient.addColorStop(0, '#dc2626')
  wingGradient.addColorStop(0.5, '#b91c1c')
  wingGradient.addColorStop(1, '#7f1d1d')
  
  ctx.fillStyle = wingGradient
  ctx.fill()
  ctx.strokeStyle = '#991b1b'
  ctx.lineWidth = 2
  ctx.stroke()
  
  // Wing bone details
  ctx.beginPath()
  ctx.moveTo(startX, startY)
  ctx.lineTo(startX + length * 0.7, startY - width * 0.3)
  ctx.moveTo(startX + length * 0.3, startY - width * 0.3)
  ctx.lineTo(startX + length * 0.8, startY)
  ctx.strokeStyle = '#450a0a'
  ctx.lineWidth = 2
  ctx.stroke()
}

const drawDragonHead = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
): void => {
  const headSize = size * 0.5
  const headY = y - size * 0.7
  
  // Snout
  ctx.beginPath()
  ctx.ellipse(x, headY + headSize * 0.3, headSize * 0.4, headSize * 0.3, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#dc2626'
  ctx.fill()
  ctx.strokeStyle = '#991b1b'
  ctx.lineWidth = 2
  ctx.stroke()
  
  // Nostrils with smoke
  ctx.beginPath()
  ctx.arc(x - headSize * 0.15, headY + headSize * 0.4, 3, 0, Math.PI * 2)
  ctx.arc(x + headSize * 0.15, headY + headSize * 0.4, 3, 0, Math.PI * 2)
  ctx.fillStyle = '#450a0a'
  ctx.fill()
  
  // Smoke puffs from nostrils
  ctx.beginPath()
  ctx.arc(x - headSize * 0.2, headY + headSize * 0.5, 4, 0, Math.PI * 2)
  ctx.arc(x + headSize * 0.2, headY + headSize * 0.5, 4, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(100, 116, 139, 0.5)'
  ctx.fill()
}

const drawEyes = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
): void => {
  const eyeY = y - size * 0.5
  const eyeOffset = size * 0.35
  
  // Eye glow
  const glowGradient = ctx.createRadialGradient(x - eyeOffset, eyeY, 0, x - eyeOffset, eyeY, 8)
  glowGradient.addColorStop(0, 'rgba(251, 191, 36, 0.8)')
  glowGradient.addColorStop(1, 'rgba(251, 191, 36, 0)')
  ctx.fillStyle = glowGradient
  ctx.beginPath()
  ctx.arc(x - eyeOffset, eyeY, 8, 0, Math.PI * 2)
  ctx.fill()
  
  // Left eye
  ctx.beginPath()
  ctx.arc(x - eyeOffset, eyeY, 5, 0, Math.PI * 2)
  ctx.fillStyle = '#fbbf24'
  ctx.fill()
  ctx.strokeStyle = '#b45309'
  ctx.lineWidth = 1
  ctx.stroke()
  
  // Pupil
  ctx.beginPath()
  ctx.arc(x - eyeOffset, eyeY, 2, 0, Math.PI * 2)
  ctx.fillStyle = '#1f2937'
  ctx.fill()
  
  // Right eye glow
  const glowGradient2 = ctx.createRadialGradient(x + eyeOffset, eyeY, 0, x + eyeOffset, eyeY, 8)
  glowGradient2.addColorStop(0, 'rgba(251, 191, 36, 0.8)')
  glowGradient2.addColorStop(1, 'rgba(251, 191, 36, 0)')
  ctx.fillStyle = glowGradient2
  ctx.beginPath()
  ctx.arc(x + eyeOffset, eyeY, 8, 0, Math.PI * 2)
  ctx.fill()
  
  // Right eye
  ctx.beginPath()
  ctx.arc(x + eyeOffset, eyeY, 5, 0, Math.PI * 2)
  ctx.fillStyle = '#fbbf24'
  ctx.fill()
  ctx.strokeStyle = '#b45309'
  ctx.lineWidth = 1
  ctx.stroke()
  
  // Right pupil
  ctx.beginPath()
  ctx.arc(x + eyeOffset, eyeY, 2, 0, Math.PI * 2)
  ctx.fillStyle = '#1f2937'
  ctx.fill()
}

const drawHorns = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
): void => {
  const hornBaseY = y - size * 0.8
  const hornLength = size * 0.6
  
  // Left horn
  ctx.beginPath()
  ctx.moveTo(x - size * 0.3, hornBaseY)
  ctx.lineTo(x - size * 0.5, hornBaseY - hornLength)
  ctx.lineTo(x - size * 0.35, hornBaseY - hornLength * 0.3)
  ctx.closePath()
  ctx.fillStyle = '#450a0a'
  ctx.fill()
  
  // Right horn
  ctx.beginPath()
  ctx.moveTo(x + size * 0.3, hornBaseY)
  ctx.lineTo(x + size * 0.5, hornBaseY - hornLength)
  ctx.lineTo(x + size * 0.35, hornBaseY - hornLength * 0.3)
  ctx.closePath()
  ctx.fillStyle = '#450a0a'
  ctx.fill()
}

const updateFireTrail = (x: number, y: number): void => {
  // Add new fire particle
  if (fireTrail.length < MAX_FIRE_PARTICLES) {
    fireTrail.push({
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 10,
      alpha: 1,
      size: 5 + Math.random() * 5
    })
  }
  
  // Update existing particles
  for (let i = fireTrail.length - 1; i >= 0; i--) {
    const particle = fireTrail[i]
    particle.y += 2 // Fall down
    particle.x += (Math.random() - 0.5) * 2
    particle.alpha -= 0.08
    particle.size *= 0.95
    
    if (particle.alpha <= 0) {
      fireTrail.splice(i, 1)
    }
  }
}

const renderFireTrail = (ctx: CanvasRenderingContext2D): void => {
  for (const particle of fireTrail) {
    // Outer glow
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size * 1.5, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(251, 146, 60, ${particle.alpha * 0.3})`
    ctx.fill()
    
    // Inner fire
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(249, 115, 22, ${particle.alpha})`
    ctx.fill()
    
    // Core
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size * 0.4, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(251, 191, 36, ${particle.alpha})`
    ctx.fill()
  }
}
