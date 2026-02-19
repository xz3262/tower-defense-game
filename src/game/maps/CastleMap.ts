import { GameMap, WaveDefinition, EnemyType } from '../../types'
import { registerMap } from './MapData'

const TILE_SIZE = 40

// Castle map: complex layout with castle walls creating corridors
// Multiple turns and chokepoints - the hardest map
const castleTiles: string[][] = [
  ['rock', 'rock', 'rock', 'rock', 'rock', 'rock', 'rock', 'rock', 'rock', 'rock', 'rock', 'rock', 'rock', 'rock', 'rock', 'rock', 'rock', 'rock', 'rock', 'rock'],
  ['rock', 'entry', 'path', 'path', 'rock', 'grass', 'grass', 'grass', 'rock', 'grass', 'grass', 'grass', 'grass', 'rock', 'path', 'path', 'path', 'path', 'rock', 'rock'],
  ['rock', 'path', 'rock', 'path', 'rock', 'grass', 'grass', 'grass', 'rock', 'grass', 'grass', 'grass', 'grass', 'rock', 'path', 'rock', 'rock', 'path', 'rock', 'rock'],
  ['rock', 'path', 'rock', 'path', 'path', 'path', 'rock', 'rock', 'rock', 'path', 'path', 'path', 'rock', 'rock', 'path', 'rock', 'rock', 'path', 'rock', 'rock'],
  ['rock', 'path', 'rock', 'rock', 'rock', 'path', 'rock', 'grass', 'grass', 'grass', 'grass', 'path', 'rock', 'grass', 'path', 'path', 'path', 'path', 'rock', 'rock'],
  ['rock', 'path', 'path', 'path', 'rock', 'path', 'rock', 'grass', 'grass', 'grass', 'grass', 'path', 'rock', 'grass', 'grass', 'grass', 'grass', 'path', 'rock', 'rock'],
  ['rock', 'rock', 'rock', 'path', 'rock', 'path', 'rock', 'rock', 'rock', 'rock', 'rock', 'path', 'rock', 'grass', 'grass', 'grass', 'grass', 'path', 'rock', 'rock'],
  ['rock', 'grass', 'grass', 'path', 'grass', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'rock', 'grass', 'grass', 'grass', 'grass', 'path', 'rock', 'rock'],
  ['rock', 'grass', 'grass', 'path', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path', 'rock', 'path', 'path', 'path', 'rock', 'path', 'rock', 'rock'],
  ['rock', 'grass', 'grass', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'grass', 'path', 'rock', 'path', 'rock', 'path', 'rock', 'path', 'rock', 'rock'],
  ['rock', 'grass', 'rock', 'rock', 'rock', 'rock', 'rock', 'rock', 'rock', 'path', 'grass', 'path', 'path', 'path', 'rock', 'path', 'rock', 'path', 'rock', 'rock'],
  ['rock', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'rock', 'path', 'grass', 'grass', 'grass', 'path', 'rock', 'path', 'rock', 'path', 'rock', 'rock'],
  ['rock', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'rock', 'path', 'path', 'path', 'path', 'path', 'rock', 'path', 'path', 'path', 'rock', 'rock'],
  ['rock', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'rock', 'rock', 'rock', 'rock', 'rock', 'path', 'rock', 'path', 'path', 'path', 'exit', 'rock'],
  ['rock', 'rock', 'rock', 'rock', 'rock', 'rock', 'rock', 'rock', 'rock', 'rock', 'rock', 'rock', 'rock', 'rock', 'rock', 'rock', 'rock', 'rock', 'rock', 'rock']
]

// Convert string tiles to TileType
const tiles = castleTiles.map((row) => row.map((cell) => cell as 'grass' | 'path' | 'rock' | 'entry' | 'exit'))

// Path waypoints in grid coordinates (center of each tile)
const pathPoints = [
  { x: 1, y: 1 }, // entry
  { x: 3, y: 1 },
  { x: 3, y: 3 },
  { x: 4, y: 3 },
  { x: 4, y: 5 },
  { x: 5, y: 5 },
  { x: 5, y: 3 },
  { x: 8, y: 3 },
  { x: 8, y: 5 },
  { x: 10, y: 5 },
  { x: 10, y: 3 },
  { x: 12, y: 3 },
  { x: 12, y: 5 },
  { x: 14, y: 5 },
  { x: 14, y: 3 },
  { x: 16, y: 3 },
  { x: 16, y: 5 },
  { x: 16, y: 7 },
  { x: 11, y: 7 },
  { x: 11, y: 9 },
  { x: 9, y: 9 },
  { x: 9, y: 7 },
  { x: 7, y: 7 },
  { x: 7, y: 9 },
  { x: 5, y: 9 },
  { x: 5, y: 7 },
  { x: 3, y: 7 },
  { x: 3, y: 9 },
  { x: 3, y: 11 },
  { x: 1, y: 11 },
  { x: 1, y: 13 },
  { x: 3, y: 13 },
  { x: 5, y: 13 },
  { x: 7, y: 13 },
  { x: 9, y: 13 },
  { x: 11, y: 13 },
  { x: 13, y: 13 },
  { x: 15, y: 13 },
  { x: 17, y: 13 },
  { x: 18, y: 13 } // exit
]

// Convert grid to pixel coordinates
const path = pathPoints.map(p => ({ x: p.x * TILE_SIZE + 20, y: p.y * TILE_SIZE + 20 }))

const entryPoint = { x: 1, y: 1 }
const exitPoint = { x: 18, y: 13 }

// 20 waves: all enemy types, all 3 bosses in final 3 waves
const castleWaves: WaveDefinition[] = [
  // Wave 1: Introduction - basic enemies only
  {
    waveNumber: 1,
    delayBetweenGroups: 2,
    groups: [
      { enemyType: 'basic', count: 5, spawnInterval: 1 }
    ]
  },
  // Wave 2: More basics
  {
    waveNumber: 2,
    delayBetweenGroups: 2,
    groups: [
      { enemyType: 'basic', count: 8, spawnInterval: 0.9 }
    ]
  },
  // Wave 3: Introduce fast enemies
  {
    waveNumber: 3,
    delayBetweenGroups: 2,
    groups: [
      { enemyType: 'basic', count: 6, spawnInterval: 1 },
      { enemyType: 'fast', count: 4, spawnInterval: 0.8 }
    ]
  },
  // Wave 4: Fast enemies
  {
    waveNumber: 4,
    delayBetweenGroups: 2,
    groups: [
      { enemyType: 'fast', count: 8, spawnInterval: 0.7 }
    ]
  },
  // Wave 5: Introduce tank
  {
    waveNumber: 5,
    delayBetweenGroups: 2,
    groups: [
      { enemyType: 'basic', count: 8, spawnInterval: 1 },
      { enemyType: 'tank', count: 2, spawnInterval: 2 }
    ]
  },
  // Wave 6: Mixed
  {
    waveNumber: 6,
    delayBetweenGroups: 2,
    groups: [
      { enemyType: 'fast', count: 6, spawnInterval: 0.7 },
      { enemyType: 'tank', count: 3, spawnInterval: 2 }
    ]
  },
  // Wave 7: Introduce flying
  {
    waveNumber: 7,
    delayBetweenGroups: 2,
    groups: [
      { enemyType: 'basic', count: 6, spawnInterval: 1 },
      { enemyType: 'flying', count: 4, spawnInterval: 1.2 }
    ]
  },
  // Wave 8: More flying
  {
    waveNumber: 8,
    delayBetweenGroups: 2,
    groups: [
      { enemyType: 'flying', count: 8, spawnInterval: 1 },
      { enemyType: 'fast', count: 5, spawnInterval: 0.8 }
    ]
  },
  // Wave 9: Introduce stealth
  {
    waveNumber: 9,
    delayBetweenGroups: 2,
    groups: [
      { enemyType: 'basic', count: 8, spawnInterval: 1 },
      { enemyType: 'stealth', count: 4, spawnInterval: 1.5 }
    ]
  },
  // Wave 10: Introduce healer
  {
    waveNumber: 10,
    delayBetweenGroups: 2,
    groups: [
      { enemyType: 'tank', count: 3, spawnInterval: 2 },
      { enemyType: 'healer', count: 2, spawnInterval: 3 },
      { enemyType: 'basic', count: 8, spawnInterval: 1 }
    ]
  },
  // Wave 11: Introduce splitter
  {
    waveNumber: 11,
    delayBetweenGroups: 2,
    groups: [
      { enemyType: 'splitter', count: 4, spawnInterval: 1.5 },
      { enemyType: 'fast', count: 8, spawnInterval: 0.7 }
    ]
  },
  // Wave 12: Introduce shield
  {
    waveNumber: 12,
    delayBetweenGroups: 2,
    groups: [
      { enemyType: 'shield', count: 4, spawnInterval: 2 },
      { enemyType: 'basic', count: 10, spawnInterval: 0.8 },
      { enemyType: 'flying', count: 5, spawnInterval: 1 }
    ]
  },
  // Wave 13: Introduce speed aura
  {
    waveNumber: 13,
    delayBetweenGroups: 2,
    groups: [
      { enemyType: 'speedaura', count: 3, spawnInterval: 2 },
      { enemyType: 'fast', count: 10, spawnInterval: 0.6 },
      { enemyType: 'tank', count: 2, spawnInterval: 2 }
    ]
  },
  // Wave 14: Heavy mix
  {
    waveNumber: 14,
    delayBetweenGroups: 2,
    groups: [
      { enemyType: 'tank', count: 4, spawnInterval: 2 },
      { enemyType: 'healer', count: 3, spawnInterval: 2.5 },
      { enemyType: 'shield', count: 3, spawnInterval: 2 }
    ]
  },
  // Wave 15: Very heavy
  {
    waveNumber: 15,
    delayBetweenGroups: 2,
    groups: [
      { enemyType: 'flying', count: 8, spawnInterval: 1 },
      { enemyType: 'stealth', count: 6, spawnInterval: 1.2 },
      { enemyType: 'splitter', count: 5, spawnInterval: 1.5 }
    ]
  },
  // Wave 16: First boss - Golem
  {
    waveNumber: 16,
    delayBetweenGroups: 2,
    groups: [
      { enemyType: 'basic', count: 10, spawnInterval: 0.8 },
      { enemyType: 'tank', count: 5, spawnInterval: 1.5 },
      { enemyType: 'boss_golem', count: 1, spawnInterval: 3 }
    ]
  },
  // Wave 17: Second boss - Dragon
  {
    waveNumber: 17,
    delayBetweenGroups: 2,
    groups: [
      { enemyType: 'flying', count: 10, spawnInterval: 0.8 },
      { enemyType: 'fast', count: 8, spawnInterval: 0.6 },
      { enemyType: 'boss_dragon', count: 1, spawnInterval: 3 }
    ]
  },
  // Wave 18: Third boss - Necromancer
  {
    waveNumber: 18,
    delayBetweenGroups: 2,
    groups: [
      { enemyType: 'shield', count: 6, spawnInterval: 1.5 },
      { enemyType: 'healer', count: 4, spawnInterval: 2 },
      { enemyType: 'boss_necromancer', count: 1, spawnInterval: 3 }
    ]
  },
  // Wave 19: Two bosses
  {
    waveNumber: 19,
    delayBetweenGroups: 2,
    groups: [
      { enemyType: 'boss_golem', count: 1, spawnInterval: 3 },
      { enemyType: 'boss_dragon', count: 1, spawnInterval: 3 },
      { enemyType: 'tank', count: 6, spawnInterval: 1.5 },
      { enemyType: 'flying', count: 8, spawnInterval: 1 }
    ]
  },
  // Wave 20: All three bosses - final wave
  {
    waveNumber: 20,
    delayBetweenGroups: 2,
    groups: [
      { enemyType: 'boss_golem', count: 1, spawnInterval: 4 },
      { enemyType: 'boss_dragon', count: 1, spawnInterval: 4 },
      { enemyType: 'boss_necromancer', count: 1, spawnInterval: 4 },
      { enemyType: 'tank', count: 8, spawnInterval: 1.5 },
      { enemyType: 'shield', count: 6, spawnInterval: 1.5 },
      { enemyType: 'speedaura', count: 4, spawnInterval: 2 }
    ]
  }
]

export const castleMap: GameMap = {
  id: 'castle',
  name: 'Castle Siege',
  width: 20,
  height: 15,
  tiles,
  path,
  entryPoint,
  exitPoint,
  waves: castleWaves
}

// Register the map
registerMap(castleMap)
