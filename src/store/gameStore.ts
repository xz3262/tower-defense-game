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
  StatusEffect,
  EnemyType
} from '../types'
import { getMap } from '../game/maps/MapData'
import { TowerConfig, getTowerUpgradeCost, getTowerDamage, getTowerRange } from '../game/config/TowerConfig'
import { enemyConfig } from '../game/config/EnemyConfig'
import { STARTING_GOLD, STARTING_LIVES, SELL_REFUND_RATIO, MAX_SPEED, TILE_SIZE } from '../game/config/GameConstants'
import { distance, gridToPixel, pixelToGrid } from '../utils/math'
import { WaveManager, createWaveManager } from '../game/systems/WaveManager'
import { moveAlongPath } from '../game/systems/PathSystem'
import { checkProjectileHits, applyStatusEffect } from '../game/systems/CollisionSystem'
import { applyDamage, applyStatusEffect as applyDamageStatusEffect, updateStatusEffects, createBurnEffect, createPoisonEffect, createSlowEffect } from '../game/systems/DamageSystem'
import { calculateKillReward } from '../game/systems/EconomySystem'

export interface GameSettings {
  soundEnabled: boolean
  showRangeCircles: boolean
  showHealthBars: boolean
  showDamageNumbers: boolean
  defaultSpeed: number
}

const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
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
  projectiles: [] as ProjectileInstance[],
  gameSettings: {
    soundEnabled: true,
    showRangeCircles: true,
    showHealthBars: true,
    showDamageNumbers: true,
    defaultSpeed: 1
  } as GameSettings,
  waveManager: null as WaveManager | null
})

export const useGameStore = create<GameStore>((set, get) => ({
  ...getInitialState(),

  updateGameSettings: (newSettings: Partial<GameSettings>): void => {
    set(state => ({
      gameSettings: { ...state.gameSettings, ...newSettings }
    }))
  },


  startGame: (mapId: string): void => {
    const map = getMap(mapId)
    if (!map) return

    const settings = get().gameSettings
    const waveManager = createWaveManager()
    waveManager.setPath(map.path)


    set({
      gameState: 'playing',
      currentMap: map,
      gold: STARTING_GOLD,
      lives: STARTING_LIVES,
      currentWave: 0,
      totalWaves: map.waves.length,
      score: 0,
      speed: settings.defaultSpeed,
      selectedTower: null,
      selectedPlacedTower: null,
      towers: [],
      enemies: [],
      projectiles: [],
      waveManager
    })
  },

  placeTower: (type: TowerType, gridX: number, gridY: number): void => {
    const state = get()
    if (!state.currentMap) return

    const towerStats = TowerConfig[type]
    if (state.gold < towerStats.cost) return

    const tile = state.currentMap.tiles[gridY]?.[gridX]
    if (!tile || tile !== 'grass') return

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

    const waveIndex = state.currentWave
    const waveDef = state.currentMap.waves[waveIndex]
    if (!waveDef) return

    const waveManager = state.waveManager
    if (waveManager) {
      waveManager.setOnEnemySpawned((enemy: EnemyInstance) => {
        set(s => ({ enemies: [...s.enemies, enemy] }))
      })
      waveManager.startWave(waveDef)
    }

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


    const scaledDelta = (deltaTime / 1000) * state.speed
    const currentTime = performance.now()
    const path = state.currentMap?.path || []

    // 1. WaveManager spawns enemies
    const waveManager = state.waveManager
    if (waveManager && waveManager.isWaveActive) {
      waveManager.update(scaledDelta, state.enemies)
    }

    // 2. PathSystem moves enemies along path
    let updatedEnemies = state.enemies.map(enemy => {
      if (!enemy.isAlive) return enemy

      const reachedExit = moveAlongPath(enemy, scaledDelta, path)
      if (reachedExit) {
        get().removeLife()
        return { ...enemy, isAlive: false }
      }
      return enemy
    }).filter(e => e.isAlive)


    // 3. Update status effects on enemies (DamageSystem)
    updatedEnemies = updatedEnemies.map(enemy => {
      if (!enemy.isAlive || enemy.effects.length === 0) return enemy

      const slowMagnitude = updateStatusEffects(enemy, scaledDelta)
      if (slowMagnitude > 0) {
        enemy.speed = enemyConfig[enemy.type].speed * (1 - slowMagnitude)
      }
      if (enemy.hp <= 0) {
        return { ...enemy, hp: 0, isAlive: false }
      }
      return enemy
    }).filter(e => e.isAlive)

    // 4. Tower targeting and firing
    const newProjectiles: ProjectileInstance[] = []
    const updatedTowers = state.towers.map(tower => {
      const towerStats = TowerConfig[tower.type]
      const range = getTowerRange(tower.type, tower.level)
      const damage = getTowerDamage(tower.type, tower.level)
      const rangePixels = range * TILE_SIZE

      // Gold Mine generates passive income
      if (tower.type === 'goldmine') {
        const goldPerSecond = 10 * tower.level
        const goldInterval = 5 // every 5 seconds
        const timeSinceLastFire = currentTime - tower.lastFireTime
        if (timeSinceLastFire >= goldInterval * 1000) {
          get().addGold(Math.floor(goldPerSecond * goldInterval))
          return { ...tower, lastFireTime: currentTime }
        }
        return tower
      }

      // Slow Tower is an aura - no projectiles
      if (tower.type === 'slow') {
        // Apply slow to all enemies in range
        updatedEnemies = updatedEnemies.map(enemy => {
          const towerPos = gridToPixel(tower.gridX, tower.gridY)
          const dist = distance(towerPos, { x: enemy.x, y: enemy.y })
          if (dist <= rangePixels) {
            const slowEffect = createSlowEffect(tower.id)
            return applyDamageStatusEffect(enemy, slowEffect)
          }
          return enemy
        })
        return tower
      }

      // Find closest enemy in range
      let target: EnemyInstance | null = null
      let minDist = Infinity

      for (const enemy of updatedEnemies) {
        const towerPos = gridToPixel(tower.gridX, tower.gridY)
        const dist = distance(towerPos, { x: enemy.x, y: enemy.y })


        if (dist <= rangePixels) {
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

      const fireInterval = 1000 / towerStats.fireRate
      const timeSinceLastFire = currentTime - tower.lastFireTime

      if (timeSinceLastFire >= fireInterval) {
        const towerPos = gridToPixel(tower.gridX, tower.gridY)


        // Create projectile based on tower type
        let effect: StatusEffect | null = null
        let isAoE = false
        let aoERadius = 0


        switch (tower.type) {
          case 'fire':
            effect = createBurnEffect(tower.id)
            break
          case 'poison':
            effect = createPoisonEffect(tower.id)
            isAoE = true
            aoERadius = 30
            break
          case 'ice':
            effect = createSlowEffect(tower.id)
            break
          case 'cannon':
          case 'bomb':
            isAoE = true
            aoERadius = 50
            break
        }


        const projectile: ProjectileInstance = {
          id: generateId(),
          type: tower.type,
          x: towerPos.x,
          y: towerPos.y,
          targetId: target.id,
          damage,
          speed: towerStats.projectileSpeed,
          effect,
          isAoE,
          aoERadius
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


    // 5. Projectiles move toward targets
    let updatedProjectiles = [...state.projectiles, ...newProjectiles].map(proj => {
      if (!proj.targetId) return null

      const target = updatedEnemies.find(e => e.id === proj.targetId)
      if (!target) return null

      const dx = target.x - proj.x
      const dy = target.y - proj.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 15) {
        // Hit! Return hit info for processing
        return { projectile: proj, target }
      }

      if (proj.speed === 0) return null // Laser/continuous damage

      const moveSpeed = proj.speed * scaledDelta * 60
      const moveX = proj.x + (dx / dist) * moveSpeed
      const moveY = proj.y + (dy / dist) * moveSpeed

      return { ...proj, x: moveX, y: moveY }
    })


    // 6. CollisionSystem checks hits and applies damage
    const processedHits = new Set<string>()
    updatedProjectiles = updatedProjectiles.filter(p => {
      if (!p || !('targetId' in p)) return false
      const proj = p as ProjectileInstance
      if (processedHits.has(proj.id)) return false

      const target = updatedEnemies.find(e => e.id === proj.targetId)
      if (!target) return false

      const dx = target.x - proj.x
      const dy = target.y - proj.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 15) {
        processedHits.add(proj.id)


        // Apply damage
        const enemyStats = enemyConfig[target.type]
        const actualDamage = Math.max(1, proj.damage - enemyStats.armor)
        target.hp -= actualDamage

        // Apply status effect
        if (proj.effect) {
          target = applyDamageStatusEffect(target, proj.effect)
        }

        // Handle AoE
        if (proj.isAoE && proj.aoERadius > 0) {
          updatedEnemies = updatedEnemies.map(e => {
            if (e.id === target.id) return target
            const aoeDist = distance(
              { x: target.x, y: target.y },
              { x: e.x, y: e.y }
            )
            if (aoeDist <= proj.aoERadius) {
              const aoeDamage = Math.max(1, Math.floor(proj.damage * 0.5) - enemyStats.armor)
              e.hp -= aoeDamage
            }
            return e
          })
        }

        return null // Remove projectile
      }

      return proj
    })


    // 7. Remove dead enemies, add gold
    const deadEnemies: EnemyInstance[] = []
    updatedEnemies = updatedEnemies.filter(enemy => {
      if (enemy.hp <= 0) {
        deadEnemies.push(enemy)
        return false
      }
      return true
    })


    for (const dead of deadEnemies) {
      const enemyStats = enemyConfig[dead.type]
      const reward = calculateKillReward(enemyStats.reward, state.currentWave, enemyStats.isBoss)
      get().addGold(reward)
      set(s => ({ score: s.score + reward }))
    }


    // 8. Check win condition
    let newGameState = state.gameState
    if (
      state.currentWave >= state.totalWaves &&
      updatedEnemies.length === 0 &&
      state.currentWave > 0 &&
      state.enemies.length === 0
    ) {
      const waveManager = state.waveManager
      if (waveManager && waveManager.isSpawningComplete()) {
        newGameState = 'victory'
      }
    }

    set({
      enemies: updatedEnemies,
      projectiles: updatedProjectiles.filter((p): p is ProjectileInstance => p !== null && 'targetId' in p),
      towers: updatedTowers,
      gameState: newGameState
    })
  }
}))