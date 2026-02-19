import { create } from 'zustand'
import {
  GameStore,
  GameState,
  GameMap,
  TowerType,
  TowerInstance,
  EnemyInstance,
  ProjectileInstance,
  Position,
  StatusEffect
} from '../types'
import { getMap } from '../game/maps/MapData'
import { TowerConfig, getTowerUpgradeCost, getTowerDamage, getTowerRange } from '../game/config/TowerConfig'
import { enemyConfig } from '../game/config/EnemyConfig'
import { STARTING_GOLD, STARTING_LIVES, SELL_REFUND_RATIO, MAX_SPEED, TILE_SIZE } from '../game/config/GameConstants'
import { distance, gridToPixel } from '../utils/math'

const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11)
}

const getInitialState = () => ({
  gameState: 'menu' as GameState,
  currentMap: null as GameMap | null,
  gold: STARTING_GOLD,
  lives: STARTING_LIVES,
  currentWave: 0,
  totalWaves: 0,
  score: 0,
  speed: 1,
  selectedTower: null as TowerType | null,
  selectedPlacedTower: null as TowerInstance | null,
  towers: [] as TowerInstance[],
  enemies: [] as EnemyInstance[],
  projectiles: [] as ProjectileInstance[]
})

export const useGameStore = create<GameStore>((set, get) => ({
  ...getInitialState(),

  startGame: (mapId: string): void => {
    const map = getMap(mapId)
    if (!map) return

    set({
      gameState: 'playing',
      currentMap: map,
      gold: STARTING_GOLD,
      lives: STARTING_LIVES,
      currentWave: 0,
      totalWaves: map.waves.length,
      score: 0,
      speed: 1,
      selectedTower: null,
      selectedPlacedTower: null,
      towers: [],
      enemies: [],
      projectiles: []
    })
  },

  placeTower: (type: TowerType, gridX: number, gridY: number): void => {
    const state = get()
    if (!state.currentMap) return

    const towerStats = TowerConfig[type]
    if (state.gold < towerStats.cost) return

    const tile = state.currentMap.tiles[gridY]?.[gridX]
    if (!tile || tile.type !== 'grass') return

    const existingTower = state.towers.find(
      t => t.gridX === gridX && t.gridY === gridY
    )
    if (existingTower) return

    const newTower: TowerInstance = {
      id: generateId(),
      type,
      level: 1,
      gridX,
      gridY,
      currentTarget: null,
      lastFireTime: 0,
      totalDamageDealt: 0,
      totalKills: 0
    }

    set({
      gold: state.gold - towerStats.cost,
      towers: [...state.towers, newTower],
      selectedTower: null
    })
  },

  upgradeTower: (towerId: string): void => {
    const state = get()
    const tower = state.towers.find(t => t.id === towerId)
    if (!tower || tower.level >= 4) return

    const upgradeCost = getTowerUpgradeCost(tower.type, tower.level)
    if (state.gold < upgradeCost) return

    set({
      gold: state.gold - upgradeCost,
      towers: state.towers.map(t =>
        t.id === towerId ? { ...t, level: t.level + 1 } : t
      )
    })
  },

  sellTower: (towerId: string): void => {
    const state = get()
    const tower = state.towers.find(t => t.id === towerId)
    if (!tower) return

    const towerStats = TowerConfig[tower.type]
    const sellValue = Math.floor(towerStats.cost * SELL_REFUND_RATIO)

    set({
      gold: state.gold + sellValue,
      towers: state.towers.filter(t => t.id !== towerId),
      selectedPlacedTower: state.selectedPlacedTower?.id === towerId ? null : state.selectedPlacedTower
    })
  },

  startWave: (): void => {
    const state = get()
    if (!state.currentMap || state.currentWave >= state.totalWaves) return
    if (state.gameState !== 'playing') return

    set({ currentWave: state.currentWave + 1 })
  },

  togglePause: (): void => {
    const state = get()
    if (state.gameState === 'playing') {
      set({ gameState: 'paused' })
    } else if (state.gameState === 'paused') {
      set({ gameState: 'playing' })
    }
  },

  setSpeed: (speed: number): void => {
    const clampedSpeed = Math.max(1, Math.min(speed, MAX_SPEED))
    set({ speed: clampedSpeed })
  },

  selectTower: (type: TowerType | null): void => {
    set({ selectedTower: type })
  },

  selectPlacedTower: (tower: TowerInstance | null): void => {
    set({ selectedPlacedTower: tower })
  },

  addGold: (amount: number): void => {
    set(state => ({ gold: state.gold + amount }))
  },

  removeLife: (): void => {
    const state = get()
    const newLives = state.lives - 1
    if (newLives <= 0) {
      set({ lives: 0, gameState: 'defeat' })
    } else {
      set({ lives: newLives })
    }
  },

  tick: (deltaTime: number): void => {
    const state = get()
    if (state.gameState !== 'playing') return

    const scaledDelta = deltaTime * state.speed
    const currentTime = performance.now()

    // Update enemies - move along path
    const updatedEnemies = state.enemies.map(enemy => {
      if (!enemy.isAlive) return enemy

      const path = state.currentMap?.path || []
      if (path.length === 0) return enemy

      const currentWaypoint = path[enemy.pathIndex]
      if (!currentWaypoint) return enemy

      const pixelPos = gridToPixel(currentWaypoint.x, currentWaypoint.y)
      const dx = pixelPos.x - enemy.x
      const dy = pixelPos.y - enemy.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 5) {
        // Reached waypoint, move to next
        if (enemy.pathIndex >= path.length - 1) {
          // Reached exit
          get().removeLife()
          return { ...enemy, isAlive: false }
        }
        return {
          ...enemy,
          pathIndex: enemy.pathIndex + 1,
          x: pixelPos.x,
          y: pixelPos.y
        }
      }

      // Move toward waypoint
      const moveSpeed = enemy.speed * TILE_SIZE * (scaledDelta / 1000)
      const moveX = enemy.x + (dx / dist) * moveSpeed
      const moveY = enemy.y + (dy / dist) * moveSpeed

      return { ...enemy, x: moveX, y: moveY }
    }).filter(e => e.isAlive)

    // Update projectiles - move toward targets
    const updatedProjectiles = state.projectiles.map(proj => {
      const target = updatedEnemies.find(e => e.id === proj.targetId)
      if (!target) return { ...proj, targetId: '' }

      const dx = target.x - proj.x
      const dy = target.y - proj.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 10) {
        // Hit target - apply damage
        const damage = proj.damage
        const updatedEnemiesWithDamage = updatedEnemies.map(e => {
          if (e.id !== target.id) return e
          const newHp = e.hp - damage
          if (newHp <= 0) {
            // Enemy killed
            const enemyStats = enemyConfig[e.type]
            get().addGold(enemyStats.reward)
            get().set(s => ({ score: s.score + enemyStats.reward }))
            return { ...e, hp: 0, isAlive: false }
          }
          return { ...e, hp: newHp }
        }).filter(e => e.isAlive)

        // Apply status effect if any
        if (proj.effect) {
          const updatedWithEffect = updatedEnemiesWithDamage.map(e => {
            if (e.id !== target.id) return e
            return { ...e, effects: [...e.effects, proj.effect!] }
          })
          return null
        }

        return null
      }

      // Move projectile
      const moveSpeed = proj.speed * (scaledDelta / 1000)
      const moveX = proj.x + (dx / dist) * moveSpeed
      const moveY = proj.y + (dy / dist) * moveSpeed

      return { ...proj, x: moveX, y: moveY }
    }).filter((p): p is ProjectileInstance => p !== null)

    // Tower targeting and firing
    const newProjectiles: ProjectileInstance[] = []
    const updatedTowers = state.towers.map(tower => {
      const towerStats = TowerConfig[tower.type]
      const range = getTowerRange(tower.type, tower.level)
      const damage = getTowerDamage(tower.type, tower.level)
      const rangePixels = range * TILE_SIZE

      // Find target
      let target: EnemyInstance | null = null
      let minDist = Infinity

      for (const enemy of updatedEnemies) {
        const towerPos = gridToPixel(tower.gridX, tower.gridY)
        const dist = distance(towerPos, { x: enemy.x, y: enemy.y })

        if (dist <= rangePixels) {
          // Check if can target flying
          const enemyStats = enemyConfig[enemy.type]
          if (!towerStats.canTargetFlying && enemyStats.isFlying) continue

          if (dist < minDist) {
            minDist = dist
            target = enemy
          }
        }
      }

      if (!target) {
        return { ...tower, currentTarget: null }
      }

      // Check if can fire
      const fireInterval = 1000 / towerStats.fireRate
      const timeSinceLastFire = currentTime - tower.lastFireTime

      if (timeSinceLastFire >= fireInterval) {
        // Fire projectile
        const towerPos = gridToPixel(tower.gridX, tower.gridY)
        const projectile: ProjectileInstance = {
          id: generateId(),
          type: tower.type,
          x: towerPos.x,
          y: towerPos.y,
          targetId: target.id,
          damage,
          speed: towerStats.projectileSpeed,
          effect: null,
          isAoE: false,
          aoERadius: 0
        }
        newProjectiles.push(projectile)

        return {
          ...tower,
          currentTarget: target.id,
          lastFireTime: currentTime
        }
      }

      return { ...tower, currentTarget: target.id }
    })

    // Check victory condition
    let newGameState = state.gameState
    if (
      state.currentWave >= state.totalWaves &&
      updatedEnemies.length === 0 &&
      state.currentWave > 0
    ) {
      newGameState = 'victory'
    }

    set({
      enemies: updatedEnemies,
      projectiles: [...updatedProjectiles, ...newProjectiles],
      towers: updatedTowers,
      gameState: newGameState
    })
  }
}))
