import { GameMap, TowerInstance, EnemyInstance, ProjectileInstance, Position, TileType } from '../../types'
import { CANVAS_WIDTH, CANVAS_HEIGHT, TILE_SIZE } from '../config/GameConstants'
import { clearCanvas, drawRect, drawCircle } from '../../utils/canvas'
import {
  GRASS_COLOR,
  PATH_COLOR,
  WATER_COLOR,
  ROCK_COLOR,
  ENTRY_COLOR,
  EXIT_COLOR
} from '../../utils/colors'

type Effect = {
  id: string
  type: string
  x: number
  y: number
  progress: number
  duration: number
}

export class Renderer {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private map: GameMap | null = null
  private towers: TowerInstance[] = []
  private enemies: EnemyInstance[] = []
  private projectiles: ProjectileInstance[] = []
  private effects: Effect[] = []
  private hoveredTile: Position | null = null
  private selectedTile: Position | null = null
  private towerRange: number = 0
  private showRange: boolean = false

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('Failed to get 2D context')
    }
    this.ctx = context
  }

  public setMap(map: GameMap): void {
    this.map = map
  }

  public setEntities(
    towers: TowerInstance[],
    enemies: EnemyInstance[],
    projectiles: ProjectileInstance[],
    effects: Effect[]
  ): void {
    this.towers = towers
    this.enemies = enemies
    this.projectiles = projectiles
    this.effects = effects
  }

  public setHoveredTile(tile: Position | null): void {
    this.hoveredTile = tile
  }

  public setSelectedTile(tile: Position | null): void {
    this.selectedTile = tile
  }

  public setTowerRange(range: number, show: boolean): void {
    this.towerRange = range
    this.showRange = show
  }

  public render(): void {
    clearCanvas(this.ctx, CANVAS_WIDTH, CANVAS_HEIGHT)

    if (!this.map) {
      this.renderEmptyState()
      return
    }

    this.renderTiles()
    this.renderPath()
    this.renderTowers()
    this.renderEnemies()
    this.renderProjectiles()
    this.renderEffects()
    this.renderUIOverlays()
  }

  private renderEmptyState(): void {
    this.ctx.fillStyle = '#1f2937'
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    this.ctx.fillStyle = '#64748b'
    this.ctx.font = '24px system-ui'
    this.ctx.textAlign = 'center'
    this.ctx.fillText('No map loaded', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
  }

  private renderTiles(): void {
    if (!this.map) return

    for (let y = 0; y < this.map.height; y++) {
      for (let x = 0; x < this.map.width; x++) {
        const tileType = this.map.tiles[y][x]
        const color = this.getTileColor(tileType)
        drawRect(
          this.ctx,
          x * TILE_SIZE,
          y * TILE_SIZE,
          TILE_SIZE,
          TILE_SIZE,
          color
        )
      }
    }
  }

  private renderPath(): void {
    if (!this.map) return

    // Draw path line
    this.ctx.strokeStyle = PATH_COLOR
    this.ctx.lineWidth = TILE_SIZE * 0.6
    this.ctx.lineCap = 'round'
    this.ctx.lineJoin = 'round'

    this.ctx.beginPath()
    if (this.map.path.length > 0) {
      const start = this.map.path[0]
      this.ctx.moveTo(
        start.x * TILE_SIZE + TILE_SIZE / 2,
        start.y * TILE_SIZE + TILE_SIZE / 2
      )
      for (let i = 1; i < this.map.path.length; i++) {
        const point = this.map.path[i]
        this.ctx.lineTo(
          point.x * TILE_SIZE + TILE_SIZE / 2,
          point.y * TILE_SIZE + TILE_SIZE / 2
        )
      }
    }
    this.ctx.stroke()

    // Draw entry point
    const entry = this.map.entryPoint
    drawCircle(
      this.ctx,
      entry.x * TILE_SIZE + TILE_SIZE / 2,
      entry.y * TILE_SIZE + TILE_SIZE / 2,
      TILE_SIZE * 0.35,
      ENTRY_COLOR,
      '#166534',
      2
    )

    // Draw exit point
    const exit = this.map.exitPoint
    drawCircle(
      this.ctx,
      exit.x * TILE_SIZE + TILE_SIZE / 2,
      exit.y * TILE_SIZE + TILE_SIZE / 2,
      TILE_SIZE * 0.35,
      EXIT_COLOR,
      '#991b1b',
      2
    )
  }

  private renderTowers(): void {
    for (const tower of this.towers) {
      const x = tower.gridX * TILE_SIZE + TILE_SIZE / 2
      const y = tower.gridY * TILE_SIZE + TILE_SIZE / 2
      const radius = TILE_SIZE * 0.35

      // Base
      drawCircle(this.ctx, x, y, radius, '#374151', '#1f2937', 2)

      // Tower body based on level
      const levelColor = this.getTowerLevelColor(tower.level)
      drawCircle(this.ctx, x, y, radius * 0.7, levelColor)

      // Level indicator
      if (tower.level > 1) {
        this.ctx.fillStyle = '#ffffff'
        this.ctx.font = 'bold 12px system-ui'
        this.ctx.textAlign = 'center'
        this.ctx.textBaseline = 'middle'
        this.ctx.fillText(String(tower.level), x, y)
      }
    }
  }

  private renderEnemies(): void {
    for (const enemy of this.enemies) {
      if (!enemy.isAlive) continue

      const size = this.getEnemySize(enemy.type)

      // Body
      if (enemy.isVisible) {
        drawCircle(
          this.ctx,
          enemy.x,
          enemy.y,
          size,
          this.getEnemyColor(enemy.type)
        )
      }

      // Health bar
      const hpPercent = enemy.hp / enemy.maxHP
      const barWidth = size * 2
      const barHeight = 4
      const barX = enemy.x - barWidth / 2
      const barY = enemy.y - size - 8

      // Background
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
      this.ctx.fillRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2)

      // Health
      const hpColor = hpPercent > 0.5 ? '#22c55e' : hpPercent > 0.25 ? '#eab308' : '#ef4444'
      this.ctx.fillStyle = hpColor
      this.ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight)
    }
  }

  private renderProjectiles(): void {
    for (const projectile of this.projectiles) {
      drawCircle(
        this.ctx,
        projectile.x,
        projectile.y,
        4,
        '#fbbf24'
      )
    }
  }

  private renderEffects(): void {
    for (const effect of this.effects) {
      const progress = effect.progress / effect.duration
      const alpha = 1 - progress
      const size = 20 + progress * 30

      this.ctx.globalAlpha = alpha
      drawCircle(
        this.ctx,
        effect.x,
        effect.y,
        size,
        '#ef4444'
      )
      this.ctx.globalAlpha = 1
    }
  }

  private renderUIOverlays(): void {
    // Hover highlight
    if (this.hoveredTile) {
      const x = this.hoveredTile.x * TILE_SIZE
      const y = this.hoveredTile.y * TILE_SIZE
      this.ctx.strokeStyle = '#f472b6'
      this.ctx.lineWidth = 2
      this.ctx.strokeRect(x + 1, y + 1, TILE_SIZE - 2, TILE_SIZE - 2)

      // Show range if tower is selected
      if (this.showRange && this.towerRange > 0) {
        const centerX = x + TILE_SIZE / 2
        const centerY = y + TILE_SIZE / 2
        const rangePixels = this.towerRange * TILE_SIZE

        this.ctx.fillStyle = 'rgba(167, 139, 250, 0.15)'
        this.ctx.beginPath()
        this.ctx.arc(centerX, centerY, rangePixels, 0, Math.PI * 2)
        this.ctx.fill()

        this.ctx.strokeStyle = 'rgba(167, 139, 250, 0.5)'
        this.ctx.lineWidth = 1
        this.ctx.stroke()
      }
    }

    // Selection highlight
    if (this.selectedTile) {
      const x = this.selectedTile.x * TILE_SIZE
      const y = this.selectedTile.y * TILE_SIZE
      this.ctx.strokeStyle = '#4f46e5'
      this.ctx.lineWidth = 3
      this.ctx.strokeRect(x + 1, y + 1, TILE_SIZE - 2, TILE_SIZE - 2)
    }
  }

  private getTileColor(type: TileType): string {
    switch (type) {
      case 'grass': return GRASS_COLOR
      case 'path': return PATH_COLOR
      case 'water': return WATER_COLOR
      case 'rock': return ROCK_COLOR
      case 'entry': return ENTRY_COLOR
      case 'exit': return EXIT_COLOR
      default: return GRASS_COLOR
    }
  }

  private getTowerLevelColor(level: number): string {
    switch (level) {
      case 1: return '#8b5cf6'
      case 2: return '#06b6d4'
      case 3: return '#f59e0b'
      case 4: return '#ef4444'
      default: return '#8b5cf6'
    }
  }

  private getEnemyColor(type: string): string {
    const colors: Record<string, string> = {
      basic: '#22c55e',
      fast: '#eab308',
      tank: '#78716c',
      flying: '#a855f7',
      stealth: '#64748b',
      healer: '#10b981',
      splitter: '#14b8a6',
      shield: '#3b82f6',
      speedaura: '#f97316',
      boss_golem: '#78716c',
      boss_dragon: '#dc2626',
      boss_necromancer: '#7c3aed'
    }
    return colors[type] || '#22c55e'
  }

  private getEnemySize(type: string): number {
    const sizes: Record<string, number> = {
      basic: 12,
      fast: 10,
      tank: 18,
      flying: 10,
      stealth: 10,
      healer: 12,
      splitter: 14,
      shield: 14,
      speedaura: 12,
      boss_golem: 30,
      boss_dragon: 28,
      boss_necromancer: 24
    }
    return sizes[type] || 12
  }
}

export const createRenderer = (canvas: HTMLCanvasElement): Renderer => {
  return new Renderer(canvas)
}
