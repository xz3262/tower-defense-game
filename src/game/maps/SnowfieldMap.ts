import { GameMap, WaveDefinition } from '../../types'
import { registerMap } from './MapData'

const TILE_SIZE = 40
const GRID_WIDTH = 20
const GRID_HEIGHT = 15

// Create spiral path from outside edge to center exit
const createSpiralPath = (): { tiles: string[][], path: { x: number, y: number }[] } => {
  const tiles: string[][] = Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill('grass'))
  const path: { x: number, y: number }[] = []
  
  // Spiral path coordinates (outside to center)
  const spiralPoints = [
    // Outer ring - top row left to right
    { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 },
    { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 },
    { x: 10, y: 0 }, { x: 11, y: 0 }, { x: 12, y: 0 }, { x: 13, y: 0 }, { x: 14, y: 0 },
    { x: 15, y: 0 }, { x: 16, y: 0 }, { x: 17, y: 0 }, { x: 18, y: 0 }, { x: 19, y: 0 },
    // Right column top to bottom
    { x: 19, y: 1 }, { x: 19, y: 2 }, { x: 19, y: 3 }, { x: 19, y: 4 }, { x: 19, y: 5 },
    { x: 19, y: 6 }, { x: 19, y: 7 }, { x: 19, y: 8 }, { x: 19, y: 9 }, { x: 19, y: 10 },
    { x: 19, y: 11 }, { x: 19, y: 12 }, { x: 19, y: 13 }, { x: 19, y: 14 },
    // Bottom row right to left
    { x: 18, y: 14 }, { x: 17, y: 14 }, { x: 16, y: 14 }, { x: 15, y: 14 }, { x: 14, y: 14 },
    { x: 13, y: 14 }, { x: 12, y: 14 }, { x: 11, y: 14 }, { x: 10, y: 14 }, { x: 9, y: 14 },
    { x: 8, y: 14 }, { x: 7, y: 14 }, { x: 6, y: 14 }, { x: 5, y: 14 }, { x: 4, y: 14 },
    { x: 3, y: 14 }, { x: 2, y: 14 }, { x: 1, y: 14 }, { x: 0, y: 14 },
    // Left column bottom to top
    { x: 0, y: 13 }, { x: 0, y: 12 }, { x: 0, y: 11 }, { x: 0, y: 10 }, { x: 0, y: 9 },
    { x: 0, y: 8 }, { x: 0, y: 7 }, { x: 0, y: 6 }, { x: 0, y: 5 }, { x: 0, y: 4 },
    { x: 0, y: 3 }, { x: 0, y: 2 },
    // Second ring - top
    { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 },
    { x: 6, y: 2 }, { x: 7, y: 2 }, { x: 8, y: 2 }, { x: 9, y: 2 }, { x: 10, y: 2 },
    { x: 11, y: 2 }, { x: 12, y: 2 }, { x: 13, y: 2 }, { x: 14, y: 2 }, { x: 15, y: 2 },
    { x: 16, y: 2 }, { x: 17, y: 2 }, { x: 18, y: 2 },
    // Second ring - right
    { x: 18, y: 3 }, { x: 18, y: 4 }, { x: 18, y: 5 }, { x: 18, y: 6 }, { x: 18, y: 7 },
    { x: 18, y: 8 }, { x: 18, y: 9 }, { x: 18, y: 10 }, { x: 18, y: 11 }, { x: 18, y: 12 },
    { x: 18, y: 13 },
    // Second ring - bottom
    { x: 17, y: 13 }, { x: 16, y: 13 }, { x: 15, y: 13 }, { x: 14, y: 13 }, { x: 13, y: 13 },
    { x: 12, y: 13 }, { x: 11, y: 13 }, { x: 10, y: 13 }, { x: 9, y: 13 }, { x: 8, y: 13 },
    { x: 7, y: 13 }, { x: 6, y: 13 }, { x: 5, y: 13 }, { x: 4, y: 13 }, { x: 3, y: 13 },
    { x: 2, y: 13 },
    // Second ring - left
    { x: 2, y: 12 }, { x: 2, y: 11 }, { x: 2, y: 10 }, { x: 2, y: 9 }, { x: 2, y: 8 },
    { x: 2, y: 7 }, { x: 2, y: 6 }, { x: 2, y: 5 }, { x: 2, y: 4 }, { x: 2, y: 3 },
    // Third ring - top
    { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 6, y: 3 }, { x: 7, y: 3 },
    { x: 8, y: 3 }, { x: 9, y: 3 }, { x: 10, y: 3 }, { x: 11, y: 3 }, { x: 12, y: 3 },
    { x: 13, y: 3 }, { x: 14, y: 3 }, { x: 15, y: 3 }, { x: 16, y: 3 }, { x: 17, y: 3 },
    // Third ring - right
    { x: 17, y: 4 }, { x: 17, y: 5 }, { x: 17, y: 6 }, { x: 17, y: 7 }, { x: 17, y: 8 },
    { x: 17, y: 9 }, { x: 17, y: 10 }, { x: 17, y: 11 }, { x: 17, y: 12 },
    // Third ring - bottom
    { x: 16, y: 12 }, { x: 15, y: 12 }, { x: 14, y: 12 }, { x: 13, y: 12 }, { x: 12, y: 12 },
    { x: 11, y: 12 }, { x: 10, y: 12 }, { x: 9, y: 12 }, { x: 8, y: 12 }, { x: 7, y: 12 },
    { x: 6, y: 12 }, { x: 5, y: 12 }, { x: 4, y: 12 }, { x: 3, y: 12 },
    // Third ring - left
    { x: 3, y: 11 }, { x: 3, y: 10 }, { x: 3, y: 9 }, { x: 3, y: 8 }, { x: 3, y: 7 },
    { x: 3, y: 6 }, { x: 3, y: 5 }, { x: 3, y: 4 },
    // Fourth ring - top
    { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 }, { x: 7, y: 4 }, { x: 8, y: 4 },
    { x: 9, y: 4 }, { x: 10, y: 4 }, { x: 11, y: 4 }, { x: 12, y: 4 }, { x: 13, y: 4 },
    { x: 14, y: 4 }, { x: 15, y: 4 }, { x: 16, y: 4 },
    // Fourth ring - right
    { x: 16, y: 5 }, { x: 16, y: 6 }, { x: 16, y: 7 }, { x: 16, y: 8 }, { x: 16, y: 9 },
    { x: 16, y: 10 }, { x: 16, y: 11 },
    // Fourth ring - bottom
    { x: 15, y: 11 }, { x: 14, y: 11 }, { x: 13, y: 11 }, { x: 12, y: 11 }, { x: 11, y: 11 },
    { x: 10, y: 11 }, { x: 9, y: 11 }, { x: 8, y: 11 }, { x: 7, y: 11 }, { x: 6, y: 11 },
    { x: 5, y: 11 }, { x: 4, y: 11 },
    // Fourth ring - left
    { x: 4, y: 10 }, { x: 4, y: 9 }, { x: 4, y: 8 }, { x: 4, y: 7 }, { x: 4, y: 6 },
    { x: 4, y: 5 },
    // Fifth ring - top
    { x: 5, y: 5 }, { x: 6, y: 5 }, { x: 7, y: 5 }, { x: 8, y: 5 }, { x: 9, y: 5 },
    { x: 10, y: 5 }, { x: 11, y: 5 }, { x: 12, y: 5 }, { x: 13, y: 5 }, { x: 14, y: 5 },
    { x: 15, y: 5 },
    // Fifth ring - right
    { x: 15, y: 6 }, { x: 15, y: 7 }, { x: 15, y: 8 }, { x: 15, y: 9 }, { x: 15, y: 10 },
    // Fifth ring - bottom
    { x: 14, y: 10 }, { x: 13, y: 10 }, { x: 12, y: 10 }, { x: 11, y: 10 }, { x: 10, y: 10 },
    { x: 9, y: 10 }, { x: 8, y: 10 }, { x: 7, y: 10 }, { x: 6, y: 10 }, { x: 5, y: 10 },
    // Fifth ring - left
    { x: 5, y: 9 }, { x: 5, y: 8 }, { x: 5, y: 7 }, { x: 5, y: 6 },
    // Sixth ring - top
    { x: 6, y: 6 }, { x: 7, y: 6 }, { x: 8, y: 6 }, { x: 9, y: 6 }, { x: 10, y: 6 },
    { x: 11, y: 6 }, { x: 12, y: 6 }, { x: 13, y: 6 }, { x: 14, y: 6 },
    // Sixth ring - right
    { x: 14, y: 7 }, { x: 14, y: 8 }, { x: 14, y: 9 },
    // Sixth ring - bottom
    { x: 13, y: 9 }, { x: 12, y: 9 }, { x: 11, y: 9 }, { x: 10, y: 9 }, { x: 9, y: 9 },
    { x: 8, y: 9 }, { x: 7, y: 9 }, { x: 6, y: 9 },
    // Sixth ring - left
    { x: 6, y: 8 }, { x: 6, y: 7 },
    // Center (exit)
    { x: 7, y: 7 }, { x: 8, y: 7 }, { x: 9, y: 7 }, { x: 10, y: 7 }, { x: 11, y: 7 },
    { x: 12, y: 7 }, { x: 13, y: 7 },
    { x: 7, y: 8 }, { x: 8, y: 8 }, { x: 9, y: 8 }, { x: 10, y: 8 }, { x: 11, y: 8 },
    { x: 12, y: 8 }, { x: 13, y: 8 },
  ]
  
  // Mark path tiles
  for (const point of spiralPoints) {
    tiles[point.y][point.x] = 'path'
    path.push({ x: point.x * TILE_SIZE + TILE_SIZE / 2, y: point.y * TILE_SIZE + TILE_SIZE / 2 })
  }
  
  // Add frozen lakes (water tiles) in some areas
  const frozenLakePositions = [
    { x: 5, y: 1 }, { x: 6, y: 1 }, { x: 5, y: 2 },
    { x: 12, y: 5 }, { x: 13, y: 5 }, { x: 12, y: 6 }, { x: 13, y: 6 },
    { x: 8, y: 9 }, { x: 9, y: 9 }, { x: 8, y: 10 }, { x: 9, y: 10 },
    { x: 1, y: 6 }, { x: 2, y: 6 }, { x: 1, y: 7 },
    { x: 16, y: 6 }, { x: 17, y: 6 }, { x: 16, y: 7 },
  ]
  
  for (const lake of frozenLakePositions) {
    if (tiles[lake.y][lake.x] === 'grass') {
      tiles[lake.y][lake.x] = 'water'
    }
  }
  
  // Add some rocks
  const rockPositions = [
    { x: 8, y: 1 }, { x: 15, y: 1 }, { x: 1, y: 10 }, { x: 18, y: 10 },
    { x: 10, y: 2 }, { x: 5, y: 13 }, { x: 14, y: 13 }
  ]
  
  for (const rock of rockPositions) {
    if (tiles[rock.y][rock.x] === 'grass') {
      tiles[rock.y][rock.x] = 'rock'
    }
  }
  
  // Entry point at start of spiral
  tiles[0][0] = 'entry'
  
  // Exit point at center
  tiles[7][10] = 'exit'
  
  return { tiles, path }
}

const { tiles: mapTiles, path: mapPath } = createSpiralPath()

// Wave definitions - 15 waves with all enemy types gradually introduced
const snowfieldWaves: WaveDefinition[] = [
  // Wave 1-3: Basic enemies
  {
    waveNumber: 1,
    groups: [
      { enemyType: 'basic', count: 5, spawnInterval: 1.5 }
    ],
    delayBetweenGroups: 2
  },
  {
    waveNumber: 2,
    groups: [
      { enemyType: 'basic', count: 8, spawnInterval: 1.2 }
    ],
    delayBetweenGroups: 2
  },
  {
    waveNumber: 3,
    groups: [
      { enemyType: 'basic', count: 10, spawnInterval: 1.0 }
    ],
    delayBetweenGroups: 2
  },
  // Wave 4-5: Fast enemies introduced
  {
    waveNumber: 4,
    groups: [
      { enemyType: 'basic', count: 6, spawnInterval: 1.2 },
      { enemyType: 'fast', count: 4, spawnInterval: 1.0 }
    ],
    delayBetweenGroups: 3
  },
  {
    waveNumber: 5,
    groups: [
      { enemyType: 'fast', count: 8, spawnInterval: 0.8 },
      { enemyType: 'basic', count: 5, spawnInterval: 1.2 }
    ],
    delayBetweenGroups: 3
  },
  // Wave 6-7: Tank enemies introduced
  {
    waveNumber: 6,
    groups: [
      { enemyType: 'basic', count: 8, spawnInterval: 1.0 },
      { enemyType: 'tank', count: 2, spawnInterval: 3.0 }
    ],
    delayBetweenGroups: 3
  },
  {
    waveNumber: 7,
    groups: [
      { enemyType: 'tank', count: 3, spawnInterval: 2.5 },
      { enemyType: 'fast', count: 6, spawnInterval: 0.8 }
    ],
    delayBetweenGroups: 3
  },
  // Wave 8: Flying enemies
  {
    waveNumber: 8,
    groups: [
      { enemyType: 'basic', count: 10, spawnInterval: 1.0 },
      { enemyType: 'flying', count: 5, spawnInterval: 1.5 }
    ],
    delayBetweenGroups: 3
  },
  // Wave 9: Stealth enemies
  {
    waveNumber: 9,
    groups: [
      { enemyType: 'stealth', count: 6, spawnInterval: 1.2 },
      { enemyType: 'basic', count: 8, spawnInterval: 1.0 }
    ],
    delayBetweenGroups: 3
  },
  // Wave 10: Healer enemies
  {
    waveNumber: 10,
    groups: [
      { enemyType: 'healer', count: 3, spawnInterval: 2.0 },
      { enemyType: 'tank', count: 3, spawnInterval: 2.5 },
      { enemyType: 'basic', count: 10, spawnInterval: 1.0 }
    ],
    delayBetweenGroups: 3
  },
  // Wave 11: Splitter enemies
  {
    waveNumber: 11,
    groups: [
      { enemyType: 'splitter', count: 4, spawnInterval: 2.0 },
      { enemyType: 'fast', count: 8, spawnInterval: 0.8 }
    ],
    delayBetweenGroups: 3
  },
  // Wave 12: Shield enemies
  {
    waveNumber: 12,
    groups: [
      { enemyType: 'shield', count: 5, spawnInterval: 1.5 },
      { enemyType: 'healer', count: 2, spawnInterval: 2.5 },
      { enemyType: 'basic', count: 10, spawnInterval: 1.0 }
    ],
    delayBetweenGroups: 3
  },
  // Wave 13: Speed aura enemies
  {
    waveNumber: 13,
    groups: [
      { enemyType: 'speedaura', count: 3, spawnInterval: 2.0 },
      { enemyType: 'fast', count: 10, spawnInterval: 0.6 },
      { enemyType: 'tank', count: 3, spawnInterval: 2.5 }
    ],
    delayBetweenGroups: 3
  },
  // Wave 14: First boss - Dragon
  {
    waveNumber: 14,
    groups: [
      { enemyType: 'boss_dragon', count: 1, spawnInterval: 0 },
      { enemyType: 'flying', count: 8, spawnInterval: 1.0 }
    ],
    delayBetweenGroups: 5
  },
  // Wave 15: Final boss - Necromancer
  {
    waveNumber: 15,
    groups: [
      { enemyType: 'boss_necromancer', count: 1, spawnInterval: 0 },
      { enemyType: 'shield', count: 5, spawnInterval: 1.5 },
      { enemyType: 'healer', count: 3, spawnInterval: 2.0 }
    ],
    delayBetweenGroups: 5
  }
]

export const snowfieldMap: GameMap = {
  id: 'snowfield',
  name: 'Snowfield',
  width: GRID_WIDTH,
  height: GRID_HEIGHT,
  tiles: mapTiles,
  path: mapPath,
  entryPoint: { x: 0, y: 0 },
  exitPoint: { x: 10, y: 7 },
  waves: snowfieldWaves
}

// Register the map
registerMap(snowfieldMap)
