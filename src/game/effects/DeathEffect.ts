import { enemyConfig } from '../config/EnemyConfig'
import { EnemyType } from '../../types'

interface DeathParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  alpha: number
}

const PARTICLE_COUNT = 12
const INITIAL_SPEED = 80
const GRAVITY = 100
const COIN_DURATION = 0.4 // seconds the coin is visible
const COIN_SIZE = 10

let particles: DeathParticle[] = []
let showCoin = false
let coinStartTime = 0

export const renderDeathEffect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number,
  enemyType?: EnemyType
): void => {
  // Get enemy color from config
  const color = enemyType ? enemyConfig[enemyType].color : '#94a3b8'
  
  // Initialize particles on first call (progress near 0)
  if (progress < 0.05) {
    initializeParticles(x, y, color)
    showCoin = true
    coinStartTime = Date.now()
  }
  
  // Update and render particles
  updateParticles(progress)
  renderParticles(ctx, progress)
  
  // Render gold coin briefly
  if (showCoin && progress < COIN_DURATION) {
    renderGoldCoin(ctx, x, y, progress)
  }
  
  // Hide coin after duration
  if (progress >= COIN_DURATION) {
    showCoin = false
  }
}

const initializeParticles = (x: number, y: number, color: string): void => {
  particles = []
  
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const angle = (i / PARTICLE_COUNT) * Math.PI * 2 + Math.random() * 0.3
    const speed = INITIAL_SPEED * (0.7 + Math.random() * 0.6)
    
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 30, // Initial upward boost
      size: 3 + Math.random() * 3,
      color,
      alpha: 1
    })
  }
}

const updateParticles = (progress: number): void => {
  const dt = 0.016 // Approximate delta time
  
  for (const particle of particles) {
    // Apply gravity
    particle.vy += GRAVITY * dt
    
    // Update position
    particle.x += particle.vx * dt
    particle.y += particle.vy * dt
    
    // Fade out
    particle.alpha = 1 - progress
    particle.size *= 0.98
  }
}

const renderParticles = (ctx: CanvasRenderingContext2D, progress: number): void => {
  for (const particle of particles) {
    if (particle.alpha <= 0) continue
    
    ctx.save()
    ctx.globalAlpha = particle.alpha
    
    // Draw particle as circle
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
    ctx.fillStyle = particle.color
    ctx.fill()
    
    // Add slight glow for larger particles
    if (particle.size > 3) {
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size + 2, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 255, ${particle.alpha * 0.3})`
      ctx.fill()
    }
    
    ctx.restore()
  }
}

const renderGoldCoin = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number
): void => {
  // Coin appears briefly then floats up and fades
  const coinProgress = progress / COIN_DURATION
  const coinY = y - 30 * coinProgress
  const coinAlpha = 1 - coinProgress
  const coinScale = 1 + coinProgress * 0.3
  
  ctx.save()
  ctx.globalAlpha = coinAlpha
  
  // Coin shadow/glow
  const glowGradient = ctx.createRadialGradient(x, coinY, 0, x, coinY, COIN_SIZE * 2)
  glowGradient.addColorStop(0, 'rgba(251, 191, 36, 0.4)')
  glowGradient.addColorStop(1, 'rgba(251, 191, 36, 0)')
  ctx.beginPath()
  ctx.arc(x, coinY, COIN_SIZE * 2, 0, Math.PI * 2)
  ctx.fillStyle = glowGradient
  ctx.fill()
  
  // Coin body
  ctx.beginPath()
  ctx.arc(x, coinY, COIN_SIZE * coinScale, 0, Math.PI * 2)
  ctx.fillStyle = '#fbbf24'
  ctx.fill()
  ctx.strokeStyle = '#b45309'
  ctx.lineWidth = 2
  ctx.stroke()
  
  // Inner circle
  ctx.beginPath()
  ctx.arc(x, coinY, COIN_SIZE * 0.6 * coinScale, 0, Math.PI * 2)
  ctx.fillStyle = '#fcd34d'
  ctx.fill()
  
  // Dollar sign
  ctx.fillStyle = '#b45309'
  ctx.font = `bold ${Math.round(10 * coinScale)}px system-ui`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('$', x, coinY + 1)
  
  ctx.restore()
}

// Reset function for when effect is no longer needed
export const resetDeathEffect = (): void => {
  particles = []
  showCoin = false
}
