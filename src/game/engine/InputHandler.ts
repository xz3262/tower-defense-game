import { Position, TowerType, GameMap } from '../../types'
import { TILE_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT } from '../config/GameConstants'
import { pixelToGrid } from '../../utils/math'

export type InputEventType =
  | 'tile_click'
  | 'tile_hover'
  | 'tile_leave'
  | 'tower_select'
  | 'tower_deselect'

export type TileClickEvent = {
  type: 'tile_click'
  gridX: number
  gridY: number
  worldX: number
  worldY: number
}

export type TileHoverEvent = {
  type: 'tile_hover'
  gridX: number
  gridY: number
  worldX: number
  worldY: number
}

export type TileLeaveEvent = {
  type: 'tile_leave'
}

export type TowerSelectEvent = {
  type: 'tower_select'
  towerType: TowerType
}

export type TowerDeselectEvent = {
  type: 'tower_deselect'
}

export type InputEvent =
  | TileClickEvent
  | TileHoverEvent
  | TileLeaveEvent
  | TowerSelectEvent
  | TowerDeselectEvent

type InputEventHandler = (event: InputEvent) => void

export class InputHandler {
  private canvas: HTMLCanvasElement
  private map: GameMap | null = null
  private eventHandlers: InputEventHandler[] = []
  private isMouseOver: boolean = false
  private lastHoveredTile: Position | null = null
  private selectedTowerType: TowerType | null = null

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.attachEventListeners()
  }

  public setMap(map: GameMap): void {
    this.map = map
  }

  public onInputEvent(handler: InputEventHandler): void {
    this.eventHandlers.push(handler)
  }

  public selectTower(type: TowerType | null): void {
    this.selectedTowerType = type
    if (type) {
      this.emit({ type: 'tower_select', towerType: type })
    } else {
      this.emit({ type: 'tower_deselect' })
    }
  }

  public getSelectedTower(): TowerType | null {
    return this.selectedTowerType
  }

  public isValidTile(gridX: number, gridY: number): boolean {
    if (!this.map) return false
    return (
      gridX >= 0 &&
      gridX < this.map.width &&
      gridY >= 0 &&
      gridY < this.map.height
    )
  }

  public isTileBuildable(gridX: number, gridY: number): boolean {
    if (!this.map) return false
    const tileType = this.map.tiles[gridY][gridX]
    return tileType === 'grass' || tileType === 'path'
  }

  public destroy(): void {
    this.removeEventListeners()
    this.eventHandlers = []
  }

  private attachEventListeners(): void {
    this.canvas.addEventListener('click', this.handleClick)
    this.canvas.addEventListener('mousemove', this.handleMouseMove)
    this.canvas.addEventListener('mouseleave', this.handleMouseLeave)
    this.canvas.addEventListener('touchstart', this.handleTouchStart, { passive: false })
    this.canvas.addEventListener('touchmove', this.handleTouchMove, { passive: false })
    this.canvas.addEventListener('touchend', this.handleTouchEnd)
  }

  private removeEventListeners(): void {
    this.canvas.removeEventListener('click', this.handleClick)
    this.canvas.removeEventListener('mousemove', this.handleMouseMove)
    this.canvas.removeEventListener('mouseleave', this.handleMouseLeave)
    this.canvas.removeEventListener('touchstart', this.handleTouchStart)
    this.canvas.removeEventListener('touchmove', this.handleTouchMove)
    this.canvas.removeEventListener('touchend', this.handleTouchEnd)
  }

  private getCanvasPosition = (clientX: number, clientY: number): Position => {
    const rect = this.canvas.getBoundingClientRect()
    const scaleX = this.canvas.width / rect.width
    const scaleY = this.canvas.height / rect.height
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    }
  }

  private handleClick = (event: MouseEvent): void => {
    const pos = this.getCanvasPosition(event.clientX, event.clientY)
    const gridPos = pixelToGrid(pos.x, pos.y)

    if (this.isValidTile(gridPos.x, gridPos.y)) {
      this.emit({
        type: 'tile_click',
        gridX: gridPos.x,
        gridY: gridPos.y,
        worldX: pos.x,
        worldY: pos.y
      })
    }
  }

  private handleMouseMove = (event: MouseEvent): void => {
    this.isMouseOver = true
    const pos = this.getCanvasPosition(event.clientX, event.clientY)
    const gridPos = pixelToGrid(pos.x, pos.y)

    if (this.isValidTile(gridPos.x, gridPos.y)) {
      const newHoveredTile = { x: gridPos.x, y: gridPos.y }

      if (
        !this.lastHoveredTile ||
        this.lastHoveredTile.x !== newHoveredTile.x ||
        this.lastHoveredTile.y !== newHoveredTile.y
      ) {
        this.lastHoveredTile = newHoveredTile
        this.emit({
          type: 'tile_hover',
          gridX: newHoveredTile.x,
          gridY: newHoveredTile.y,
          worldX: pos.x,
          worldY: pos.y
        })
      }
    }
  }

  private handleMouseLeave = (): void => {
    this.isMouseOver = false
    this.lastHoveredTile = null
    this.emit({ type: 'tile_leave' })
  }

  private handleTouchStart = (event: TouchEvent): void => {
    event.preventDefault()
    if (event.touches.length > 0) {
      const touch = event.touches[0]
      const pos = this.getCanvasPosition(touch.clientX, touch.clientY)
      const gridPos = pixelToGrid(pos.x, pos.y)

      if (this.isValidTile(gridPos.x, gridPos.y)) {
        this.emit({
          type: 'tile_click',
          gridX: gridPos.x,
          gridY: gridPos.y,
          worldX: pos.x,
          worldY: pos.y
        })
      }
    }
  }

  private handleTouchMove = (event: TouchEvent): void => {
    event.preventDefault()
    if (event.touches.length > 0) {
      const touch = event.touches[0]
      const pos = this.getCanvasPosition(touch.clientX, touch.clientY)
      const gridPos = pixelToGrid(pos.x, pos.y)

      if (this.isValidTile(gridPos.x, gridPos.y)) {
        const newHoveredTile = { x: gridPos.x, y: gridPos.y }

        if (
          !this.lastHoveredTile ||
          this.lastHoveredTile.x !== newHoveredTile.x ||
          this.lastHoveredTile.y !== newHoveredTile.y
        ) {
          this.lastHoveredTile = newHoveredTile
          this.emit({
            type: 'tile_hover',
            gridX: newHoveredTile.x,
            gridY: newHoveredTile.y,
            worldX: pos.x,
            worldY: pos.y
          })
        }
      }
    }
  }

  private handleTouchEnd = (): void => {
    // Touch end handling if needed
  }

  private emit(event: InputEvent): void {
    for (const handler of this.eventHandlers) {
      handler(event)
    }
  }
}

export const createInputHandler = (canvas: HTMLCanvasElement): InputHandler => {
  return new InputHandler(canvas)
}
