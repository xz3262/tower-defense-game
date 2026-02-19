import { GameMap, Position, TileType, WaveDefinition } from '../../types'
import { registerMap } from './MapData'

// Zigzag path from top-left to bottom-right
const path: Position[] = [
  { x: 0, y: 2 },
  { x: 3, y: 2 },
  { x: 3, y: 5 },
  { x: 7, y: 5 },
  { x: 7, y: 2 },
  { x: 11, y: 2 },
  { x: 11, y: 8 },
  { x: 15, y: 8 },
  { x: 15, y: 4 },
  { x: 18, y: 4 },
  { x: 18, y: 12 },
  { x: 19, y: 12 }
]

// Create tile grid
const tiles: TileType[][] = Array(15).fill(null).map(() => Array(20).fill('grass'))

// Mark path tiles
path.forEach((pos) => {
  tiles[pos.y][pos.x] = 'path'
})

// Add rock obstacles
const rockPositions: Position[] = [
  { x: 2, y: 1 }, { x: 4, y: 3 }, { x: 5, y: 6 }, { x: 6, y: 4 },
  { x: 8, y: 3 }, { x: 9, y: 1 }, { x: 10, y: 3 }, { x: 12, y: 7 },
  { x: 13, y: 9 }, { x: 14, y: 7 }, { x: 16, y: 5 }, { x: 16, y: 9 },
  { x: 17, y: 3 }, { x: 1, y: 3 }, { x: 4, y: 6 }, { x: 8, y: 1 },
  { x: 10, y: 9 }, { x: 12, y: 3 }, { x: 14, y: 5 }, { x: 17, y: 11 }
]

rockPositions.forEach((pos) => {
  if (pos.y >= 0 && pos.y < 15 && pos.x >= 0 && pos.x < 20) {
    tiles[pos.y][pos.x] = 'rock'
  }
})

// Entry and exit points
tiles[2][0] = 'entry'
tiles[12][19] = 'exit'

// Wave definitions - 12 waves with increasing difficulty
const waves: WaveDefinition[] = [
  // Wave 1: Basic enemies
  {
    waveNumber: 1,
    groups: [
      { enemyType: 'basic', count: 5, spawnInterval: 1.5 }
    ],
    delayBetweenGroups: 3
  },
  // Wave 2: More basic
  {
    waveNumber: 2,
    groups: [
      { enemyType: 'basic', count: 8, spawnInterval: 1.2 }
    ],
    delayBetweenGroups: 3
  },
  // Wave 3: Fast enemies introduced
  {
    waveNumber: 3,
    groups: [
      { enemyType: 'fast', count: 6, spawnInterval: 1.0 }
    ],
    delayBetweenGroups: 3
  },
  // Wave 4: Flying enemies introduced
  {
    waveNumber: 4,
    groups: [
      { enemyType: 'basic', count: 5, spawnInterval: 1.2 },
      { enemyType: 'flying', count: 3, spawnInterval: 2.0 }
    ],
    delayBetweenGroups: 3
  },
  // Wave 5: More flying
  {
    waveNumber: 5,
    groups: [
      { enemyType: 'fast', count: 8, spawnInterval: 0.8 },
      { enemyType: 'flying', count: 4, spawnInterval: 1.5 }
    ],
    delayBetweenGroups: 3
  },
  // Wave 6: Tank enemies
  {
    waveNumber: 6,
    groups: [
      { enemyType: 'tank', count: 3, spawnInterval: 2.0 },
      { enemyType: 'fast', count: 6, spawnInterval: 1.0 }
    ],
    delayBetweenGroups: 3
  },
  // Wave 7: Stealth enemies introduced
  {
    waveNumber: 7,
    groups: [
      { enemyType: 'basic', count: 6, spawnInterval: 1.0 },
      { enemyType: 'stealth', count: 4, spawnInterval: 1.5 }
    ],
    delayBetweenGroups: 3
  },
  // Wave 8: More stealth
  {
    waveNumber: 8,
    groups: [
      { enemyType: 'tank', count: 4, spawnInterval: 1.5 },
      { enemyType: 'stealth', count: 5, spawnInterval: 1.2 }
    ],
    delayBetweenGroups: 3
  },
  // Wave 9: Heavy flying
  {
    waveNumber: 9,
    groups: [
      { enemyType: 'fast', count: 10, spawnInterval: 0.6 },
      { enemyType: 'flying', count: 6, spawnInterval: 1.0 }
    ],
    delayBetweenGroups: 3
  },
  // Wave 10: Combined forces
  {
    waveNumber: 10,
    groups: [
      { enemyType: 'tank', count: 5, spawnInterval: 1.5 },
      { enemyType: 'stealth', count: 6, spawnInterval: 1.0 },
      { enemyType: 'flying', count: 4, spawnInterval: 1.5 }
    ],
    delayBetweenGroups: 3
  },
  // Wave 11: Boss golem
  {
    waveNumber: 11,
    groups: [
      { enemyType: 'boss_golem', count: 1, spawnInterval: 0 },
      { enemyType: 'fast', count: 8, spawnInterval: 0.8 },
      { enemyType: 'flying', count: 5, spawnInterval: 1.0 }
    ],
    delayBetweenGroups: 3
  },
  // Wave 12: Boss dragon (final wave)
  {
    waveNumber: 12,
    groups: [
      { enemyType: 'boss_dragon', count: 1, spawnInterval: 0 },
      { enemyType: 'stealth', count: 8, spawnInterval: 1.0 },
      { enemyType: 'flying', count: 6, spawnInterval: 1.2 }
    ],
    delayBetweenGroups: 3
  }
]

const desertMap: GameMap = {
  id: 'desert',
  name: 'Desert Oasis',
  width: 20,
  height: 15,
  tiles,
  path,
  entryPoint: { x: 0, y: 2 },
  exitPoint: { x: 19, y: 12 },
  waves
}

registerMap(desertMap)

export { desertMap }
