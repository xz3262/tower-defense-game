import { Position } from '../../types'

export abstract class Entity {
  public readonly id: string
  public x: number
  public y: number
  public isAlive: boolean

  constructor(id: string, x: number, y: number) {
    this.id = id
    this.x = x
    this.y = y
    this.isAlive = true
  }

  public abstract update(dt: number): void

  public abstract render(ctx: CanvasRenderingContext2D): void

  public getPosition(): Position {
    return { x: this.x, y: this.y }
  }

  public setPosition(x: number, y: number): void {
    this.x = x
    this.y = y
  }

  public kill(): void {
    this.isAlive = false
  }

  public distanceTo(other: Entity): number {
    const dx = other.x - this.x
    const dy = other.y - this.y
    return Math.sqrt(dx * dx + dy * dy)
  }
}

export const createEntityId = (prefix: string): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}
