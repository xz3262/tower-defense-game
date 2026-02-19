import { Entity } from './Entity'
import { ProjectileInstance, StatusEffect } from '../../types'
import { drawCircle, drawLine } from '../../utils/canvas'
import { angleBetween, distance } from '../../utils/math'
import { Position } from '../../types'

export class Projectile extends Entity {
  public readonly targetId: string
  public damage: number
  public speed: number
  public effect: StatusEffect | null
  public isAoE: boolean
  public aoERadius: number
  public readonly type: string

  private targetPosition: Position
  private hasHitTarget: boolean

  constructor(
    id: string,
    type: string,
    x: number,
    y: number,
    targetId: string,
    targetPosition: Position,
    damage: number,
    speed: number,
    effect: StatusEffect | null = null,
    isAoE: boolean = false,
    aoERadius: number = 0
  ) {
    super(id, x, y)

    this.type = type
    this.targetId = targetId
    this.targetPosition = targetPosition
    this.damage = damage
    this.speed = speed
    this.effect = effect
    this.isAoE = isAoE
    this.aoERadius = aoERadius
    this.hasHitTarget = false
  }


  public update(dt: number): void {
    if (!this.isAlive || this.hasHitTarget) return

    const dx = this.targetPosition.x - this.x
    const dy = this.targetPosition.y - this.y
    const dist = Math.sqrt(dx * dx + dy * dy)


    if (dist < 5) {
      this.hasHitTarget = true
      this.kill()
      return
    }

    const moveSpeed = this.speed * dt * 60
    if (moveSpeed >= dist) {
      this.x = this.targetPosition.x
      this.y = this.targetPosition.y
      this.hasHitTarget = true
      this.kill()
    } else {
      const angle = Math.atan2(dy, dx)
      this.x += Math.cos(angle) * moveSpeed
      this.y += Math.sin(angle) * moveSpeed
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.isAlive) return

    const color = this.getProjectileColor()
    const size = this.getProjectileSize()

    switch (this.type) {
      case 'arrow':
        this.renderArrow(ctx, color)
        break
      case 'cannonball':
        drawCircle(ctx, this.x, this.y, size, color)
        break
      case 'ice_shard':
        this.renderIceShard(ctx, color, size)
        break
      case 'fireball':
        this.renderFireball(ctx, color, size)
        break
      case 'lightning_bolt':
        this.renderLightning(ctx, color)
        break
      case 'poison_cloud':
        drawCircle(ctx, this.x, this.y, size, color, color, 1)
        break
      case 'bullet':
        drawCircle(ctx, this.x, this.y, size, color)
        break
      case 'laser_beam':
        this.renderLaser(ctx, color)
        break
      default:
        drawCircle(ctx, this.x, this.y, size, color)
    }
  }

  public getInstance(): ProjectileInstance {
    return {
      id: this.id,
      type: this.type,
      x: this.x,
      y: this.y,
      targetId: this.targetId,
      damage: this.damage,
      speed: this.speed,
      effect: this.effect,
      isAoE: this.isAoE,
      aoERadius: this.aoERadius
    }
  }

  public setTargetPosition(pos: Position): void {
    this.targetPosition = pos
  }

  private getProjectileColor(): string {
    const colorMap: Record<string, string> = {
      arrow: '#a78bfa',
      cannonball: '#1f2937',
      ice_shard: '#67e8f9',
      fireball: '#fb923c',
      lightning_bolt: '#fde047',
      poison_cloud: '#a3e635',
      bullet: '#fbbf24',
      laser_beam: '#f472b6'
    }
    return colorMap[this.type] || '#f8fafc'
  }

  private getProjectileSize(): number {
    const sizeMap: Record<string, number> = {
      arrow: 3,
      cannonball: 5,
      ice_shard: 4,
      fireball: 6,
      lightning_bolt: 2,
      poison_cloud: 4,
      bullet: 2,
      laser_beam: 3
    }
    return sizeMap[this.type] || 3
  }

  private renderArrow(ctx: CanvasRenderingContext2D, color: string): void {
    const angle = angleBetween({ x: this.x, y: this.y }, this.targetPosition)
    const length = 8

    ctx.beginPath()
    ctx.moveTo(this.x, this.y)
    ctx.lineTo(
      this.x - Math.cos(angle) * length,
      this.y - Math.sin(angle) * length
    )
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.stroke()

    // Arrow head
    const headAngle = Math.PI / 6
    ctx.beginPath()
    ctx.moveTo(this.x, this.y)
    ctx.lineTo(
      this.x - Math.cos(angle + headAngle) * 5,
      this.y - Math.sin(angle + headAngle) * 5
    )
    ctx.moveTo(this.x, this.y)
    ctx.lineTo(
      this.x - Math.cos(angle - headAngle) * 5,
      this.y - Math.sin(angle - headAngle) * 5
    )
    ctx.stroke()
  }

  private renderIceShard(ctx: CanvasRenderingContext2D, color: string, size: number): void {
    ctx.beginPath()
    ctx.moveTo(this.x, this.y - size)
    ctx.lineTo(this.x + size * 0.5, this.y)
    ctx.lineTo(this.x, this.y + size)
    ctx.lineTo(this.x - size * 0.5, this.y)
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()
  }

  private renderFireball(ctx: CanvasRenderingContext2D, color: string, size: number): void {
    // Outer glow
    ctx.beginPath()
    ctx.arc(this.x, this.y, size + 2, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(251, 146, 60, 0.3)'
    ctx.fill()


    // Core
    drawCircle(ctx, this.x, this.y, size, color)
  }

  private renderLightning(ctx: CanvasRenderingContext2D, color: string): void {
    ctx.beginPath()
    ctx.moveTo(this.x, this.y)
    ctx.lineTo(
      this.x + (Math.random() - 0.5) * 10,
      this.y + (Math.random() - 0.5) * 10
    )
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.stroke()
  }

  private renderLaser(ctx: CanvasRenderingContext2D, color: string): void {
    ctx.beginPath()
    ctx.moveTo(this.x, this.y)
    ctx.lineTo(this.targetPosition.x, this.targetPosition.y)
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.stroke()
  }
}
