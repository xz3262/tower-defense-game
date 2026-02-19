import { TILE_SIZE } from '../config/GameConstants'

const FLAME_COLORS = [
  '#fb923c', // Orange
  '#f97316', // Dark orange
  '#ea580c', // Red-orange
  '#ef4444', // Red
  '#fbbf24'  // Yellow-orange
]

const PARTICLE_COUNT = 6
const PARTICLE_SIZE = 4
const PARTICLE_SPREAD = 12
const RISE_SPEED = 15
const FADE_SPEED = 2

interface FlameParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  alpha: number
  flickerOffset: number
}

const particles: FlameParticle[] = []

const createFlameParticle = (x: number, y: number): FlameParticle => {
  const colorIndex = Math.floor(Math.random() * FLAME_COLORS.length)
  return {
    x: x + (Math.random() - 0.5) * PARTICLE_SPREAD,
    y: y - Math.random() * 5,
    vx: (Math.random() - 0.5) * 20,
    vy: -RISE_SPEED - Math.random() * 10,
    size: PARTICLE_SIZE * (0.5 + Math.random() * 0.5),
    color: FLAME_COLORS[colorIndex],
    alpha: 0.8 + Math.random() * 0.2,
    flickerOffset: Math.random() * Math.PI * 2
  }
}

export const renderBurnEffect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number
): void => {
  const centerX = x
  const centerY = y - TILE_SIZE * 0.3

  // Spawn new particles
  while (particles.length < PARTICLE_COUNT) {
    particles.push(createFlameParticle(centerX, centerY))
  }

  // Update and render particles
  const time = Date.now() / 100

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]

    // Update position
    p.x += p.vx * 0.016
    p.y += p.vy * 0.016

    // Add flickering motion
    p.x += Math.sin(time + p.flickerOffset) * 0.5

    // Fade out
    p.alpha -= FADE_SPEED * 0.016
    p.size *= 0.98

    // Remove dead particles
    if (p.alpha <= 0 || p.size < 0.5) {
      particles.splice(i, 1)
      continue
    }

    // Draw particle glow
    const glowGradient = ctx.createRadialGradient(
      p.x, p.y, 0,
      p.x, p.y, p.size * 2
    )
    glowGradient.addColorStop(0, `rgba(251, 146, 60, ${p.alpha * 0.5})`)
    glowGradient.addColorStop(1, 'rgba(251, 146, 60, 0)')

    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2)
    ctx.fillStyle = glowGradient
    ctx.fill()

    // Draw particle core
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fillStyle = p.color
    ctx.globalAlpha = p.alpha
    ctx.fill()
    ctx.globalAlpha = 1

    // Draw bright center
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2)
    ctx.fillStyle = '#fef3c7'
    ctx.globalAlpha = p.alpha * 0.8
    ctx.fill()
    ctx.globalAlpha = 1
  }

  // Draw burn indicator base (small flames at the bottom)
  const baseFlameCount = 3
  for (let i = 0; i < baseFlameCount; i++) {
    const angle = (i / baseFlameCount) * Math.PI * 2 + time * 0.5
    const flameX = centerX + Math.cos(angle) * 8
    const flameY = centerY + 10
    const flameHeight = 6 + Math.sin(time * 2 + i) * 2

    ctx.beginPath()
    ctx.moveTo(flameX, flameY)
    ctx.quadraticCurveTo(flameX - 3, flameY - flameHeight / 2, flameX, flameY - flameHeight)
    ctx.quadraticCurveTo(flameX + 3, flameY - flameHeight / 2, flameX, flameY)
    ctx.fillStyle = FLAME_COLORS[i % FLAME_COLORS.length]
    ctx.globalAlpha = 0.6
    ctx.fill()
    ctx.globalAlpha = 1
  }

  // Draw "BURN" text indicator for higher intensity
  if (progress < 0.5) {
    ctx.font = 'bold 8px system-ui'
    ctx.fillStyle = `rgba(251, 146, 60, ${1 - progress * 2})`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('BURN', centerX, centerY - TILE_SIZE * 0.5)
  }
}

export const clearBurnParticles = (): void => {
  particles.length = 0
}
