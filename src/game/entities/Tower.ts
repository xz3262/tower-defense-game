import { Entity } from './Entity'
import { TowerInstance, TowerType, Position } from '../../types'
import { TILE_SIZE } from '../config/GameConstants'
import { getTowerStats, getTowerDamage, getTowerRange } from '../config/TowerConfig'
import { drawCircle, drawRing } from '../../utils/canvas'
import { drawText } from '../../utils/canvas'

const TOWER_RENDER_SIZE = 16
const LEVEL_INDICATOR_OFFSET = 8

export class Tower extends Entity {
  public readonly type: TowerType
  public level: number
  public readonly gridX: number
  public readonly gridY: number
  public range: number
  public damage: number
  public fireRate: number
  public lastFireTime: number
  public currentTarget: string | null
  public totalDamageDealt: number
  public totalKills: number

  constructor(
    id: string,
    type: TowerType,
    gridX: number,
    gridY: number
  ) {
    const pixelX = gridX * TILE_SIZE + TILE_SIZE / 2
    const pixelY = gridY * TILE_SIZE + TILE_SIZE / 2
    super(id, pixelX, pixelY)

    this.type = type
    this.level = 1
    this.gridX = gridX
    this.gridY = gridY
    this.currentTarget = null
    this.lastFireTime = 0
    this.totalDamageDealt = 0
    this.totalKills = 0

    const stats = getTowerStats(type)
    this.damage = stats.damage
    this.range = stats.range * TILE_SIZE
    this.fireRate = stats.fireRate
  }

  public update(dt: number): void {
    // Tower update logic handled by systems
  }

  public render(ctx: CanvasRenderingContext2D): void {
    const stats = getTowerStats(this.type)
    const centerX = this.gridX * TILE_SIZE + TILE_SIZE / 2
    const centerY = this.gridY * TILE_SIZE + TILE_SIZE / 2

    // Draw base
    drawCircle(ctx, centerX, centerY, TOWER_RENDER_SIZE, stats.color, '#1f2937', 2)

    // Draw level indicator
    if (this.level > 1) {
      const levelColor = this.level === 4 ? '#fbbf24' : '#f8fafc'
      drawCircle(ctx, centerX, centerY - LEVEL_INDICATOR_OFFSET, 4, levelColor)
    }

    // Draw tower type symbol
    this.drawTowerSymbol(ctx, centerX, centerY)
  }

  public renderRange(ctx: CanvasRenderingContext2D): void {
    const centerX = this.gridX * TILE_SIZE + TILE_SIZE / 2
    const centerY = this.gridY * TILE_SIZE + TILE_SIZE / 2

    drawRing(ctx, centerX, centerY, this.range - 2, this.range, 'rgba(167, 139, 250, 0.2)')
    ctx.beginPath()
    ctx.arc(centerX, centerY, this.range, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(167, 139, 250, 0.6)'
    ctx.lineWidth = 1
    ctx.stroke()
  }

  public upgrade(): boolean {
    if (this.level >= 4) return false

    this.level++
    const stats = getTowerStats(this.type)
    this.damage = stats.damage + (this.level - 1) * stats.damagePerLevel
    this.range = (stats.range + (this.level - 1) * stats.rangePerLevel) * TILE_SIZE
    this.fireRate = stats.fireRate

    return true
  }


  public getInstance(): TowerInstance {
    return {
      id: this.id,
      type: this.type,
      level: this.level,
      gridX: this.gridX,
      gridY: this.gridY,
      currentTarget: this.currentTarget,
      lastFireTime: this.lastFireTime,
      totalDamageDealt: this.totalDamageDealt,
      totalKills: this.totalKills
    }
  }

  private drawTowerSymbol(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    const symbolColor = '#f8fafc'
    switch (this.type) {
      case 'arrow':
        this.drawArrowSymbol(ctx, x, y, symbolColor)
        break
      case 'cannon':
        this.drawCannonSymbol(ctx, x, y, symbolColor)
        break
      case 'ice':
        this.drawIceSymbol(ctx, x, y, symbolColor)
        break
      case 'fire':
        this.drawFireSymbol(ctx, x, y, symbolColor)
        break
      case 'lightning':
        this.drawLightningSymbol(ctx, x, y, symbolColor)
        break
      case 'poison':
        this.drawPoisonSymbol(ctx, x, y, symbolColor)
        break
      case 'sniper':
        this.drawSniperSymbol(ctx, x, y, symbolColor)
        break
      case 'laser':
        this.drawLaserSymbol(ctx, x, y, symbolColor)
        break
      case 'bomb':
        this.drawBombSymbol(ctx, x, y, symbolColor)
        break
      case 'slow':
        this.drawSlowSymbol(ctx, x, y, symbolColor)
        break
      case 'goldmine':
        this.drawGoldmineSymbol(ctx, x, y, symbolColor)
        break
      case 'tesla':
        this.drawTeslaSymbol(ctx, x, y, symbolColor)
        break
    }
  }

  private drawArrowSymbol(ctx: CanvasRenderingContext2D, x: number, y: number, color: string): void {
    ctx.beginPath()
    ctx.moveTo(x - 4, y + 4)
    ctx.lineTo(x, y - 6)
    ctx.lineTo(x + 4, y + 4)
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.stroke()
  }

  private drawCannonSymbol(ctx: CanvasRenderingContext2D, x: number, y: number, color: string): void {
    ctx.beginPath()
    ctx.arc(x, y, 5, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
  }

  private drawIceSymbol(ctx: CanvasRenderingContext2D, x: number, y: number, color: string): void {
    ctx.beginPath()
    ctx.moveTo(x, y - 5)
    ctx.lineTo(x + 4, y)
    ctx.lineTo(x, y + 5)
    ctx.lineTo(x - 4, y)
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()
  }

  private drawFireSymbol(ctx: CanvasRenderingContext2D, x: number, y: number, color: string): void {
    ctx.beginPath()
    ctx.moveTo(x, y - 5)
    ctx.quadraticCurveTo(x + 4, y - 2, x, y + 5)
    ctx.quadraticCurveTo(x - 4, y - 2, x, y - 5)
    ctx.fillStyle = color
    ctx.fill()
  }

  private drawLightningSymbol(ctx: CanvasRenderingContext2D, x: number, y: number, color: string): void {
    ctx.beginPath()
    ctx.moveTo(x + 2, y - 5)
    ctx.lineTo(x - 2, y)
    ctx.lineTo(x, y)
    ctx.lineTo(x - 2, y + 5)
    ctx.lineTo(x + 2, y)
    ctx.lineTo(x, y)
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.stroke()
  }

  private drawPoisonSymbol(ctx: CanvasRenderingContext2D, x: number, y: number, color: string): void {
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
  }

  private drawSniperSymbol(ctx: CanvasRenderingContext2D, x: number, y: number, color: string): void {
    ctx.beginPath()
    ctx.moveTo(x, y - 5)
    ctx.lineTo(x, y + 5)
    ctx.moveTo(x - 3, y)
    ctx.lineTo(x + 3, y)
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.stroke()
  }

  private drawLaserSymbol(ctx: CanvasRenderingContext2D, x: number, y: number, color: string): void {
    ctx.beginPath()
    ctx.moveTo(x - 3, y - 3)
    ctx.lineTo(x + 3, y + 3)
    ctx.moveTo(x + 3, y - 3)
    ctx.lineTo(x - 3, y + 3)
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.stroke()
  }

  private drawBombSymbol(ctx: CanvasRenderingContext2D, x: number, y: number, color: string): void {
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
  }

  private drawSlowSymbol(ctx: CanvasRenderingContext2D, x: number, y: number, color: string): void {
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.stroke()
  }

  private drawGoldmineSymbol(ctx: CanvasRenderingContext2D, x: number, y: number, color: string): void {
    ctx.beginPath()
    ctx.moveTo(x, y - 4)
    ctx.lineTo(x + 4, y)
    ctx.lineTo(x, y + 4)
    ctx.lineTo(x - 4, y)
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()
  }

  private drawTeslaSymbol(ctx: CanvasRenderingContext2D, x: number, y: number, color: string): void {
    ctx.beginPath()
    ctx.arc(x, y, 3, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
  }
}
