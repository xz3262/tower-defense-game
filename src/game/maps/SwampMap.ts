import { GameMap, WaveDefinition, EnemyGroup } from '../../types'
import { registerMap } from './MapData'

const createSwampTiles = (): string[][] => {
  const tiles: string[][] = []
  
  // Initialize all as water
  for (let y = 0; y < 15; y++) {
    tiles[y] = []
    for (let x = 0; x < 20; x++) {
      tiles[y][x] = 'water'
    }
  }
  
  // Winding path through swamp - entry at (0,2), exit at (19,12)
  const pathPoints = [
    { x: 0, y: 2 }, { x: 3, y: 2 }, { x: 3, y: 4 }, { x: 1, y: 4 },
    { x: 1, y: 6 }, { x: 4, y: 6 }, { x: 4, y: 3 }, { x: 7, y: 3 },
    { x: 7, y: 7 }, { x: 5, y: 7 }, { x: 5, y: 9 }, { x: 8, y: 9 },
    { x: 8, y: 5 }, { x: 11, y: 5 }, { x: 11, y: 8 }, { x: 9, y: 8 },
    { x: 9, y: 10 }, { x: 12, y: 10 }, { x: 12, y: 7 }, { x: 15, y: 7 },
    { x: 15, y: 10 }, { x: 13, y: 10 }, { x: 13, y: 12 }, { x: 16, y: 12 },
    { x: 16, y: 14 }, { x: 19, y: 14 }
  ]
  
  // Fill path tiles
  for (let i = 0; i < pathPoints.length - 1; i++) {
    const start = pathPoints[i]
    const end = pathPoints[i + 1]
    
    if (start.x === end.x) {
      // Vertical
      const minY = Math.min(start.y, end.y)
      const maxY = Math.max(start.y, end.y)
      for (let y = minY; y <= maxY; y++) {
        tiles[y][start.x] = 'path'
      }
    } else {
      // Horizontal
      const minX = Math.min(start.x, end.x)
      const maxX = Math.max(start.x, end.x)
      for (let x = minX; x <= maxX; x++) {
        tiles[start.y][x] = 'path'
      }
    }
  }
  
  // Entry and exit
  tiles[2][0] = 'entry'
  tiles[14][19] = 'exit'
  
  // Add some grass patches for building (narrow spaces)
  const grassPatches = [
    { x: 2, y: 3 }, { x: 0, y: 3 }, { x: 2, y: 5 }, { x: 0, y: 5 },
    { x: 2, y: 7 }, { x: 3, y: 5 }, { x: 5, y: 4 }, { x: 6, y: 4 },
    { x: 6, y: 6 }, { x: 6, y: 8 }, { x: 7, y: 6 }, { x: 8, y: 8 },
    { x: 9, y: 7 }, { x: 10, y: 6 }, { x: 10, y: 8 }, { x: 10, y: 9 },
    { x: 11, y: 6 }, { x: 12, y: 6 }, { x: 13, y: 8 }, { x: 14, y: 8 },
    { x: 14, y: 9 }, { x: 14, y: 11 }, { x: 15, y: 8 }, { x: 16, y: 8 },
    { x: 17, y: 9 }, { x: 18, y: 10 }, { x: 17, y: 11 }, { x: 18, y: 12 },
    { x: 17, y: 13 }, { x: 18, y: 13 }, { x: 2, y: 1 }, { x: 4, y: 2 },
    { x: 6, y: 2 }, { x: 8, y: 4 }, { x: 10, y: 4 }, { x: 12, y: 4 },
    { x: 14, y: 6 }, { x: 16, y: 6 }, { x: 18, y: 8 }, { x: 17, y: 10 }
  ]
  
  for (const patch of grassPatches) {
    if (tiles[patch.y][patch.x] === 'water') {
      tiles[patch.y][patch.x] = 'grass'
    }
  }
  
  // Add some rocks for decoration
  const rocks = [
    { x: 5, y: 2 }, { x: 9, y: 3 }, { x: 13, y: 5 }, { x: 2, y: 8 },
    { x: 7, y: 9 }, { x: 11, y: 11 }, { x: 15, y: 13 }, { x: 4, y: 10 }
  ]
  
  for (const rock of rocks) {
    if (tiles[rock.y][rock.x] === 'water') {
      tiles[rock.y][rock.x] = 'rock'
    }
  }
  
  return tiles
}

const createSwampPath = (): { x: number; y: number }[] => {
  return [
    { x: 0, y: 2 }, { x: 3, y: 2 }, { x: 3, y: 4 }, { x: 1, y: 4 },
    { x: 1, y: 6 }, { x: 4, y: 6 }, { x: 4, y: 3 }, { x: 7, y: 3 },
    { x: 7, y: 7 }, { x: 5, y: 7 }, { x: 5, y: 9 }, { x: 8, y: 9 },
    { x: 8, y: 5 }, { x: 11, y: 5 }, { x: 11, y: 8 }, { x: 9, y: 8 },
    { x: 9, y: 10 }, { x: 12, y: 10 }, { x: 12, y: 7 }, { x: 15, y: 7 },
    { x: 15, y: 10 }, { x: 13, y: 10 }, { x: 13, y: 12 }, { x: 16, y: 12 },
    { x: 16, y: 14 }, { x: 19, y: 14 }
  ]
}

const createSwampWaves = (): WaveDefinition[] => {
  const waves: WaveDefinition[] = []
  
  // Wave 1: Basic enemies
  waves.push({
    waveNumber: 1,
    delayBetweenGroups: 2,
    groups: [
      { enemyType: 'basic', count: 5, spawnInterval: 1 }
    ]
  })
  
  // Wave 2: Fast enemies
  waves.push({
    waveNumber: 2,
    delayBetweenGroups: 2,
    groups: [
      { enemyType: 'fast', count: 6, spawnInterval: 0.8 },
      { enemyType: 'basic', count: 3, spawnInterval: 1 }
    ]
  })
  
  // Wave 3: Shield enemies introduced
  waves.push({
    waveNumber: 3,
    delayBetweenGroups: 2,
    groups: [
      { enemyType: 'shield', count: 3, spawnInterval: 1.5 },
      { enemyType: 'basic', count: 5, spawnInterval: 1 }
    ]
  })
  
  // Wave 4: Healer enemies introduced
  waves.push({
    waveNumber: 4,
    delayBetweenGroups: 2,
    groups: [
      { enemyType: 'healer', count: 2, spawnInterval: 2 },
      { enemyType: 'basic', count: 6, spawnInterval: 1 },
      { enemyType: 'fast', count: 3, spawnInterval: 0.8 }
    ]
  })
  
  // Wave 5: Mixed with healers and shields
  waves.push({
    waveNumber: 5,
    delayBetweenGroups: 2,
    groups: [
      { enemyType: 'shield', count: 4, spawnInterval: 1.2 },
      { enemyType: 'healer', count: 2, spawnInterval: 1.8 },
      { enemyType: 'basic', count: 5, spawnInterval: 1 }
    ]
  })
  
  // Wave 6: Tank enemies
  waves.push({
    waveNumber: 6,
    delayBetweenGroups: 2.5,
    groups: [
      { enemyType: 'tank', count: 2, spawnInterval: 2 },
      { enemyType: 'shield', count: 3, spawnInterval: 1.2 },
      { enemyType: 'basic', count: 5, spawnInterval: 1 }
    ]
  })
  
  // Wave 7: Heavy healer wave
  waves.push({
    waveNumber: 7,
    delayBetweenGroups: 2,
    groups: [
      { enemyType: 'healer', count: 4, spawnInterval: 1.5 },
      { enemyType: 'shield', count: 4, spawnInterval: 1.2 },
      { enemyType: 'basic', count: 6, spawnInterval: 0.8 }
    ]
  })
  
  // Wave 8: Flying enemies
  waves.push({
    waveNumber: 8,
    delayBetweenGroups: 2,
    groups: [
      { enemyType: 'flying', count: 5, spawnInterval: 1 },
      { enemyType: 'healer', count: 2, spawnInterval: 1.8 },
      { enemyType: 'fast', count: 4, spawnInterval: 0.8 }
    ]
  })
  
  // Wave 9: Speed aura enemies
  waves.push({
    waveNumber: 9,
    delayBetweenGroups: 2,
    groups: [
      { enemyType: 'speedaura', count: 3, spawnInterval: 2 },
      { enemyType: 'tank', count: 2, spawnInterval: 2 },
      { enemyType: 'shield', count: 5, spawnInterval: 1 },
      { enemyType: 'basic', count: 8, spawnInterval: 0.8 }
    ]
  })
  
  // Wave 10: Heavy mixed wave
  waves.push({
    waveNumber: 10,
    delayBetweenGroups: 2,
    groups: [
      { enemyType: 'healer', count: 4, spawnInterval: 1.5 },
      { enemyType: 'shield', count: 6, spawnInterval: 1 },
      { enemyType: 'tank', count: 3, spawnInterval: 1.8 },
      { enemyType: 'fast', count: 5, spawnInterval: 0.7 }
    ]
  })
  
  // Wave 11: Pre-boss wave
  waves.push({
    waveNumber: 11,
    delayBetweenGroups: 2,
    groups: [
      { enemyType: 'speedaura', count: 3, spawnInterval: 1.5 },
      { enemyType: 'healer', count: 5, spawnInterval: 1.2 },
      { enemyType: 'shield', count: 8, spawnInterval: 0.8 },
      { enemyType: 'tank', count: 3, spawnInterval: 1.5 },
      { enemyType: 'flying', count: 4, spawnInterval: 1 }
    ]
  })
  
  // Wave 12: Boss wave - Necromancer
  waves.push({
    waveNumber: 12,
    delayBetweenGroups: 3,
    groups: [
      { enemyType: 'boss_necromancer', count: 1, spawnInterval: 0 },
      { enemyType: 'healer', count: 4, spawnInterval: 2 },
      { enemyType: 'shield', count: 6, spawnInterval: 1 },
      { enemyType: 'tank', count: 2, spawnInterval: 2 }
    ]
  })
  
  return waves
}

export const swampMap: GameMap = {
  id: 'swamp',
  name: 'Swamp Map',
  width: 20,
  height: 15,
  tiles: createSwampTiles(),
  path: createSwampPath(),
  entryPoint: { x: 0, y: 2 },
  exitPoint: { x: 19, y: 14 },
  waves: createSwampWaves()
}

registerMap(swampMap)
