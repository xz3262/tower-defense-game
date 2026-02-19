import { GameMap, WaveDefinition, EnemyGroup } from '../../types'
import { registerMap } from './MapData'

const createVolcanoTiles = (): GameMap['tiles'] => {
  const tiles: GameMap['tiles'] = []
  
  for (let y = 0; y < 15; y++) {
    const row: GameMap['tiles'][0] = []
    for (let x = 0; x < 20; x++) {
      // Default to volcanic rock/grass
      let tile: GameMap['tiles'][0][0] = 'grass'
      
      // Entry area (left middle)
      if (x <= 2 && y >= 6 && y <= 8) {
        tile = 'entry'
      }
      // Exit area (right middle)
      else if (x >= 17 && y >= 6 && y <= 8) {
        tile = 'exit'
      }
      // Upper path
      else if (
        (x >= 3 && x <= 7 && y === 7 - (x - 3)) ||
        (x >= 3 && x <= 7 && y === 8 - (x - 3)) ||
        (x >= 3 && x <= 7 && y === 6 - (x - 3)) ||
        (x >= 8 && x <= 10 && y === 2) ||
        (x >= 8 && x <= 10 && y === 3) ||
        (x >= 8 && x <= 10 && y === 1) ||
        (x >= 11 && x <= 14 && y === x - 9) ||
        (x >= 11 && x <= 14 && y === x - 8) ||
        (x >= 11 && x <= 14 && y === x - 10)
      ) {
        tile = 'path'
      }
      // Lower path
      else if (
        (x >= 3 && x <= 7 && y === 7 + (x - 3)) ||
        (x >= 3 && x <= 7 && y === 8 + (x - 3)) ||
        (x >= 3 && x <= 7 && y === 6 + (x - 3)) ||
        (x >= 8 && x <= 10 && y === 12) ||
        (x >= 8 && x <= 10 && y === 13) ||
        (x >= 8 && x <= 10 && y === 11) ||
        (x >= 11 && x <= 14 && y === 21 - x) ||
        (x >= 11 && x <= 14 && y === 20 - x) ||
        (x >= 11 && x <= 14 && y === 22 - x)
      ) {
        tile = 'path'
      }
      // Merge section
      else if (x >= 14 && x <= 16 && y >= 6 && y <= 8) {
        tile = 'path'
      }
      // Lava pools (water = lava)
      else if (
        (x === 4 && y === 3) ||
        (x === 5 && y === 4) ||
        (x === 15 && y === 3) ||
        (x === 4 && y === 11) ||
        (x === 5 && y === 10) ||
        (x === 15 && y === 11) ||
        (x >= 9 && x <= 11 && y === 6) ||
        (x >= 9 && x <= 11 && y === 8)
      ) {
        tile = 'water'
      }
      // Rock formations
      else if (
        (x === 2 && y === 3) ||
        (x === 2 && y === 11) ||
        (x === 17 && y === 3) ||
        (x === 17 && y === 11) ||
        (x === 6 && y === 1) ||
        (x === 6 && y === 13) ||
        (x === 13 && y === 1) ||
        (x === 13 && y === 13)
      ) {
        tile = 'rock'
      }
      
      row.push(tile)
    }
    tiles.push(row)
  }
  
  return tiles
}

const createVolcanoPath = (): GameMap['path'] => {
  // Combined path that represents both routes
  // Enemies will randomly choose upper or lower branch
  const path: GameMap['path'] = []
  
  // Entry to split point
  path.push({ x: 0, y: 7 })
  path.push({ x: 1, y: 7 })
  path.push({ x: 2, y: 7 })
  
  // Upper branch
  path.push({ x: 3, y: 6 })
  path.push({ x: 4, y: 5 })
  path.push({ x: 5, y: 4 })
  path.push({ x: 6, y: 3 })
  path.push({ x: 7, y: 2 })
  path.push({ x: 8, y: 2 })
  path.push({ x: 9, y: 2 })
  path.push({ x: 10, y: 3 })
  path.push({ x: 11, y: 4 })
  path.push({ x: 12, y: 5 })
  path.push({ x: 13, y: 6 })
  path.push({ x: 14, y: 7 })
  
  // Lower branch (alternative path)
  // Note: The game will need to handle path splitting
  // For now, we define the upper path as primary
  // Lower path coordinates: (3,8),(4,9),(5,10),(6,11),(7,12),(8,12),(9,12),(10,11),(11,10),(12,9),(13,8),(14,7)
  
  // Merge to exit
  path.push({ x: 15, y: 7 })
  path.push({ x: 16, y: 7 })
  path.push({ x: 17, y: 7 })
  path.push({ x: 18, y: 7 })
  path.push({ x: 19, y: 7 })
  
  return path
}

const createVolcanoWaves = (): WaveDefinition[] => {
  const waves: WaveDefinition[] = []
  
  // Waves 1-3: Basic enemies, split between paths
  waves.push({
    waveNumber: 1,
    delayBetweenGroups: 2,
    groups: [
      { enemyType: 'basic', count: 5, spawnInterval: 1 },
      { enemyType: 'basic', count: 5, spawnInterval: 1 }
    ]
  })
  
  waves.push({
    waveNumber: 2,
    delayBetweenGroups: 2,
    groups: [
      { enemyType: 'basic', count: 8, spawnInterval: 0.8 },
      { enemyType: 'fast', count: 3, spawnInterval: 1.2 }
    ]
  })
  
  waves.push({
    waveNumber: 3,
    delayBetweenGroups: 2,
    groups: [
      { enemyType: 'fast', count: 6, spawnInterval: 0.8 },
      { enemyType: 'basic', count: 8, spawnInterval: 0.8 }
    ]
  })
  
  // Waves 4-6: Introduce tanks and flying
  waves.push({
    waveNumber: 4,
    delayBetweenGroups: 2.5,
    groups: [
      { enemyType: 'tank', count: 2, spawnInterval: 2 },
      { enemyType: 'basic', count: 8, spawnInterval: 0.8 }
    ]
  })
  
  waves.push({
    waveNumber: 5,
    delayBetweenGroups: 2.5,
    groups: [
      { enemyType: 'flying', count: 4, spawnInterval: 1 },
      { enemyType: 'fast', count: 6, spawnInterval: 0.8 }
    ]
  })
  
  waves.push({
    waveNumber: 6,
    delayBetweenGroups: 2.5,
    groups: [
      { enemyType: 'tank', count: 3, spawnInterval: 1.5 },
      { enemyType: 'flying', count: 5, spawnInterval: 0.8 },
      { enemyType: 'basic', count: 10, spawnInterval: 0.6 }
    ]
  })
  
  // Waves 7-9: Special enemies
  waves.push({
    waveNumber: 7,
    delayBetweenGroups: 3,
    groups: [
      { enemyType: 'stealth', count: 4, spawnInterval: 1.2 },
      { enemyType: 'shield', count: 2, spawnInterval: 2 },
      { enemyType: 'basic', count: 8, spawnInterval: 0.8 }
    ]
  })
  
  waves.push({
    waveNumber: 8,
    delayBetweenGroups: 3,
    groups: [
      { enemyType: 'healer', count: 2, spawnInterval: 2 },
      { enemyType: 'tank', count: 4, spawnInterval: 1.5 },
      { enemyType: 'fast', count: 8, spawnInterval: 0.6 }
    ]
  })
  
  waves.push({
    waveNumber: 9,
    delayBetweenGroups: 3,
    groups: [
      { enemyType: 'splitter', count: 3, spawnInterval: 1.5 },
      { enemyType: 'speedaura', count: 2, spawnInterval: 2 },
      { enemyType: 'flying', count: 6, spawnInterval: 0.8 },
      { enemyType: 'basic', count: 12, spawnInterval: 0.5 }
    ]
  })
  
  // Waves 10-11: Heavy assault
  waves.push({
    waveNumber: 10,
    delayBetweenGroups: 3,
    groups: [
      { enemyType: 'tank', count: 6, spawnInterval: 1.2 },
      { enemyType: 'shield', count: 4, spawnInterval: 1.5 },
      { enemyType: 'stealth', count: 6, spawnInterval: 1 },
      { enemyType: 'fast', count: 10, spawnInterval: 0.5 }
    ]
  })
  
  waves.push({
    waveNumber: 11,
    delayBetweenGroups: 3,
    groups: [
      { enemyType: 'healer', count: 4, spawnInterval: 1.5 },
      { enemyType: 'speedaura', count: 3, spawnInterval: 1.8 },
      { enemyType: 'tank', count: 8, spawnInterval: 1 },
      { enemyType: 'flying', count: 10, spawnInterval: 0.6 },
      { enemyType: 'splitter', count: 5, spawnInterval: 1 }
    ]
  })
  
  // Wave 12: Boss wave with Golem
  waves.push({
    waveNumber: 12,
    delayBetweenGroups: 4,
    groups: [
      { enemyType: 'boss_golem', count: 1, spawnInterval: 0 },
      { enemyType: 'tank', count: 8, spawnInterval: 1 },
      { enemyType: 'shield', count: 6, spawnInterval: 1.2 },
      { enemyType: 'basic', count: 15, spawnInterval: 0.4 }
    ]
  })
  
  return waves
}

export const volcanoMap: GameMap = {
  id: 'volcano',
  name: 'Volcano Lair',
  width: 20,
  height: 15,
  tiles: createVolcanoTiles(),
  path: createVolcanoPath(),
  entryPoint: { x: 0, y: 7 },
  exitPoint: { x: 19, y: 7 },
  waves: createVolcanoWaves()
}

// Register the map
registerMap(volcanoMap)
