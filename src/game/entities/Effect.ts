import { Entity } from './Entity'
import { Position } from '../../types'
import { easeOutQuad } from '../../utils/math'

export type EffectType = 
  | 'explosion'
  | 'hit'
  | 'slow'
  | 'burn'
  | 'poison'
  | 'death'
  | 'spawn'
  | 'levelup'

export interface VisualEffectData {
  type: EffectType
  x: number
  y: number
  duration: number
  color?: string
  magnitude?: number
}

export class Effect extends Entity {
  public readonly effectType: EffectType
  public duration: number
  public progress: number
  public color: string
  public magnitude: number

  constructor(
    id: string,
    effectType: EffectType,
    x: number,
    y: number,
    duration: number = 1,
    color: string = '#f8fafc',
    magnitude: number = 1
  ) {
    super(id, x, y)
    this.effectType = effectType
    this.duration = duration
    this.progress = 0
    this.color = color
    this.magnitude = magnitude
  }

  public update(dt: number): void {
    if (!this.isAlive) return

    this.progress += dt / this.duration

    if (this.progress >= 1) {
      this.progress = 1
      this.kill()
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.isAlive) return

    const easedProgress = easeOutQuad(this.progress)

    switch (this.effectType) {
      case 'explosion':
        this.renderExplosion(ctx, easedProgress)
        break
      case 'hit':
        this.renderHit(ctx, easedProgress)
        break
      case 'slow':
        this.renderSlow(ctx, easedProgress)
        break
      case 'burn':
        this.renderBurn(ctx, easedProgress)
        break
      case 'poison':
        this.renderPoison(ctx, easedProgress)
        break
      case 'death':
        this.renderDeath(ctx, easedProgress)
        break
      case 'spawn':
        this.renderSpawn(ctx, easedProgress)
        break
      case 'levelup':
        this.renderLevelUp(ctx, easedProgress)
        break
    }
  }

  private renderExplosion(ctx: CanvasRenderingContext2D, progress: number): void {
    const maxRadius = 30 * this.magnitude
    const radius = maxRadius * progress
    const alpha = 1 - progress

    ctx.beginPath()
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(251, 146, 60, ${alpha * 0.6})`
    ctx.fill()

    ctx.beginPath()
    ctx.arc(this.x, this.y, radius * 0.7, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(251, 191, 36, ${alpha * 0.8})`
    ctx.fill()
  }

  private renderHit(ctx: CanvasRenderingContext2D, progress: number): void {
    const offsetY = -20 * progress
    const alpha = 1 - progress

    ctx.font = 'bold 14px system-ui'
    ctx.fillStyle = `rgba(239, 68, 68, ${alpha})`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`-${Math.round(this.magnitude)}`, this.x, this.y + offsetY)
  }

  private renderSlow(ctx: CanvasRenderingContext2D, progress: number): void {
    const alpha = 1 - progress
    const particles = 8

    for (let i = 0; i < particles; i++) {
      const angle = (i / particles) * Math.PI * 2
      const dist = 15 * progress
      const px = this.x + Math.cos(angle) * dist
      const py = this.y + Math.sin(angle) * dist

      ctx.beginPath()
      ctx.arc(px, py, 2, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(103, 232, 249, ${alpha})`
      ctx.fill()
    }
  }

  private renderBurn(ctx: CanvasRenderingContext2D, progress: number): void {
    const alpha = 1 - progress
    const particles = 6

    for (let i = 0; i < particles; i++) {
      const offsetX = (Math.random() - 0.5) * 20
      const offsetY = -30 * progress + (Math.random() - 0.5) * 10

      ctx.beginPath()
      ctx.arc(this.x + offsetX, this.y + offsetY, 3 * (1 - progress), 0, Math.PI * 2)
      ctx.fillStyle = `rgba(249, 115, 22, ${alpha * 0.7})`
      ctx.fill()
    }
  }

  private renderPoison(ctx: CanvasRenderingContext2D, progress: number): void {
    const alpha = 1 - progress
    const radius = 20 * this.magnitude * progress

    ctx.beginPath()
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(132, 204, 22, ${alpha * 0.4})`
    ctx.fill()
  }

  private renderDeath(ctx: CanvasRenderingContext2D, progress: number): void {
    const alpha = 1 - progress
    const particles = 12

    for (let i = 0; i < particles; i++) {
      const angle = (i / particles) * Math.PI * 2
      const dist = 25 * progress
      const px = this.x + Math.cos(angle) * dist
      const py = this.y + Math.sin(angle) * dist
      const size = 4 * (1 - progress)

      ctx.beginPath()
      ctx.arc(px, py, size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(148, 163, 184, ${alpha})`
      ctx.fill()
    }
  }

  private renderSpawn(ctx: CanvasRenderingContext2D, progress: number): void {
    const alpha = progress
    const radius = 25 * (1 - progress)


    ctx.beginPath()
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(34, 197, 94, ${alpha})`
    ctx.lineWidth = 2
    ctx.stroke()
  }

  private renderLevelUp(ctx: CanvasRenderingContext2D, progress: number): void {
    const alpha = 1 - progress
    const particles = 16

    for (let i = 0; i < particles; i++) {
      const angle = (i / particles) * Math.PI * 2 + progress * 2
      const dist = 30 * progress
      const px = this.x + Math.cos(angle) * dist
      const py = this.y + Math.sin(angle) * dist

      ctx.beginPath()
      ctx.arc(px, py, 3, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(251, 191, 36, ${alpha})`
      ctx.fill()
    }
  }
}
