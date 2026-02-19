import { Position } from '../../types'
import { CANVAS_WIDTH, CANVAS_HEIGHT, TILE_SIZE } from '../config/GameConstants'

export class Camera {
  private offsetX: number = 0
  private offsetY: number = 0
  private scale: number = 1
  private mapWidth: number = CANVAS_WIDTH
  private mapHeight: number = CANVAS_HEIGHT

  constructor() {
    // Identity camera - no scroll for 800x600
  }

  public setMapDimensions(width: number, height: number): void {
    this.mapWidth = width * TILE_SIZE
    this.mapHeight = height * TILE_SIZE
  }

  public getOffset(): Position {
    return { x: this.offsetX, y: this.offsetY }
  }

  public setOffset(x: number, y: number): void {
    this.offsetX = x
    this.offsetY = y
  }

  public getScale(): number {
    return this.scale
  }

  public setScale(scale: number): void {
    this.scale = Math.max(0.5, Math.min(2, scale))
  }

  public worldToScreen(worldPos: Position): Position {
    return {
      x: (worldPos.x - this.offsetX) * this.scale,
      y: (worldPos.y - this.offsetY) * this.scale
    }
  }

  public screenToWorld(screenPos: Position): Position {
    return {
      x: screenPos.x / this.scale + this.offsetX,
      y: screenPos.y / this.scale + this.offsetY
    }
  }

  public screenToGrid(screenPos: Position): Position {
    const worldPos = this.screenToWorld(screenPos)
    return {
      x: Math.floor(worldPos.x / TILE_SIZE),
      y: Math.floor(worldPos.y / TILE_SIZE)
    }
  }

  public isInView(screenPos: Position, width: number = 0, height: number = 0): boolean {
    return (
      screenPos.x + width >= 0 &&
      screenPos.x < CANVAS_WIDTH &&
      screenPos.y + height >= 0 &&
      screenPos.y < CANVAS_HEIGHT
    )
  }

  public centerOnTile(gridX: number, gridY: number): void {
    const worldX = gridX * TILE_SIZE + TILE_SIZE / 2
    const worldY = gridY * TILE_SIZE + TILE_SIZE / 2
    this.offsetX = worldX - CANVAS_WIDTH / (2 * this.scale)
    this.offsetY = worldY - CANVAS_HEIGHT / (2 * this.scale)
    this.clampOffset()
  }

  public reset(): void {
    this.offsetX = 0
    this.offsetY = 0
    this.scale = 1
  }

  private clampOffset(): void {
    const maxX = Math.max(0, this.mapWidth - CANVAS_WIDTH / this.scale)
    const maxY = Math.max(0, this.mapHeight - CANVAS_HEIGHT / this.scale)
    this.offsetX = Math.max(0, Math.min(this.offsetX, maxX))
    this.offsetY = Math.max(0, Math.min(this.offsetY, maxY))
  }

  public pan(deltaX: number, deltaY: number): void {
    this.offsetX += deltaX / this.scale
    this.offsetY += deltaY / this.scale
    this.clampOffset()
  }

  public zoom(factor: number, centerX: number, centerY: number): void {
    const oldScale = this.scale
    this.scale = Math.max(0.5, Math.min(2, this.scale * factor))

    // Adjust offset to zoom toward center point
    const scaleChange = this.scale / oldScale
    this.offsetX = centerX / this.scale - (centerX / oldScale - this.offsetX) * scaleChange
    this.offsetY = centerY / this.scale - (centerY / oldScale - this.offsetY) * scaleChange
  }
}

export const createCamera = (): Camera => {
  return new Camera()
}
