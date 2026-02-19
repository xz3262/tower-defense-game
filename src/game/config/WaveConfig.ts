import { GameMap, WaveDefinition, EnemyType, EnemyGroup } from '../../types'
import { getMap } from '../maps/MapData'

// Wave configuration constants
export const WAVE_SPAWN_BUFFER = 500 // ms between spawns
export const WAVE_COMPLETION_BONUS = 25
export const BOSS_WAVE_BONUS = 100

// Helper to create enemy groups
const createGroup = (enemyType: EnemyType, count: number, spawnInterval: number): EnemyGroup => ({
  enemyType,
  count,
  spawnInterval
})

// Helper to create wave definitions
const createWave = (waveNumber: number, groups: EnemyGroup[], delayBetweenGroups: number = 2): WaveDefinition => ({
  waveNumber,
  groups,
  delayBetweenGroups
})

// Grasslands Map Waves (10 waves) - Tutorial map
export const grasslandsWaves: WaveDefinition[] = [
  createWave(1, [createGroup('basic', 5, 1.5)]),
  createWave(2, [createGroup('basic', 8, 1.2)]),
  createWave(3, [createGroup('basic', 6, 1.2), createGroup('fast', 4, 1.0)]),
  createWave(4, [createGroup('fast', 6, 1.0), createGroup('basic', 6, 1.2)]),
  createWave(5, [createGroup('basic', 8, 1.2), createGroup('tank', 2, 3.0)]),
  createWave(6, [createGroup('fast', 8, 0.8), createGroup('tank', 3, 2.5)]),
  createWave(7, [createGroup('basic', 10, 1.0), createGroup('fast', 6, 0.8), createGroup('tank', 2, 3.0)]),
  createWave(8, [createGroup('tank', 4, 2.5), createGroup('fast', 10, 0.6), createGroup('basic', 8, 1.0)]),
  createWave(9, [createGroup('tank', 5, 2.0), createGroup('fast', 12, 0.5), createGroup('basic', 10, 0.8)]),
  createWave(10, [createGroup('basic', 15, 0.8), createGroup('fast', 8, 0.6), createGroup('tank', 3, 2.5), createGroup('boss_golem', 1, 5.0)], 3)
]

// Desert Map Waves (12 waves) - Introduces flying and stealth
export const desertWaves: WaveDefinition[] = [
  createWave(1, [createGroup('basic', 5, 1.5)]),
  createWave(2, [createGroup('basic', 8, 1.2)]),
  createWave(3, [createGroup('fast', 6, 1.0)]),
  createWave(4, [createGroup('basic', 5, 1.2), createGroup('flying', 3, 2.0)]),
  createWave(5, [createGroup('fast', 8, 0.8), createGroup('flying', 4, 1.5)]),
  createWave(6, [createGroup('tank', 3, 2.0), createGroup('fast', 6, 1.0)]),
  createWave(7, [createGroup('basic', 6, 1.0), createGroup('stealth', 4, 1.5)]),
  createWave(8, [createGroup('tank', 4, 1.5), createGroup('stealth', 5, 1.2)]),
  createWave(9, [createGroup('fast', 10, 0.6), createGroup('flying', 6, 1.0)]),
  createWave(10, [createGroup('tank', 5, 1.5), createGroup('stealth', 6, 1.0), createGroup('flying', 4, 1.5)]),
  createWave(11, [createGroup('boss_golem', 1, 0), createGroup('fast', 8, 0.8), createGroup('flying', 5, 1.0)], 3),
  createWave(12, [createGroup('boss_dragon', 1, 0), createGroup('stealth', 8, 1.0), createGroup('flying', 6, 1.2)], 3)
]

// Snowfield Map Waves (15 waves) - Introduces healers and splitters
export const snowfieldWaves: WaveDefinition[] = [
  createWave(1, [createGroup('basic', 5, 1.5)]),
  createWave(2, [createGroup('basic', 8, 1.2)]),
  createWave(3, [createGroup('basic', 10, 1.0)]),
  createWave(4, [createGroup('basic', 6, 1.2), createGroup('fast', 4, 1.0)]),
  createWave(5, [createGroup('fast', 8, 0.8), createGroup('basic', 5, 1.2)]),
  createWave(6, [createGroup('basic', 8, 1.0), createGroup('tank', 2, 3.0)]),
  createWave(7, [createGroup('tank', 3, 2.5), createGroup('fast', 6, 0.8)]),
  createWave(8, [createGroup('basic', 10, 1.0), createGroup('flying', 5, 1.5)]),
  createWave(9, [createGroup('stealth', 6, 1.2), createGroup('basic', 8, 1.0)]),
  createWave(10, [createGroup('healer', 3, 2.0), createGroup('tank', 3, 2.5), createGroup('basic', 10, 1.0)]),
  createWave(11, [createGroup('splitter', 4, 2.0), createGroup('fast', 8, 0.8)]),
  createWave(12, [createGroup('shield', 5, 1.5), createGroup('healer', 2, 2.5), createGroup('basic', 10, 1.0)]),
  createWave(13, [createGroup('speedaura', 3, 2.0), createGroup('fast', 10, 0.6), createGroup('tank', 3, 2.5)]),
  createWave(14, [createGroup('boss_dragon', 1, 0), createGroup('flying', 8, 1.0)], 5),
  createWave(15, [createGroup('boss_necromancer', 1, 0), createGroup('shield', 5, 1.5), createGroup('healer', 3, 2.0)], 5)
]

// Swamp Map Waves (12 waves) - Heavy support units
export const swampWaves: WaveDefinition[] = [
  createWave(1, [createGroup('basic', 5, 1.0)]),
  createWave(2, [createGroup('fast', 6, 0.8), createGroup('basic', 3, 1.0)]),
  createWave(3, [createGroup('shield', 3, 1.5), createGroup('basic', 5, 1.0)]),
  createWave(4, [createGroup('healer', 2, 2.0), createGroup('basic', 6, 1.0), createGroup('fast', 3, 0.8)]),
  createWave(5, [createGroup('shield', 4, 1.2), createGroup('healer', 2, 1.8), createGroup('basic', 5, 1.0)]),
  createWave(6, [createGroup('tank', 2, 2.0), createGroup('shield', 3, 1.2), createGroup('basic', 5, 1.0)]),
  createWave(7, [createGroup('healer', 4, 1.5), createGroup('shield', 4, 1.2), createGroup('basic', 6, 0.8)]),
  createWave(8, [createGroup('flying', 5, 1.0), createGroup('healer', 2, 1.8), createGroup('fast', 4, 0.8)]),
  createWave(9, [createGroup('speedaura', 3, 2.0), createGroup('tank', 2, 2.0), createGroup('shield', 5, 1.0), createGroup('basic', 8, 0.8)]),
  createWave(10, [createGroup('healer', 4, 1.5), createGroup('shield', 6, 1.0), createGroup('tank', 3, 1.8), createGroup('fast', 5, 0.7)]),
  createWave(11, [createGroup('speedaura', 3, 1.5), createGroup('healer', 5, 1.2), createGroup('shield', 8, 0.8), createGroup('tank', 3, 1.5), createGroup('flying', 4, 1.0)]),
  createWave(12, [createGroup('boss_necromancer', 1, 0), createGroup('healer', 4, 2.0), createGroup('shield', 6, 1.0), createGroup('tank', 2, 2.0)], 3)
]

// Volcano Map Waves (12 waves) - Split path, dual bosses
export const volcanoWaves: WaveDefinition[] = [
  createWave(1, [createGroup('basic', 5, 1.0), createGroup('basic', 5, 1.0)]),
  createWave(2, [createGroup('basic', 8, 0.8), createGroup('fast', 3, 1.2)]),
  createWave(3, [createGroup('fast', 6, 0.8), createGroup('basic', 8, 0.8)]),
  createWave(4, [createGroup('tank', 2, 2.0), createGroup('basic', 8, 0.8)]),
  createWave(5, [createGroup('flying', 4, 1.0), createGroup('fast', 6, 0.8)]),
  createWave(6, [createGroup('tank', 3, 1.5), createGroup('flying', 5, 0.8), createGroup('basic', 10, 0.6)]),
  createWave(7, [createGroup('stealth', 4, 1.2), createGroup('shield', 2, 2.0), createGroup('basic', 8, 0.8)]),
  createWave(8, [createGroup('healer', 2, 2.0), createGroup('tank', 4, 1.5), createGroup('fast', 8, 0.6)]),
  createWave(9, [createGroup('splitter', 3, 1.5), createGroup('speedaura', 2, 2.0), createGroup('flying', 6, 0.8), createGroup('basic', 12, 0.5)]),
  createWave(10, [createGroup('tank', 6, 1.2), createGroup('shield', 4, 1.5), createGroup('stealth', 6, 1.0), createGroup('fast', 10, 0.5)]),
  createWave(11, [createGroup('healer', 4, 1.5), createGroup('speedaura', 3, 1.8), createGroup('tank', 8, 1.0), createGroup('flying', 10, 0.6), createGroup('splitter', 5, 1.0)]),
  createWave(12, [createGroup('boss_golem', 1, 0), createGroup('tank', 8, 1.0), createGroup('shield', 6, 1.2), createGroup('basic', 15, 0.4)], 4)
]

// Castle Map Waves (20 waves) - Final challenge with all enemy types
export const castleWaves: WaveDefinition[] = [
  createWave(1, [createGroup('basic', 5, 1.0)]),
  createWave(2, [createGroup('basic', 8, 0.9)]),
  createWave(3, [createGroup('basic', 6, 1.0), createGroup('fast', 4, 0.8)]),
  createWave(4, [createGroup('fast', 8, 0.7)]),
  createWave(5, [createGroup('basic', 8, 1.0), createGroup('tank', 2, 2.0)]),
  createWave(6, [createGroup('fast', 6, 0.7), createGroup('tank', 3, 2.0)]),
  createWave(7, [createGroup('basic', 6, 1.0), createGroup('flying', 4, 1.2)]),
  createWave(8, [createGroup('flying', 8, 1.0), createGroup('fast', 5, 0.8)]),
  createWave(9, [createGroup('basic', 8, 1.0), createGroup('stealth', 4, 1.5)]),
  createWave(10, [createGroup('tank', 3, 2.0), createGroup('healer', 2, 3.0), createGroup('basic', 8, 1.0)]),
  createWave(11, [createGroup('splitter', 4, 1.5), createGroup('fast', 8, 0.7)]),
  createWave(12, [createGroup('shield', 4, 2.0), createGroup('basic', 10, 0.8), createGroup('flying', 5, 1.0)]),
  createWave(13, [createGroup('speedaura', 3, 2.0), createGroup('fast', 10, 0.6), createGroup('tank', 2, 2.0)]),
  createWave(14, [createGroup('tank', 4, 2.0), createGroup('healer', 3, 2.5), createGroup('shield', 3, 2.0)]),
  createWave(15, [createGroup('flying', 8, 1.0), createGroup('stealth', 6, 1.2), createGroup('splitter', 5, 1.5)]),
  createWave(16, [createGroup('basic', 10, 0.8), createGroup('tank', 5, 1.5), createGroup('boss_golem', 1, 3.0)], 2),
  createWave(17, [createGroup('flying', 10, 0.8), createGroup('fast', 8, 0.6), createGroup('boss_dragon', 1, 3.0)], 2),
  createWave(18, [createGroup('shield', 6, 1.5), createGroup('healer', 4, 2.0), createGroup('boss_necromancer', 1, 3.0)], 2),
  createWave(19, [createGroup('boss_golem', 1, 3.0), createGroup('boss_dragon', 1, 3.0), createGroup('tank', 6, 1.5), createGroup('flying', 8, 1.0)], 2),
  createWave(20, [createGroup('boss_golem', 1, 4.0), createGroup('boss_dragon', 1, 4.0), createGroup('boss_necromancer', 1, 4.0), createGroup('tank', 8, 1.5), createGroup('shield', 6, 1.5), createGroup('speedaura', 4, 2.0)], 2)
]

// Export all waves as a record
export const allMapWaves: Record<string, WaveDefinition[]> = {
  grasslands: grasslandsWaves,
  desert: desertWaves,
  snowfield: snowfieldWaves,
  swamp: swampWaves,
  volcano: volcanoWaves,
  castle: castleWaves
}

// Get waves for a specific map
export const getWavesForMap = (mapId: string): WaveDefinition[] => {
  return allMapWaves[mapId] || []
}

// Get total wave count for a map
export const getWaveCountForMap = (mapId: string): number => {
  return getWavesForMap(mapId).length
}

// Check if a wave is a boss wave
export const isBossWave = (wave: WaveDefinition): boolean => {
  return wave.groups.some(group => 
    group.enemyType === 'boss_golem' || 
    group.enemyType === 'boss_dragon' || 
    group.enemyType === 'boss_necromancer'
  )
}

// Get total enemy count for a wave
export const getWaveEnemyCount = (wave: WaveDefinition): number => {
  return wave.groups.reduce((total, group) => total + group.count, 0)
}

// Calculate wave difficulty score
export const calculateWaveDifficulty = (wave: WaveDefinition): number => {
  const enemyWeights: Record<EnemyType, number> = {
    basic: 1,
    fast: 1.5,
    tank: 3,
    flying: 2,
    stealth: 2.5,
    healer: 3,
    splitter: 2,
    shield: 2,
    speedaura: 2.5,
    boss_golem: 20,
    boss_dragon: 18,
    boss_necromancer: 15
  }

  let difficulty = 0
  for (const group of wave.groups) {
    const weight = enemyWeights[group.enemyType] || 1
    difficulty += weight * group.count
  }

  // Add difficulty for multiple groups
  if (wave.groups.length > 1) {
    difficulty *= 1 + (wave.groups.length - 1) * 0.2
  }

  return Math.floor(difficulty)
}

// Get all unique enemy types in a wave
export const getWaveEnemyTypes = (wave: WaveDefinition): EnemyType[] => {
  return [...new Set(wave.groups.map(g => g.enemyType))]
}
