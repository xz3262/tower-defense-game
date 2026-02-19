import { Position } from '../../types'

interface ParticleConfig {
  count: number
  speed: number
  lifetime: number
  color: string
  size: number
  gravity: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  age: number
  maxAge: number
  color: string
  size: number
  gravity: number
}

const defaultConfig: ParticleConfig = {
  count: 10,
  speed: 100,
  lifetime: 1,
  color: '#ffffff',
  size: 3,
  gravity: 200
}

export class ParticleSystem {
  private particles: Particle[] = []

  emit(x: number, y: number, config: Partial<ParticleConfig> = {}): void {
    const cfg = { ...defaultConfig, ...config }
    const angleStep = (Math.PI * 2) / cfg.count

    for (let i = 0; i < cfg.count; i++) {
      const angle = angleStep * i + Math.random() * 0.5
      const speedVariation = cfg.speed * (0.5 + Math.random() * 0.5)

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speedVariation,
        vy: Math.sin(angle) * speedVariation,
        alpha: 1,
        age: 0,
        maxAge: cfg.lifetime * (0.5 + Math.random() * 0.5),
        color: cfg.color,
        size: cfg.size * (0.5 + Math.random() * 0.5),
        gravity: cfg.gravity
      })
    }
  }

  emitExplosion(x: number, y: number, color: string): void {
    this.emit(x, y, {
      count: 20,
      speed: 150,
      lifetime: 0.8,
      color,
      size: 5,
      gravity: 100
    })
  }

  emitHit(x: number, y: number, color: string): void {
    this.emit(x, y, {
      count: 8,
      speed: 80,
      lifetime: 0.4,
      color,
      size: 3,
      gravity: 50
    })
  }

  emitTrail(x: number, y: number, color: string): void {
    this.emit(x, y, {
      count: 3,
      speed: 30,
      lifetime: 0.3,
      color,
      size: 2,
      gravity: 0
    })
  }

  update(dt: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]

      p.age += dt
      p.vy += p.gravity * dt
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.alpha = 1 - (p.age / p.maxAge)

      if (p.age >= p.maxAge || p.alpha <= 0) {
        this.particles.splice(i, 1)
      }
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    for (const p of this.particles) {
      if (p.alpha <= 0) continue

      ctx.save()
      ctx.globalAlpha = p.alpha
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
  }

  clear(): void {
    this.particles = []
  }

  getParticleCount(): number {
    return this.particles.length
  }
}
