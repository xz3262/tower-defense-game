export type Position = { x: number; y: number }

export type TileType = 'grass' | 'path' | 'water' | 'rock' | 'entry' | 'exit'

export type Tile = {
  type: TileType
  gridX: number
  gridY: number
  tower: TowerInstance | null
}

export type GameMap = {
  id: string
  name: string
  width: number
  height: number
  tiles: TileType[][]
  path: Position[]
  entryPoint: Position
  exitPoint: Position
  waves: WaveDefinition[]
}

export type TowerType =
  | 'arrow' | 'cannon' | 'ice' | 'fire' | 'lightning'
  | 'poison' | 'sniper' | 'laser' | 'bomb' | 'slow'
  | 'goldmine' | 'tesla'

export type TowerStats = {
  type: TowerType
  name: string
  cost: number
  damage: number
  range: number
  fireRate: number
  projectileSpeed: number
  upgradeCosts: [number, number, number]
  damagePerLevel: number
  rangePerLevel: number
  special: string
  color: string
  canTargetFlying: boolean
}

export type TowerInstance = {
  id: string
  type: TowerType
  level: number
  gridX: number
  gridY: number
  currentTarget: string | null
  lastFireTime: number
  totalDamageDealt: number
  totalKills: number
}

export type EnemyType =
  | 'basic' | 'fast' | 'tank' | 'flying' | 'stealth'
  | 'healer' | 'splitter' | 'shield' | 'speedaura'
  | 'boss_golem' | 'boss_dragon' | 'boss_necromancer'

export type EnemyStats = {
  type: EnemyType
  name: string
  maxHP: number
  speed: number
  reward: number
  armor: number
  isFlying: boolean
  isBoss: boolean
  color: string
  size: number
  special: string
}

export type EnemyInstance = {
  id: string
  type: EnemyType
  hp: number
  maxHP: number
  x: number
  y: number
  speed: number
  pathIndex: number
  progress: number
  effects: StatusEffect[]
  isAlive: boolean
  isVisible: boolean
}

export type StatusEffect = {
  type: 'slow' | 'burn' | 'poison' | 'stun'
  duration: number
  magnitude: number
  sourceId: string
}

export type ProjectileInstance = {
  id: string
  type: string
  x: number
  y: number
  targetId: string
  damage: number
  speed: number
  effect: StatusEffect | null
  isAoE: boolean
  aoERadius: number
}

export type WaveDefinition = {
  waveNumber: number
  groups: EnemyGroup[]
  delayBetweenGroups: number
}

export type EnemyGroup = {
  enemyType: EnemyType
  count: number
  spawnInterval: number
}

export type GameState = 'menu' | 'map_select' | 'playing' | 'paused' | 'victory' | 'defeat'

export type GameStore = {
  gameState: GameState
  currentMap: GameMap | null
  gold: number
  lives: number
  currentWave: number
  totalWaves: number
  score: number
  speed: number
  selectedTower: TowerType | null
  selectedPlacedTower: TowerInstance | null
  towers: TowerInstance[]
  enemies: EnemyInstance[]
  projectiles: ProjectileInstance[]
  startGame: (mapId: string) => void
  placeTower: (type: TowerType, gridX: number, gridY: number) => void
  upgradeTower: (towerId: string) => void
  sellTower: (towerId: string) => void
  startWave: () => void
  togglePause: () => void
  setSpeed: (speed: number) => void
  selectTower: (type: TowerType | null) => void
  selectPlacedTower: (tower: TowerInstance | null) => void
  addGold: (amount: number) => void
  removeLife: () => void
  tick: (deltaTime: number) => void
}
