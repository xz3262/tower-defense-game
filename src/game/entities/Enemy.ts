import { Entity } from './Entity'
import { EnemyInstance, EnemyType, StatusEffect, Position } from '../../types'
import { enemyConfig } from '../config/EnemyConfig'
import { drawCircle, drawHealthBar, drawRect } from '../../utils/canvas'
import { distance } from '../../utils/math'

export class Enemy extends Entity {
  public readonly type: EnemyType
  public hp: number
  public readonly maxHP: number
  public speed: number
  public pathIndex: number
  public progress: number
  public effects: StatusEffect[]
  public isVisible: boolean

  private readonly baseSpeed: number
  private readonly config: typeof enemyConfig.basic

  constructor(
    id: string,
    type: EnemyType,
    startPosition: Position,
    path: Position[]
  ) {
    super(id, startPosition.x, startPosition.y)


    this.type = type
    this.config = enemyConfig[type]
    this.maxHP = this.config.maxHP
    this.hp = this.maxHP
    this.baseSpeed = this.config.speed
    this.speed = this.baseSpeed
    this.pathIndex = 0
    this.progress = 0
    this.effects = []
    this.isVisible = !this.config.isFlying
  }

  public update(dt: number): void {
    if (!this.isAlive) return

    this.updateEffects(dt)
    this.updateStatusEffects(dt)
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.isAlive || !this.isVisible) return

    const config = enemyConfig[this.type]
    const size = config.size

    // Draw enemy body
    if (config.isFlying) {
      this.renderFlyingShape(ctx, this.x, this.y, size, config.color)
    } else if (config.isBoss) {
      this.renderBossShape(ctx, this.x, this.y, size, config.color)
    } else {
      drawCircle(ctx, this.x, this.y, size, config.color, '#1f2937', 2)
    }

    // Draw health bar
    const healthBarY = this.y - size - 8
    drawHealthBar(ctx, this.x, healthBarY, 24, 4, this.hp, this.maxHP)

    // Draw effect indicators
    this.renderEffectIndicators(ctx)
  }

  public takeDamage(amount: number): void {
    this.hp = Math.max(0, this.hp - amount)
    if (this.hp <= 0) {
      this.kill()
    }
  }

  public heal(amount: number): void {
    this.hp = Math.min(this.maxHP, this.hp + amount)
  }

  public addEffect(effect: StatusEffect): void {
    const existingIndex = this.effects.findIndex(
      e => e.type === effect.type && e.sourceId === effect.sourceId
    )

    if (existingIndex >= 0) {
      this.effects[existingIndex].duration = effect.duration
      this.effects[existingIndex].magnitude = effect.magnitude
    } else {
      this.effects.push(effect)
    }
  }

  public removeEffect(type: StatusEffect['type']): void {
    this.effects = this.effects.filter(e => e.type !== type)
  }

  public getInstance(): EnemyInstance {
    return {
      id: this.id,
      type: this.type,
      hp: this.hp,
      maxHP: this.maxHP,
      x: this.x,
      y: this.y,
      speed: this.speed,
      pathIndex: this.pathIndex,
      progress: this.progress,
      effects: [...this.effects],
      isAlive: this.isAlive,
      isVisible: this.isVisible
    }
  }

  private updateEffects(dt: number): void {
    // Process burn damage
    const burnEffect = this.effects.find(e => e.type === 'burn')
    if (burnEffect) {
      const damagePerSecond = burnEffect.magnitude
      this.takeDamage(damagePerSecond * dt)
    }

    // Process poison damage
    const poisonEffect = this.effects.find(e => e.type === 'poison')
    if (poisonEffect) {
      const damagePerSecond = poisonEffect.magnitude
      this.takeDamage(damagePerSecond * dt)
    }
  }

  private updateStatusEffects(dt: number): void {
    // Update effect durations
    for (const effect of this.effects) {
      effect.duration -= dt
    }

    // Remove expired effects
    this.effects = this.effects.filter(e => e.duration > 0)

    // Recalculate speed based on slow effects
    let speedMultiplier = 1
    for (const effect of this.effects) {
      if (effect.type === 'slow') {
        speedMultiplier *= (1 - effect.magnitude)
      }
    }
    this.speed = this.baseSpeed * speedMultiplier
  }

  private renderFlyingShape(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string): void {
    ctx.beginPath()
    ctx.moveTo(x, y - size)
    ctx.lineTo(x + size, y)
    ctx.lineTo(x, y + size)
    ctx.lineTo(x - size, y)
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()
    ctx.strokeStyle = '#1f2937'
    ctx.lineWidth = 2
    ctx.stroke()
  }

  private renderBossShape(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string): void {
    // Draw larger circle with glow
    ctx.beginPath()
    ctx.arc(x, y, size + 4, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.fill()

    drawCircle(ctx, x, y, size, color, '#1f2937', 3)
  }

  private renderEffectIndicators(ctx: CanvasRenderingContext2D): void {
    const indicatorY = this.y + this.config.size + 6

    for (let i = 0; i < this.effects.length; i++) {
      const effect = this.effects[i]
      const indicatorX = this.x - 8 + i * 6

      let color: string
      switch (effect.type) {
        case 'slow':
          color = '#67e8f9'
          break
        case 'burn':
          color = '#f97316'
          break
        case 'poison':
          color = '#84cc16'
          break
        case 'stun':
          color = '#f59e0b'
          break
        default:
          color = '#f8fafc'
      }

      ctx.beginPath()
      ctx.arc(indicatorX, indicatorY, 3, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
    }
  }
}
