import { WaveDefinition, EnemyGroup, EnemyInstance, EnemyType, Position } from '../../types'
import { enemyConfig } from '../config/EnemyConfig'
import { TILE_SIZE } from '../config/GameConstants'

interface SpawnState {
  groupIndex: number
  enemiesSpawnedInGroup: number
  timeSinceLastSpawn: number
  timeSinceLastGroup: number
  isSpawning: boolean
  isComplete: boolean
}

export class WaveManager {
  public currentWave: number = 0
  public isWaveActive: boolean = false
  public totalEnemiesInWave: number = 0
  public enemiesSpawned: number = 0

  private spawnState: SpawnState = {
    groupIndex: 0,
    enemiesSpawnedInGroup: 0,
    timeSinceLastSpawn: 0,
    timeSinceLastGroup: 0,
    isSpawning: false,
    isComplete: false
  }

  private currentWaveDef: WaveDefinition | null = null
  private path: Position[] = []
  private onEnemySpawned: ((enemy: EnemyInstance) => void) | null = null

  public setPath(path: Position[]): void {
    this.path = path
  }

  public setOnEnemySpawned(callback: (enemy: EnemyInstance) => void): void {
    this.onEnemySpawned = callback
  }

  public startWave(waveDef: WaveDefinition): void {
    this.currentWave = waveDef.waveNumber
    this.currentWaveDef = waveDef
    this.isWaveActive = true
    this.totalEnemiesInWave = this.calculateTotalEnemies(waveDef)
    this.enemiesSpawned = 0
    this.spawnState = {
      groupIndex: 0,
      enemiesSpawnedInGroup: 0,
      timeSinceLastSpawn: 0,
      timeSinceLastGroup: 0,
      isSpawning: true,
      isComplete: false
    }
  }

  private calculateTotalEnemies(waveDef: WaveDefinition): number {
    return waveDef.groups.reduce((total, group) => total + group.count, 0)
  }

  public update(dt: number, aliveEnemies: EnemyInstance[]): void {
    if (!this.isWaveActive || !this.currentWaveDef || this.spawnState.isComplete) {
      return
    }

    const groups = this.currentWaveDef.groups
    const currentGroup = groups[this.spawnState.groupIndex]

    if (!currentGroup) {
      this.spawnState.isComplete = true
      return
    }

    // Update spawn timers
    this.spawnState.timeSinceLastSpawn += dt
    this.spawnState.timeSinceLastGroup += dt

    // Check if we should start spawning the next group
    if (this.spawnState.groupIndex > 0) {
      const delayBetweenGroups = this.currentWaveDef.delayBetweenGroups
      if (this.spawnState.timeSinceLastGroup >= delayBetweenGroups) {
        this.spawnState.timeSinceLastGroup = 0
      }
    }

    // Spawn enemies from current group
    if (
      this.spawnState.enemiesSpawnedInGroup < currentGroup.count &&
      this.spawnState.timeSinceLastSpawn >= currentGroup.spawnInterval
    ) {
      this.spawnState.timeSinceLastSpawn = 0
      this.spawnEnemy(currentGroup.enemyType)
      this.spawnState.enemiesSpawnedInGroup++
      this.enemiesSpawned++
    }

    // Check if current group is done spawning
    if (this.spawnState.enemiesSpawnedInGroup >= currentGroup.count) {
      // Move to next group
      if (this.spawnState.groupIndex < groups.length - 1) {
        this.spawnState.groupIndex++
        this.spawnState.enemiesSpawnedInGroup = 0
        this.spawnState.timeSinceLastGroup = 0
      } else {
        // All groups done spawning
        this.spawnState.isComplete = true
      }
    }
  }

  private spawnEnemy(enemyType: EnemyType): void {
    if (!this.onEnemySpawned || this.path.length === 0) return

    const config = enemyConfig[enemyType]
    const startPos = this.path[0]
    const pixelX = startPos.x * TILE_SIZE + TILE_SIZE / 2
    const pixelY = startPos.y * TILE_SIZE + TILE_SIZE / 2

    const enemy: EnemyInstance = {
      id: `enemy_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      type: enemyType,
      hp: config.maxHP,
      maxHP: config.maxHP,
      x: pixelX,
      y: pixelY,
      speed: config.speed,
      pathIndex: 0,
      progress: 0,
      effects: [],
      isAlive: true,
      isVisible: !config.isFlying
    }

    this.onEnemySpawned(enemy)
  }

  public isWaveComplete(aliveEnemies: EnemyInstance[]): boolean {
    return (
      this.spawnState.isComplete &&
      aliveEnemies.length === 0 &&
      this.enemiesSpawned > 0
    )
  }

  public getProgress(aliveEnemies: EnemyInstance[]): number {
    if (this.totalEnemiesInWave === 0) return 0

    const killedEnemies = this.enemiesSpawned - aliveEnemies.length
    const progress = killedEnemies / this.totalEnemiesInWave

    return Math.min(1, Math.max(0, progress))
  }

  public reset(): void {
    this.currentWave = 0
    this.isWaveActive = false
    this.totalEnemiesInWave = 0
    this.enemiesSpawned = 0
    this.currentWaveDef = null
    this.spawnState = {
      groupIndex: 0,
      enemiesSpawnedInGroup: 0,
      timeSinceLastSpawn: 0,
      timeSinceLastGroup: 0,
      isSpawning: false,
      isComplete: false
    }
  }

  public getRemainingSpawns(): number {
    if (!this.currentWaveDef) return 0

    const groups = this.currentWaveDef.groups
    let remaining = 0

    for (let i = this.spawnState.groupIndex; i < groups.length; i++) {
      const group = groups[i]
      if (i === this.spawnState.groupIndex) {
        remaining += group.count - this.spawnState.enemiesSpawnedInGroup
      } else {
        remaining += group.count
      }
    }

    return remaining
  }

  public isSpawningComplete(): boolean {
    return this.spawnState.isComplete
  }
}

export const createWaveManager = (): WaveManager => {
  return new WaveManager()
}
