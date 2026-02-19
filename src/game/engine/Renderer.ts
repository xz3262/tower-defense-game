import { GameMap, TowerInstance, EnemyInstance, ProjectileInstance, Position, TileType } from '../../types'
import { CANVAS_WIDTH, CANVAS_HEIGHT, TILE_SIZE } from '../config/GameConstants'
import { clearCanvas, drawRect, drawCircle, drawRing } from '../../utils/canvas'
import {
  GRASS_COLOR,
  PATH_COLOR,
  WATER_COLOR,
  ROCK_COLOR,
  ENTRY_COLOR,
  EXIT_COLOR,
  RANGE_INDICATOR,
  RANGE_BORDER,
  SELECTION_COLOR,
  HOVER_COLOR
} from '../../utils/colors'
import { getTowerRenderer } from '../towers/TowerRegistry'
import { getEnemyRenderer } from '../enemies/EnemyRegistry'
import { getProjectileRenderer } from '../projectiles/ProjectileRegistry'
import { getEffectRenderer } from '../effects/EffectRegistry'
import { getTowerRange } from '../config/TowerConfig'
import { enemyConfig } from '../config/EnemyConfig'

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
  private selectedTower: TowerInstance | null = null
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

  public setSelectedTower(tower: TowerInstance | null): void {
    this.selectedTower = tower
    this.showRange = tower !== null
  }

  public render(): void {
    clearCanvas(this.ctx, CANVAS_WIDTH, CANVAS_HEIGHT)

    if (!this.map) {
      this.renderEmptyState()
      return
    }

    this.renderTiles()
    this.renderGridLines()
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

  private renderGridLines(): void {
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
    this.ctx.lineWidth = 1

    // Vertical lines
    for (let x = 0; x <= CANVAS_WIDTH; x += TILE_SIZE) {
      this.ctx.beginPath()
      this.ctx.moveTo(x, 0)
      this.ctx.lineTo(x, CANVAS_HEIGHT)
      this.ctx.stroke()
    }

    // Horizontal lines
    for (let y = 0; y <= CANVAS_HEIGHT; y += TILE_SIZE) {
      this.ctx.beginPath()
      this.ctx.moveTo(0, y)
      this.ctx.lineTo(CANVAS_WIDTH, y)
      this.ctx.stroke()
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
      this.ctx.moveTo(start.x, start.y)
      for (let i = 1; i < this.map.path.length; i++) {
        const point = this.map.path[i]
        this.ctx.lineTo(point.x, point.y)
      }
    }
    this.ctx.stroke()

    // Draw entry point
    const entry = this.map.entryPoint
    const entryX = entry.x * TILE_SIZE + TILE_SIZE / 2
    const entryY = entry.y * TILE_SIZE + TILE_SIZE / 2
    drawCircle(this.ctx, entryX, entryY, TILE_SIZE * 0.35, ENTRY_COLOR, '#166534', 2)

    // Draw exit point
    const exit = this.map.exitPoint
    const exitX = exit.x * TILE_SIZE + TILE_SIZE / 2
    const exitY = exit.y * TILE_SIZE + TILE_SIZE / 2
    drawCircle(this.ctx, exitX, exitY, TILE_SIZE * 0.35, EXIT_COLOR, '#991b1b', 2)
  }

  private renderTowers(): void {
    for (const tower of this.towers) {
      const x = tower.gridX * TILE_SIZE + TILE_SIZE / 2
      const y = tower.gridY * TILE_SIZE + TILE_SIZE / 2

      // Get tower renderer from registry
      const towerRenderer = getTowerRenderer(tower.type)
      if (towerRenderer) {
        towerRenderer(this.ctx, tower.gridX, tower.gridY, tower.level)
      } else {
        // Fallback to simple rendering
        this.renderTowerFallback(x, y, tower.level)
      }

      // Show range for selected tower
      if (this.selectedTower && this.selectedTower.id === tower.id) {
        this.renderTowerRange(x, y, tower)
      }
    }
  }

  private renderTowerFallback(x: number, y: number, level: number): void {
    const radius = TILE_SIZE * 0.35
    const levelColors = ['#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444']
    const color = levelColors[level - 1] || levelColors[0]

    drawCircle(this.ctx, x, y, radius, color, '#1f2937', 2)

    if (level > 1) {
      this.ctx.fillStyle = '#ffffff'
      this.ctx.font = 'bold 12px system-ui'
      this.ctx.textAlign = 'center'
      this.ctx.textBaseline = 'middle'
      this.ctx.fillText(String(level), x, y)
    }
  }

  private renderTowerRange(centerX: number, centerY: number, tower: TowerInstance): void {
    const range = getTowerRange(tower.type, tower.level)
    const rangePixels = range * TILE_SIZE

    // Fill range area
    this.ctx.fillStyle = RANGE_INDICATOR
    this.ctx.beginPath()
    this.ctx.arc(centerX, centerY, rangePixels, 0, Math.PI * 2)
    this.ctx.fill()

    // Range border
    this.ctx.strokeStyle = RANGE_BORDER
    this.ctx.lineWidth = 2
    this.ctx.stroke()
  }

  private renderEnemies(): void {
    for (const enemy of this.enemies) {
      if (!enemy.isAlive || !enemy.isVisible) continue

      // Get enemy renderer from registry
      const enemyRenderer = getEnemyRenderer(enemy.type)
      if (enemyRenderer) {
        enemyRenderer(this.ctx, enemy.x, enemy.y, enemy.hp, enemy.maxHP)
      } else {
        // Fallback to simple rendering
        this.renderEnemyFallback(enemy)
      }
    }
  }

  private renderEnemyFallback(enemy: EnemyInstance): void {
    const config = enemyConfig[enemy.type]
    const size = config.size

    // Body
    drawCircle(this.ctx, enemy.x, enemy.y, size, config.color, '#1f2937', 2)

    // Health bar
    const hpPercent = enemy.hp / enemy.maxHP
    const barWidth = size * 2.5
    const barHeight = 4
    const barX = enemy.x - barWidth / 2
    const barY = enemy.y - size - 10

    this.ctx.fillStyle = '#1f2937'
    this.ctx.fillRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2)

    const hpColor = hpPercent > 0.5 ? '#22c55e' : hpPercent > 0.25 ? '#eab308' : '#ef4444'
    this.ctx.fillStyle = hpColor
    this.ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight)

    this.ctx.strokeStyle = '#374151'
    this.ctx.lineWidth = 1
    this.ctx.strokeRect(barX, barY, barWidth, barHeight)
  }

  private renderProjectiles(): void {
    for (const projectile of this.projectiles) {
      // Get projectile renderer from registry
      const projectileRenderer = getProjectileRenderer(projectile.type)
      if (projectileRenderer) {
        // Calculate angle to target
        const target = this.enemies.find(e => e.id === projectile.targetId)
        if (target) {
          const angle = Math.atan2(target.y - projectile.y, target.x - projectile.x)
          projectileRenderer(this.ctx, projectile.x, projectile.y, angle)
        } else {
          projectileRenderer(this.ctx, projectile.x, projectile.y, 0)
        }
      } else {
        // Fallback to simple rendering
        drawCircle(this.ctx, projectile.x, projectile.y, 4, '#fbbf24')
      }
    }
  }

  private renderEffects(): void {
    for (const effect of this.effects) {
      const progress = effect.progress / effect.duration

      // Get effect renderer from registry
      const effectRenderer = getEffectRenderer(effect.type as 'burn' | 'death' | 'explosion' | 'hit' | 'levelup' | 'poison' | 'slow' | 'spawn')
      if (effectRenderer) {
        effectRenderer(this.ctx, effect.x, effect.y, progress)
      } else {
        // Fallback to simple rendering
        const alpha = 1 - progress
        const size = 20 + progress * 30
        drawCircle(this.ctx, effect.x, effect.y, size, `rgba(239, 68, 68, ${alpha})`)
      }
    }
  }

  private renderUIOverlays(): void {
    // Hover highlight
    if (this.hoveredTile) {
      const x = this.hoveredTile.x * TILE_SIZE
      const y = this.hoveredTile.y * TILE_SIZE

      this.ctx.fillStyle = HOVER_COLOR
      this.ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE)

      this.ctx.strokeStyle = SELECTION_COLOR
      this.ctx.lineWidth = 2
      this.ctx.strokeRect(x + 1, y + 1, TILE_SIZE - 2, TILE_SIZE - 2)
    }

    // Selection highlight
    if (this.selectedTile) {
      const x = this.selectedTile.x * TILE_SIZE
      const y = this.selectedTile.y * TILE_SIZE

      this.ctx.strokeStyle = SELECTION_COLOR
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
}

export const createRenderer = (canvas: HTMLCanvasElement): Renderer => {
  return new Renderer(canvas)
}
