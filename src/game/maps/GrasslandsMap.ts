import { GameMap, WaveDefinition } from '../../types'
import { registerMap } from './MapData'

const GRID_WIDTH = 20
const GRID_HEIGHT = 15

// S-curve path waypoints (in grid coordinates)
const pathWaypoints = [
  { x: 0, y: 7 },   // Entry
  { x: 4, y: 7 },
  { x: 4, y: 11 },
  { x: 15, y: 11 },
  { x: 15, y: 3 },
  { x: 19, y: 3 },
  { x: 19, y: 7 }   // Exit
]

// Generate tile grid with grass, path, rocks, and water
function generateTiles(): string[][] {
  const tiles: string[][] = Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill('grass'))
  
  // Mark path tiles
  for (let i = 0; i < pathWaypoints.length - 1; i++) {
    const start = pathWaypoints[i]
    const end = pathWaypoints[i + 1]
    
    if (start.x === end.x) {
      // Vertical segment
      const minY = Math.min(start.y, end.y)
      const maxY = Math.max(start.y, end.y)
      for (let y = minY; y <= maxY; y++) {
        tiles[y][start.x] = 'path'
      }
    } else {
      // Horizontal segment
      const minX = Math.min(start.x, end.x)
      const maxX = Math.max(start.x, end.x)
      for (let x = minX; x <= maxX; x++) {
        tiles[start.y][x] = 'path'
      }
    }
  }
  
  // Entry and exit tiles
  tiles[pathWaypoints[0].y][pathWaypoints[0].x] = 'entry'
  tiles[pathWaypoints[pathWaypoints.length - 1].y][pathWaypoints[pathWaypoints.length - 1].x] = 'exit'
  
  // Add decorative rocks (not on path)
  const rockPositions = [
    { x: 2, y: 2 }, { x: 6, y: 4 }, { x: 8, y: 13 },
    { x: 11, y: 1 }, { x: 13, y: 6 }, { x: 16, y: 9 },
    { x: 1, y: 12 }, { x: 17, y: 13 }, { x: 7, y: 1 }
  ]
  
  for (const pos of rockPositions) {
    if (tiles[pos.y][pos.x] === 'grass') {
      tiles[pos.y][pos.x] = 'rock'
    }
  }
  
  // Add water tiles (not on path)
  const waterPositions = [
    { x: 10, y: 5 }, { x: 10, y: 6 }, { x: 11, y: 5 },
    { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 3, y: 4 },
    { x: 17, y: 5 }, { x: 18, y: 5 }
  ]
  
  for (const pos of waterPositions) {
    if (tiles[pos.y][pos.x] === 'grass') {
      tiles[pos.y][pos.x] = 'water'
    }
  }
  
  return tiles
}

// Wave definitions
const waves: WaveDefinition[] = [
  // Wave 1: Basic enemies
  {
    waveNumber: 1,
    groups: [
      { enemyType: 'basic', count: 5, spawnInterval: 1.5 }
    ],
    delayBetweenGroups: 2
  },
  // Wave 2: More basic
  {
    waveNumber: 2,
    groups: [
      { enemyType: 'basic', count: 8, spawnInterval: 1.2 }
    ],
    delayBetweenGroups: 2
  },
  // Wave 3: Add fast enemies
  {
    waveNumber: 3,
    groups: [
      { enemyType: 'basic', count: 6, spawnInterval: 1.2 },
      { enemyType: 'fast', count: 4, spawnInterval: 1.0 }
    ],
    delayBetweenGroups: 2
  },
  // Wave 4: Mixed
  {
    waveNumber: 4,
    groups: [
      { enemyType: 'fast', count: 6, spawnInterval: 1.0 },
      { enemyType: 'basic', count: 6, spawnInterval: 1.2 }
    ],
    delayBetweenGroups: 2
  },
  // Wave 5: Add tank
  {
    waveNumber: 5,
    groups: [
      { enemyType: 'basic', count: 8, spawnInterval: 1.2 },
      { enemyType: 'tank', count: 2, spawnInterval: 3.0 }
    ],
    delayBetweenGroups: 2.5
  },
  // Wave 6: More tanks
  {
    waveNumber: 6,
    groups: [
      { enemyType: 'fast', count: 8, spawnInterval: 0.8 },
      { enemyType: 'tank', count: 3, spawnInterval: 2.5 }
    ],
    delayBetweenGroups: 2.5
  },
  // Wave 7: Heavy mix
  {
    waveNumber: 7,
    groups: [
      { enemyType: 'basic', count: 10, spawnInterval: 1.0 },
      { enemyType: 'fast', count: 6, spawnInterval: 0.8 },
      { enemyType: 'tank', count: 2, spawnInterval: 3.0 }
    ],
    delayBetweenGroups: 2
  },
  // Wave 8: Advanced
  {
    waveNumber: 8,
    groups: [
      { enemyType: 'tank', count: 4, spawnInterval: 2.5 },
      { enemyType: 'fast', count: 10, spawnInterval: 0.6 },
      { enemyType: 'basic', count: 8, spawnInterval: 1.0 }
    ],
    delayBetweenGroups: 2
  },
  // Wave 9: Pre-boss
  {
    waveNumber: 9,
    groups: [
      { enemyType: 'tank', count: 5, spawnInterval: 2.0 },
      { enemyType: 'fast', count: 12, spawnInterval: 0.5 },
      { enemyType: 'basic', count: 10, spawnInterval: 0.8 }
    ],
    delayBetweenGroups: 2
  },
  // Wave 10: Boss wave
  {
    waveNumber: 10,
    groups: [
      { enemyType: 'basic', count: 15, spawnInterval: 0.8 },
      { enemyType: 'fast', count: 8, spawnInterval: 0.6 },
      { enemyType: 'tank', count: 3, spawnInterval: 2.5 },
      { enemyType: 'boss_golem', count: 1, spawnInterval: 5.0 }
    ],
    delayBetweenGroups: 3
  }
]

export const grasslandsMap: GameMap = {
  id: 'grasslands',
  name: 'Grasslands',
  width: GRID_WIDTH,
  height: GRID_HEIGHT,
  tiles: generateTiles(),
  path: pathWaypoints,
  entryPoint: pathWaypoints[0],
  exitPoint: pathWaypoints[pathWaypoints.length - 1],
  waves
}

// Register the map
registerMap(grasslandsMap)
